import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface AboutContentData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  stats: Array<{
    id: string;
    value: string;
    label: string;
  }>;
}

export const AboutIqifyEditor: React.FC = () => {
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const [content, setContent] = useState<AboutContentData>({
    id: "1",
    title: "About IQify",
    subtitle: "Empowering Minds Through Innovation",
    description: "IQify is a cutting-edge cognitive assessment platform that combines scientific research with modern technology to help individuals understand and enhance their intellectual capabilities.",
    stats: [
      {
        id: "1",
        value: "50,000+",
        label: "Active Users",
      },
      {
        id: "2",
        value: "1M+",
        label: "Questions Answered",
      },
      {
        id: "3",
        value: "95%",
        label: "User Satisfaction",
      },
    ],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('about_content')
        .select('*')
        .single();

      if (error) throw error;

      if (data) {
        const aboutData = data as AboutContentData;
        setContent({
          id: aboutData.id,
          title: aboutData.title,
          subtitle: aboutData.subtitle,
          description: aboutData.description,
          stats: aboutData.stats || [],
        });
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
      toast({
        title: "Error",
        description: "Failed to load about content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addStat = () => {
    const newStat = {
      id: `temp_${Date.now()}`,
      value: "",
      label: "",
    };
    setContent({
      ...content,
      stats: [...content.stats, newStat],
    });
  };

  const removeStat = (id: string) => {
    setContent({
      ...content,
      stats: content.stats.filter(stat => stat.id !== id),
    });
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('about_content')
        .upsert({
          id: content.id,
          title: content.title,
          subtitle: content.subtitle,
          description: content.description,
          stats: content.stats,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "About content updated successfully",
      });

      // Refresh the content
      await fetchContent();
    } catch (error) {
      console.error('Error saving about content:', error);
      toast({
        title: "Error",
        description: "Failed to save about content",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading about content...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About IQify Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={content.title}
                  onChange={(e) => setContent({ ...content, title: e.target.value })}
                  placeholder="Enter title"
                />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                  value={content.subtitle}
                  onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                  placeholder="Enter subtitle"
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={content.description}
                  onChange={(e) => setContent({ ...content, description: e.target.value })}
                  placeholder="Enter description"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Statistics</Label>
                <Button
                  variant="outline"
                  onClick={addStat}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Statistic
                </Button>
              </div>

              {content.stats.map((stat, index) => (
                <Card key={stat.id} className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Statistic {index + 1}</Label>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStat(stat.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Value</Label>
                        <Input
                          value={stat.value}
                          onChange={(e) => {
                            const newStats = [...content.stats];
                            newStats[index] = {
                              ...stat,
                              value: e.target.value,
                            };
                            setContent({ ...content, stats: newStats });
                          }}
                          placeholder="e.g. 50,000+"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Label</Label>
                        <Input
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...content.stats];
                            newStats[index] = {
                              ...stat,
                              label: e.target.value,
                            };
                            setContent({ ...content, stats: newStats });
                          }}
                          placeholder="e.g. Active Users"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 