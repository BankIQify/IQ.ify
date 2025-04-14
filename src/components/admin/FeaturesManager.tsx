import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Video, Image, Trash2, GripVertical } from "lucide-react";

interface Feature {
  id: string;
  title: string;
  description: string;
  media_url: string | null;
  media_type: 'image' | 'video' | null;
  media_path: string | null;
  order_index: number;
}

export const FeaturesManager = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [draggedItem, setDraggedItem] = useState<Feature | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .order('order_index');

      if (error) throw error;
      
      // Properly map the data to Feature interface
      const typedData: Feature[] = (data || []).map(item => ({
        id: String(item.id),
        title: String(item.title),
        description: String(item.description),
        media_url: item.media_url ? String(item.media_url) : null,
        media_type: item.media_type as 'image' | 'video' | null,
        media_path: item.media_path ? String(item.media_path) : null,
        order_index: Number(item.order_index)
      }));
      
      setFeatures(typedData);
    } catch (error) {
      console.error('Error fetching features:', error);
      toast({
        title: "Error",
        description: "Failed to fetch features",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, feature: Feature) => {
    setDraggedItem(feature);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetFeature: Feature) => {
    e.preventDefault();
    if (!draggedItem) return;

    const items = [...features];
    const draggedIndex = items.findIndex(item => item.id === draggedItem.id);
    const targetIndex = items.findIndex(item => item.id === targetFeature.id);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const [removed] = items.splice(draggedIndex, 1);
    items.splice(targetIndex, 0, removed);

    setFeatures(items);

    // Update order in database
    try {
      const updates = items.map((item, index) => ({
        id: item.id,
        order_index: index
      }));

      const { error } = await supabase
        .from('features')
        .upsert(updates);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update feature order",
        variant: "destructive",
      });
    }

    setDraggedItem(null);
  };

  const handleFileUpload = async (file: File, featureId: string) => {
    if (!file) return;
    
    try {
      setUploading(true);
      
      // Validate file type
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        throw new Error('Invalid file type. Please upload an image or video.');
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10MB');
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${featureId}-${Date.now()}.${fileExt}`;
      const filePath = `features/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('features')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('features')
        .getPublicUrl(filePath);

      // Update feature with media info
      const { error: updateError } = await supabase
        .from('features')
        .update({
          media_url: publicUrl,
          media_type: file.type.startsWith('video/') ? 'video' : 'image',
          media_path: filePath
        })
        .eq('id', featureId);

      if (updateError) throw updateError;

      await fetchFeatures();
      toast({
        title: "Success",
        description: "Media uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload media",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateFeature = async (featureId: string, updates: Partial<Feature>) => {
    try {
      const { error } = await supabase
        .from('features')
        .update(updates)
        .eq('id', featureId);

      if (error) throw error;
      await fetchFeatures();
      toast({
        title: "Success",
        description: "Feature updated successfully",
      });
    } catch (error) {
      console.error('Error updating feature:', error);
      toast({
        title: "Error",
        description: "Failed to update feature",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFeature = async (featureId: string) => {
    try {
      const { error } = await supabase
        .from('features')
        .delete()
        .eq('id', featureId);

      if (error) throw error;
      await fetchFeatures();
      toast({
        title: "Success",
        description: "Feature deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting feature:', error);
      toast({
        title: "Error",
        description: "Failed to delete feature",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Features</h2>
        <Button
          onClick={async () => {
            try {
              const { data, error } = await supabase
                .from('features')
                .insert([{
                  title: 'New Feature',
                  description: 'Feature description',
                  order_index: features.length
                }])
                .select()
                .single();

              if (error) throw error;
              await fetchFeatures();
            } catch (error) {
              console.error('Error adding feature:', error);
              toast({
                title: "Error",
                description: "Failed to add feature",
                variant: "destructive",
              });
            }
          }}
        >
          Add Feature
        </Button>
      </div>

      <div className="space-y-4">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            draggable
            onDragStart={(e) => handleDragStart(e, feature)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, feature)}
            className="mb-4"
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="cursor-move">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle>Feature {index + 1}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteFeature(feature.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <Input
                      value={feature.title}
                      onChange={(e) => handleUpdateFeature(feature.id, { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={feature.description}
                      onChange={(e) => handleUpdateFeature(feature.id, { description: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Media</label>
                    <Tabs defaultValue={feature.media_type || 'upload'}>
                      <TabsList>
                        <TabsTrigger value="upload">Upload</TabsTrigger>
                        <TabsTrigger value="url">URL</TabsTrigger>
                      </TabsList>
                      <TabsContent value="upload">
                        <div className="flex items-center gap-2">
                          <Input
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file, feature.id);
                            }}
                            disabled={uploading}
                          />
                          {uploading && (
                            <div className="text-sm text-muted-foreground">
                              Uploading...
                            </div>
                          )}
                        </div>
                      </TabsContent>
                      <TabsContent value="url">
                        <Input
                          type="url"
                          placeholder="Enter media URL"
                          value={feature.media_url || ''}
                          onChange={(e) => handleUpdateFeature(feature.id, { media_url: e.target.value })}
                        />
                      </TabsContent>
                    </Tabs>
                    {feature.media_url && (
                      <div className="mt-2">
                        {feature.media_type === 'video' ? (
                          <video
                            src={feature.media_url}
                            controls
                            className="max-w-full h-auto"
                          />
                        ) : (
                          <img
                            src={feature.media_url}
                            alt={feature.title}
                            className="max-w-full h-auto"
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}; 