import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Save, X, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Progress } from "@/components/ui/progress";
import { useAdminSave } from '@/contexts/AdminSaveContext';
import { AdminWrapper } from './AdminWrapper';

interface WhyChooseCard {
  id: string;
  title: string;
  description: string;
  media_url?: string;
  media_type?: 'image' | 'video';
  media_alt_text?: string;
  order_index: number;
}

export const WhyChooseIqifyEditor = () => {
  const { toast } = useToast();
  const { registerSaveHandler, unregisterSaveHandler } = useAdminSave();
  const supabase = createClientComponentClient();
  const [cards, setCards] = useState<WhyChooseCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const loadCards = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('why_choose_cards')
        .select('*')
        .order('order_index');

      if (error) {
        console.error('Error loading cards:', error);
        throw error;
      }

      if (data) {
        const formattedCards: WhyChooseCard[] = data.map(card => {
          // Ensure the media_url is properly formatted
          let mediaUrl = card.media_url as string | null;
          if (mediaUrl && !mediaUrl.startsWith('http')) {
            // If it's a storage path, get the public URL
            const { data: { publicUrl } } = supabase.storage
              .from('why-choose-iqify-media')
              .getPublicUrl(mediaUrl);
            mediaUrl = publicUrl;
          }

          return {
            id: String(card.id),
            title: String(card.title),
            description: String(card.description),
            media_url: mediaUrl || undefined,
            media_type: card.media_type as 'image' | 'video' || undefined,
            media_alt_text: card.media_alt_text ? String(card.media_alt_text) : undefined,
            order_index: Number(card.order_index)
          };
        });
        setCards(formattedCards);
      } else {
        setCards([]);
      }
    } catch (error) {
      console.error('Error loading cards:', error);
      toast({
        title: "Error",
        description: "Failed to load cards. Please check the console for details.",
        variant: "destructive",
      });
      setCards([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const saveHandler = useCallback(async () => {
    try {
      setIsSaving(true);
      setSaveError(null);

      // Prepare cards for saving
      const cardsToSave = cards.map(card => {
        // If media_url is a full URL, extract just the path
        let mediaUrl = card.media_url;
        if (mediaUrl && mediaUrl.includes('why-choose-iqify-media')) {
          const urlParts = mediaUrl.split('why-choose-iqify-media/');
          if (urlParts.length > 1) {
            mediaUrl = urlParts[1];
          }
        }

        return {
          id: card.id.startsWith('temp_') ? undefined : card.id,
          title: card.title,
          description: card.description,
          media_url: mediaUrl,
          media_type: card.media_type,
          media_alt_text: card.media_alt_text,
          order_index: card.order_index
        };
      });

      // Upsert the cards
      const { error: upsertError } = await supabase
        .from('why_choose_cards')
        .upsert(cardsToSave, { onConflict: 'id' });

      if (upsertError) {
        console.error('Error upserting cards:', upsertError);
        throw upsertError;
      }

      // Reload cards to get fresh IDs
      await loadCards();

      toast({
        title: "Success",
        description: "Cards saved successfully",
      });
    } catch (error) {
      console.error('Error saving cards:', error);
      setSaveError(error instanceof Error ? error.message : 'Failed to save cards');
      toast({
        title: "Error",
        description: "Failed to save cards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [cards, toast, loadCards]);

  const handleFileUpload = async (file: File, cardId: string) => {
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const fileExt = file.name.split('.').pop();
      const fileName = `${cardId}-${Date.now()}.${fileExt}`;
      const filePath = `why-choose/${fileName}`;

      // Upload the file
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('why-choose-iqify-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      if (!uploadData?.path) {
        throw new Error('No path returned from upload');
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('why-choose-iqify-media')
        .getPublicUrl(uploadData.path);

      // Store the path in the database, not the full URL
      const mediaType = file.type.startsWith('video/') ? 'video' : 'image';

      // Update the card with the new media path
      setCards(prevCards => prevCards.map(card => 
        card.id === cardId 
          ? { 
              ...card, 
              media_url: uploadData.path, // Store the path instead of the full URL
              media_type: mediaType,
              media_alt_text: file.name
            }
          : card
      ));

      toast({
        title: "Success",
        description: "Media uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload media. Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleUrlInput = async (url: string, cardId: string) => {
    try {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        throw new Error('URL must start with http:// or https://');
      }

      const mediaType = url.toLowerCase().endsWith('.mp4') ? 'video' : 'image';
      const validImageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const isImage = validImageExtensions.some(ext => url.toLowerCase().endsWith(ext));

      if (mediaType === 'image' && !isImage) {
        throw new Error('URL must point to a valid image file (jpg, jpeg, png, gif, webp)');
      }

      setCards(cards.map(card => 
        card.id === cardId 
          ? { ...card, media_url: url, media_type: mediaType }
          : card
      ));

      toast({
        title: "Success",
        description: "Media URL added successfully",
      });
    } catch (error) {
      console.error('Error adding URL:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add media URL",
        variant: "destructive",
      });
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);

      // First, get all existing card IDs
      const { data: existingCards, error: fetchError } = await supabase
        .from('why_choose_cards')
        .select('id');

      if (fetchError) throw fetchError;

      // Delete all existing cards
      if (existingCards && existingCards.length > 0) {
        const { error: deleteError } = await supabase
          .from('why_choose_cards')
          .delete()
          .in('id', existingCards.map(card => card.id));

        if (deleteError) throw deleteError;
      }

      // Insert new cards, ensuring we don't include temporary IDs
      const cardsToInsert = cards.map(card => ({
        title: card.title,
        description: card.description,
        media_url: card.media_url,
        media_type: card.media_type,
        media_alt_text: card.media_alt_text,
        order_index: card.order_index
      }));

      const { error: insertError } = await supabase
        .from('why_choose_cards')
        .insert(cardsToInsert);

      if (insertError) throw insertError;

      // Reload the cards to get their new IDs
      const { data: newCards, error: reloadError } = await supabase
        .from('why_choose_cards')
        .select('*')
        .order('order_index');

      if (reloadError) throw reloadError;

      if (newCards) {
        const formattedCards: WhyChooseCard[] = newCards.map(card => ({
          id: String(card.id),
          title: String(card.title),
          description: String(card.description),
          media_url: card.media_url ? String(card.media_url) : undefined,
          media_type: card.media_type as 'image' | 'video' || undefined,
          media_alt_text: card.media_alt_text ? String(card.media_alt_text) : undefined,
          order_index: Number(card.order_index)
        }));
        setCards(formattedCards);
      }

      toast({
        title: "Success",
        description: "Changes saved successfully",
      });
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save changes. Please check the console for details.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const addCard = () => {
    const newCard: WhyChooseCard = {
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: '',
      description: '',
      media_url: '',
      media_type: 'image',
      media_alt_text: '',
      order_index: cards.length
    };
    setCards([...cards, newCard]);
  };

  const removeCard = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const updateCardField = (id: string, field: keyof WhyChooseCard, value: string | number) => {
    setCards(cards.map(card => 
      card.id === id 
        ? { ...card, [field]: value }
        : card
    ));
  };

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  useEffect(() => {
    registerSaveHandler(saveHandler);
    return () => unregisterSaveHandler(saveHandler);
  }, [saveHandler, registerSaveHandler, unregisterSaveHandler]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading cards...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminWrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Why Choose IQify</h2>
          <Button onClick={addCard}>
            Add Card
          </Button>
        </div>
        
        {saveError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{saveError}</p>
          </div>
        )}
        
        <div className="space-y-6">
          {cards.map((card, index) => (
            <Card key={card.id}>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Text Content */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`title-${card.id}`}>Title</Label>
                      <Input
                        id={`title-${card.id}`}
                        value={card.title}
                        onChange={(e) => updateCardField(card.id, 'title', e.target.value)}
                        placeholder="Enter title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`description-${card.id}`}>Description</Label>
                      <Textarea
                        id={`description-${card.id}`}
                        value={card.description}
                        onChange={(e) => updateCardField(card.id, 'description', e.target.value)}
                        placeholder="Enter description"
                        rows={5}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`order-${card.id}`}>Order</Label>
                      <Input
                        id={`order-${card.id}`}
                        type="number"
                        value={card.order_index}
                        onChange={(e) => updateCardField(card.id, 'order_index', parseInt(e.target.value))}
                        placeholder="Enter order"
                      />
                    </div>
                  </div>

                  {/* Media Content */}
                  <div className="space-y-4">
                    <Label>Media</Label>
                    {card.media_url && (
                      <div className="mt-4">
                        {card.media_type === 'video' ? (
                          <video
                            src={card.media_url}
                            controls
                            className="w-full rounded-lg"
                            crossOrigin="anonymous"
                          />
                        ) : (
                          <img
                            src={card.media_url}
                            alt={card.media_alt_text || ''}
                            className="w-full rounded-lg"
                            crossOrigin="anonymous"
                          />
                        )}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*,video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, card.id);
                        }}
                      />
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          const url = prompt('Enter media URL:');
                          if (url) handleUrlInput(url, card.id);
                        }}
                      >
                        <Link className="h-4 w-4 mr-2" />
                        URL
                      </Button>
                    </div>
                    {isUploading && (
                      <Progress value={uploadProgress} className="w-full" />
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button
                    variant="destructive"
                    onClick={() => removeCard(card.id)}
                  >
                    Remove Card
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveChanges} className="flex items-center gap-2" disabled={isSaving}>
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </AdminWrapper>
  );
};