import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Upload } from 'lucide-react';
import { AdminWrapper } from './AdminWrapper';
import { HeroContent, HeroContentUpdate } from '@/types/hero';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface ButtonConfig {
  text: string;
  url: string;
  variant: 'primary' | 'secondary';
}

export const HeroSectionEditor: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const [heroSection, setHeroSection] = useState<HeroContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadHeroSection();
  }, []);

  const loadHeroSection = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_content')
        .select('*')
        .single();

      if (error) throw error;
      setHeroSection(data);
    } catch (error) {
      console.error('Error loading hero section:', error);
      toast({
        title: 'Error',
        description: 'Failed to load hero section content',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!heroSection) return;
    setIsSaving(true);

    try {
      const updates: HeroContentUpdate = {
        title: heroSection.title,
        subtitle: heroSection.subtitle,
        description: heroSection.description,
        background_image: heroSection.background_image,
        rating: heroSection.rating,
        active_users: heroSection.active_users,
        award_text: heroSection.award_text,
        bubble_text: heroSection.bubble_text,
        primary_button_text: heroSection.primary_button_text,
        secondary_button_text: heroSection.secondary_button_text,
        cta_button: heroSection.cta_button,
        secondary_button: heroSection.secondary_button,
      };

      const { error } = await supabase
        .from('hero_content')
        .update(updates)
        .eq('id', heroSection.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Hero section updated successfully',
      });
    } catch (error) {
      console.error('Error saving hero section:', error);
      toast({
        title: 'Error',
        description: 'Failed to save hero section content',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size must be less than 5MB');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `hero-section/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('hero-section')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('hero-section')
        .getPublicUrl(filePath);

      setHeroSection(prev => {
        if (!prev) return null;
        return { ...prev, background_image: publicUrl };
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload image',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading hero section...</p>
        </div>
      </div>
    );
  }

  if (!heroSection) {
    return <div>No hero section content found</div>;
  }

  return (
    <AdminWrapper>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Hero Section</h2>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={heroSection.title}
                  onChange={(e) => setHeroSection({ ...heroSection, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  value={heroSection.subtitle}
                  onChange={(e) => setHeroSection({ ...heroSection, subtitle: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={heroSection.description || ''}
                  onChange={(e) => setHeroSection({ ...heroSection, description: e.target.value })}
                  placeholder="Enter description"
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Background Image</Label>
                {heroSection.background_image && (
                  <div className="mt-2">
                    <img
                      src={heroSection.background_image}
                      alt="Hero background"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Upload Image
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                </div>
                {isUploading && (
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Call to Action Button</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cta-text">Button Text</Label>
                    <Input
                      id="cta-text"
                      value={heroSection.cta_button?.text || ''}
                      onChange={(e) => setHeroSection({
                        ...heroSection,
                        cta_button: {
                          ...heroSection.cta_button,
                          text: e.target.value,
                          variant: 'primary'
                        }
                      })}
                      placeholder="Enter button text"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cta-url">Button URL</Label>
                    <Input
                      id="cta-url"
                      value={heroSection.cta_button?.url || ''}
                      onChange={(e) => setHeroSection({
                        ...heroSection,
                        cta_button: {
                          ...heroSection.cta_button,
                          url: e.target.value,
                          variant: 'primary'
                        }
                      })}
                      placeholder="Enter button URL"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Secondary Button</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="secondary-text">Button Text</Label>
                    <Input
                      id="secondary-text"
                      value={heroSection.secondary_button?.text || ''}
                      onChange={(e) => setHeroSection({
                        ...heroSection,
                        secondary_button: {
                          ...heroSection.secondary_button,
                          text: e.target.value,
                          variant: 'secondary'
                        }
                      })}
                      placeholder="Enter button text"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondary-url">Button URL</Label>
                    <Input
                      id="secondary-url"
                      value={heroSection.secondary_button?.url || ''}
                      onChange={(e) => setHeroSection({
                        ...heroSection,
                        secondary_button: {
                          ...heroSection.secondary_button,
                          url: e.target.value,
                          variant: 'secondary'
                        }
                      })}
                      placeholder="Enter button URL"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  value={heroSection.rating}
                  onChange={(e) => setHeroSection({ ...heroSection, rating: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="active_users">Active Users</Label>
                <Input
                  id="active_users"
                  type="number"
                  value={heroSection.active_users}
                  onChange={(e) => setHeroSection({ ...heroSection, active_users: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="award_text">Award Text</Label>
                <Input
                  id="award_text"
                  value={heroSection.award_text}
                  onChange={(e) => setHeroSection({ ...heroSection, award_text: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bubble_text">Bubble Text</Label>
                <Input
                  id="bubble_text"
                  value={heroSection.bubble_text}
                  onChange={(e) => setHeroSection({ ...heroSection, bubble_text: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary_button_text">Primary Button Text</Label>
                <Input
                  id="primary_button_text"
                  value={heroSection.primary_button_text}
                  onChange={(e) => setHeroSection({ ...heroSection, primary_button_text: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary_button_text">Secondary Button Text</Label>
                <Input
                  id="secondary_button_text"
                  value={heroSection.secondary_button_text}
                  onChange={(e) => setHeroSection({ ...heroSection, secondary_button_text: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSaveChanges} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </AdminWrapper>
  );
}; 