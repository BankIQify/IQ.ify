import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Trash2, Plus, Save, Upload, X } from "lucide-react";
import { IconPicker } from "@/components/ui/icon-picker";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

// Available post-it note colours - updated to pastel shades
const POST_IT_COLORS = [
  { value: "yellow", label: "Yellow", color: "#FFF9C4" }, // Soft pastel yellow
  { value: "pink", label: "Pink", color: "#FFCDD2" },    // Soft pastel pink
  { value: "blue", label: "Blue", color: "#BBDEFB" },    // Soft pastel blue
  { value: "green", label: "Green", color: "#C8E6C9" },  // Soft pastel green
  { value: "purple", label: "Purple", color: "#E1BEE7" }, // Soft pastel purple
  { value: "orange", label: "Orange", color: "#FFE0B2" }, // Soft pastel orange
  { value: "mint", label: "Mint", color: "#B2DFDB" },     // Soft pastel mint
  { value: "lavender", label: "Lavender", color: "#D1C4E9" } // Soft pastel lavender
];

// Available icons for the post-it notes
const AVAILABLE_ICONS = [
  "Lightbulb",
  "Star",
  "Trophy",
  "LineChart",
  "Rocket",
  "Shield",
  "Puzzle",
  "Brain",
  "Medal",
  "Target",
  "Sparkles",
  "Award",
  "GraduationCap",
  "BookOpen",
  "BookMarked",
  "Book",
  "School",
  "University",
  "Library",
  "PenTool",
  "Pencil",
  "Highlighter",
  "Notebook",
  "NotebookPen",
  "ClipboardList",
  "ClipboardCheck",
  "CheckCircle",
  "CheckSquare",
  "ThumbsUp",
  "Heart",
  "Smile",
  "Crown",
  "Gem",
  "Diamond",
  "Coins",
  "Globe",
  "Map",
  "Compass",
  "Flag",
  "Anchor",
  "Plane",
  "Car",
  "Train",
  "Bus",
  "Satellite",
  "Telescope",
  "Microscope",
  "Beaker",
  "TestTube",
  "Atom",
  "Dna",
  "HeartPulse",
  "Eye",
  "Hand",
  "Skull",
  "Ghost",
  "Cat",
  "Dog",
  "Fish",
  "Bird",
  "House",
  "Rainbow"
];

interface Differentiator {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order_index: number;
  media_url?: string;
  media_type?: 'image' | 'video' | 'gif';
  media_alt_text?: string;
}

