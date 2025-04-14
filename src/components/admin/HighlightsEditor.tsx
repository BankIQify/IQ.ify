import React, { useState, useEffect } from 'react';
import { useHighlightsContent } from '@/hooks/useHighlightsContent';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Loader2, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useToast } from "@/hooks/use-toast";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Highlight {
  id: string;
  title: string;
  description: string;
  image_url: string;
  is_visible: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export const HighlightsEditor: React.FC = () => {
  const { highlights: fetchedHighlights, loading, error, updateHighlight, deleteHighlight } = useHighlightsContent();
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (fetchedHighlights) {
      setHighlights(fetchedHighlights);
    }
  }, [fetchedHighlights]);

  const handleAddHighlight = () => {
    const newHighlight: Highlight = {
      id: `temp_${Date.now()}`,
      title: "",
      description: "",
      image_url: "",
      is_visible: true,
      order: highlights.length
    };
    setHighlights([...highlights, newHighlight]);
  };

  const handleRemoveHighlight = async (id: string) => {
    try {
      if (id.startsWith('temp_')) {
        setHighlights(highlights.filter(highlight => highlight.id !== id));
        return;
      }

      const { error } = await supabase
        .from('highlights')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHighlights(highlights.filter(highlight => highlight.id !== id));
      toast({
        title: "Success",
        description: "Highlight removed successfully",
      });
    } catch (error) {
      console.error('Error removing highlight:', error);
      toast({
        title: "Error",
        description: "Failed to remove highlight",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('highlights')
        .upsert(highlights.map(highlight => ({
          id: highlight.id.startsWith('temp_') ? undefined : highlight.id,
          title: highlight.title,
          description: highlight.description,
          image_url: highlight.image_url,
          is_visible: highlight.is_visible,
          order: highlight.order
        })));

      if (error) throw error;

      toast({
        title: "Success",
        description: "Highlights updated successfully",
      });
    } catch (error) {
      console.error('Error saving highlights:', error);
      toast({
        title: "Error",
        description: "Failed to save highlights",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        Error loading content: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Highlights from HQ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {highlights.map((highlight, index) => (
              <Card key={highlight.id} className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Highlight {index + 1}</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveHighlight(highlight.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newHighlights = [...highlights];
                          newHighlights[index] = {
                            ...highlight,
                            is_visible: !highlight.is_visible
                          };
                          setHighlights(newHighlights);
                        }}
                      >
                        {highlight.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={highlight.title}
                        onChange={(e) => {
                          const newHighlights = [...highlights];
                          newHighlights[index] = {
                            ...highlight,
                            title: e.target.value,
                          };
                          setHighlights(newHighlights);
                        }}
                        placeholder="Enter highlight title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={highlight.description}
                        onChange={(e) => {
                          const newHighlights = [...highlights];
                          newHighlights[index] = {
                            ...highlight,
                            description: e.target.value,
                          };
                          setHighlights(newHighlights);
                        }}
                        placeholder="Enter highlight description"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input
                        value={highlight.image_url}
                        onChange={(e) => {
                          const newHighlights = [...highlights];
                          newHighlights[index] = {
                            ...highlight,
                            image_url: e.target.value,
                          };
                          setHighlights(newHighlights);
                        }}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleAddHighlight}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Highlight
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 