export const DifferentiatorManager = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newDifferentiator, setNewDifferentiator] = useState<Omit<Differentiator, "id">>({
    title: "",
    description: "",
    icon: "Sparkles",
    color: "yellow",
    order_index: 0,
  });

  const { data: differentiators = [], isError } = useQuery({
    queryKey: ["differentiators"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("differentiators")
          .select("*")
          .order("order_index");

        if (error) {
          console.error("Error fetching differentiators:", error);
          toast({
            title: "Error fetching differentiators",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }

        return (data as unknown as Differentiator[]).map((item, index) => ({
          ...item,
          order_index: item.order_index ?? index,
        }));
      } catch (error) {
        console.error("Error in differentiators query:", error);
        return [];
      }
    },
  });

  const addMutation = useMutation({
    mutationFn: async (newItem: Omit<Differentiator, "id">) => {
      try {
        const { data, error } = await supabase
          .from("differentiators")
          .insert([{ 
            ...newItem,
            order_index: differentiators.length
          }])
          .select()
          .single();

        if (error) {
          console.error("Error adding differentiator:", error);
          toast({
            title: "Error adding differentiator",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }
        return data;
      } catch (error) {
        console.error("Error in add mutation:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["differentiators"] });
      setIsAdding(false);
      setNewDifferentiator({ title: "", description: "", icon: "Sparkles", color: "yellow", order_index: 0 });
      toast({
        title: "Success",
        description: "Differentiator added successfully",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("differentiators")
        .delete()
        .eq("id", id);
      if (error) {
        toast({
          title: "Error deleting differentiator",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["differentiators"] });
      toast({
        title: "Success",
        description: "Differentiator deleted successfully",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Differentiator> }) => {
      const { error } = await supabase
        .from("differentiators")
        .update(data)
        .eq("id", id);
      if (error) {
        toast({
          title: "Error updating differentiator",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["differentiators"] });
    },
  });

  const handleFileUpload = async (file: File, differentiatorId?: string) => {
    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Determine file type
      const fileType = file.type.startsWith('image/') 
        ? (file.type === 'image/gif' ? 'gif' : 'image')
        : 'video';

      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `differentiators/${fileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('differentiators-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('differentiators-media')
        .getPublicUrl(filePath);

      // Update the differentiator with media information
      const mediaData: Partial<Differentiator> = {
        media_url: publicUrl,
        media_type: fileType as 'image' | 'video' | 'gif',
        media_alt_text: file.name
      };

      if (differentiatorId) {
        await updateMutation.mutateAsync({ id: differentiatorId, data: mediaData });
      } else {
        setNewDifferentiator(prev => ({ ...prev, ...mediaData }));
      }

      toast({
        title: "Success",
        description: "Media uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Error",
        description: "Failed to upload media",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeMedia = async (differentiatorId: string) => {
    try {
      const differentiator = differentiators.find(d => d.id === differentiatorId);
      if (!differentiator?.media_url) return;

      // Extract the file path from the URL
      const filePath = differentiator.media_url.split('/').pop();
      if (!filePath) return;

      // Delete the file from storage
      const { error } = await supabase.storage
        .from('differentiators-media')
        .remove([`differentiators/${filePath}`]);

      if (error) throw error;

      // Update the differentiator to remove media information
      await updateMutation.mutateAsync({
        id: differentiatorId,
        data: {
          media_url: null,
          media_type: null,
          media_alt_text: null
        }
      });

      toast({
        title: "Success",
        description: "Media removed successfully",
      });
    } catch (error) {
      console.error("Error removing media:", error);
      toast({
        title: "Error",
        description: "Failed to remove media",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Why Choose IQify</h2>
        <Button 
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Add New Form */}
        {isAdding && (
          <div className="p-6 rounded-sm shadow-lg bg-[#fff8b8] relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gray-300 shadow-inner border-2 border-gray-400" />
            <div className="space-y-4">
              <IconPicker
                value={newDifferentiator.icon}
                onChange={(icon) => setNewDifferentiator(prev => ({ ...prev, icon }))}
                availableIcons={AVAILABLE_ICONS}
              />
              <Select
                value={newDifferentiator.color}
                onValueChange={(color) => setNewDifferentiator(prev => ({ ...prev, color }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a colour" />
                </SelectTrigger>
                <SelectContent>
                  {POST_IT_COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-sm" 
                          style={{ backgroundColor: color.color }}
                        />
                        <span>{color.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Title"
                value={newDifferentiator.title}
                onChange={(e) => setNewDifferentiator(prev => ({ ...prev, title: e.target.value }))}
                className="font-handwriting"
              />
              <Textarea
                placeholder="Description"
                value={newDifferentiator.description}
                onChange={(e) => setNewDifferentiator(prev => ({ ...prev, description: e.target.value }))}
                className="font-handwriting"
                rows={3}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">Media</label>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                    }}
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Media
                  </Button>
                  {newDifferentiator.media_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNewDifferentiator(prev => ({ ...prev, media_url: undefined, media_type: undefined, media_alt_text: undefined }))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {isUploading && (
                  <Progress value={uploadProgress} className="w-full" />
                )}
                {newDifferentiator.media_url && (
                  <div className="mt-2">
                    {newDifferentiator.media_type === 'video' ? (
                      <video
                        src={newDifferentiator.media_url}
                        controls
                        className="w-full rounded-md"
                      />
                    ) : (
                      <img
                        src={newDifferentiator.media_url}
                        alt={newDifferentiator.media_alt_text}
                        className="w-full rounded-md"
                      />
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={() => addMutation.mutate(newDifferentiator)}
                  className="w-full"
                  variant="default"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button 
                  onClick={() => setIsAdding(false)}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Existing Differentiators */}
        {differentiators.map((differentiator) => (
          <div 
            key={differentiator.id}
            className="p-6 rounded-sm shadow-lg relative"
            style={{ backgroundColor: POST_IT_COLORS.find(c => c.value === differentiator.color)?.color || '#fff8b8' }}
          >
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gray-300 shadow-inner border-2 border-gray-400" />
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <IconPicker
                  value={differentiator.icon}
                  onChange={(icon) => updateMutation.mutate({ id: differentiator.id, data: { icon } })}
                  availableIcons={AVAILABLE_ICONS}
                />
              </div>
              <Select
                value={differentiator.color}
                onValueChange={(color) => updateMutation.mutate({ id: differentiator.id, data: { color } })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a colour" />
                </SelectTrigger>
                <SelectContent>
                  {POST_IT_COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-4 h-4 rounded-sm" 
                          style={{ backgroundColor: color.color }}
                        />
                        <span>{color.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={differentiator.title}
                onChange={(e) => updateMutation.mutate({ id: differentiator.id, data: { title: e.target.value } })}
                className="text-xl font-semibold mb-3 font-handwriting text-center"
              />
              <Textarea
                value={differentiator.description}
                onChange={(e) => updateMutation.mutate({ id: differentiator.id, data: { description: e.target.value } })}
                className="text-sm text-gray-600 mb-4 font-handwriting text-center"
                rows={3}
              />
              {differentiator.media_url && (
                <div className="w-full mb-4">
                  {differentiator.media_type === 'video' ? (
                    <video
                      src={differentiator.media_url}
                      controls
                      className="w-full rounded-md"
                    />
                  ) : (
                    <img
                      src={differentiator.media_url}
                      alt={differentiator.media_alt_text}
                      className="w-full rounded-md"
                    />
                  )}
                  <div className="flex justify-end mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedia(differentiator.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
              <div className="w-full mb-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*,video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file, differentiator.id);
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {differentiator.media_url ? 'Replace Media' : 'Add Media'}
                </Button>
                {isUploading && (
                  <Progress value={uploadProgress} className="w-full mt-2" />
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateMutation.mutate({ id: differentiator.id, data: { order_index: -1 } })}
                >
                  Hide
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMutation.mutate(differentiator.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 