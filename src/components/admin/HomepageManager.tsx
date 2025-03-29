import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

interface HomepageContent {
  hero: {
    heading: string;
    subtext: string;
    imageUrl: string;
  };
  aboutUs: {
    heading: string;
    subtext: string;
    cards: Array<{
      id: string;
      highlight: string;
      supportingText: string;
    }>;
  };
  features: {
    heading: string;
    subtext: string;
    items: Array<{
      id: string;
      title: string;
      description: string;
    }>;
  };
  testimonials?: {
    heading: string;
    subtext: string;
    items: Array<{
      id: string;
      quote: string;
      author: string;
      role: string;
    }>;
  };
}

interface HomepageManagerProps {
  initialContent: HomepageContent;
  onSave: (content: HomepageContent) => void;
}

export const HomepageManager = ({ initialContent, onSave }: HomepageManagerProps) => {
  const [content, setContent] = useState<HomepageContent>(initialContent);
  const { toast } = useToast();

  const handleSave = () => {
    onSave(content);
    toast({
      title: "Success",
      description: "Homepage content has been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="about">About Us</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hero-heading">Heading</Label>
                <Input
                  id="hero-heading"
                  value={content.hero.heading}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, heading: e.target.value }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-subtext">Subtext</Label>
                <Textarea
                  id="hero-subtext"
                  value={content.hero.subtext}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, subtext: e.target.value }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hero-image">Image URL</Label>
                <Input
                  id="hero-image"
                  value={content.hero.imageUrl}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, imageUrl: e.target.value }
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Us Section */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle>About Us Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="about-heading">Heading</Label>
                <Input
                  id="about-heading"
                  value={content.aboutUs.heading}
                  onChange={(e) => setContent({
                    ...content,
                    aboutUs: { ...content.aboutUs, heading: e.target.value }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about-subtext">Subtext</Label>
                <Textarea
                  id="about-subtext"
                  value={content.aboutUs.subtext}
                  onChange={(e) => setContent({
                    ...content,
                    aboutUs: { ...content.aboutUs, subtext: e.target.value }
                  })}
                />
              </div>
              <div className="space-y-4">
                <Label>Stats Cards</Label>
                {content.aboutUs.cards.map((card, index) => (
                  <Card key={card.id} className="p-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Highlight Fact {index + 1}</Label>
                        <Input
                          value={card.highlight}
                          onChange={(e) => {
                            const newCards = [...content.aboutUs.cards];
                            newCards[index] = { ...card, highlight: e.target.value };
                            setContent({
                              ...content,
                              aboutUs: { ...content.aboutUs, cards: newCards }
                            });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Supporting Text {index + 1}</Label>
                        <Textarea
                          value={card.supportingText}
                          onChange={(e) => {
                            const newCards = [...content.aboutUs.cards];
                            newCards[index] = { ...card, supportingText: e.target.value };
                            setContent({
                              ...content,
                              aboutUs: { ...content.aboutUs, cards: newCards }
                            });
                          }}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Features Section */}
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Features Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="features-heading">Heading</Label>
                <Input
                  id="features-heading"
                  value={content.features.heading}
                  onChange={(e) => setContent({
                    ...content,
                    features: { ...content.features, heading: e.target.value }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="features-subtext">Subtext</Label>
                <Textarea
                  id="features-subtext"
                  value={content.features.subtext}
                  onChange={(e) => setContent({
                    ...content,
                    features: { ...content.features, subtext: e.target.value }
                  })}
                />
              </div>
              <div className="space-y-4">
                <Label>Feature Items</Label>
                {content.features.items.map((item, index) => (
                  <Card key={item.id} className="p-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Title {index + 1}</Label>
                        <Input
                          value={item.title}
                          onChange={(e) => {
                            const newItems = [...content.features.items];
                            newItems[index] = { ...item, title: e.target.value };
                            setContent({
                              ...content,
                              features: { ...content.features, items: newItems }
                            });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description {index + 1}</Label>
                        <Textarea
                          value={item.description}
                          onChange={(e) => {
                            const newItems = [...content.features.items];
                            newItems[index] = { ...item, description: e.target.value };
                            setContent({
                              ...content,
                              features: { ...content.features, items: newItems }
                            });
                          }}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials Section */}
        <TabsContent value="testimonials">
          <Card>
            <CardHeader>
              <CardTitle>Testimonials Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="testimonials-heading">Heading</Label>
                <Input
                  id="testimonials-heading"
                  value={content.testimonials?.heading}
                  onChange={(e) => setContent({
                    ...content,
                    testimonials: { ...content.testimonials, heading: e.target.value }
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="testimonials-subtext">Subtext</Label>
                <Textarea
                  id="testimonials-subtext"
                  value={content.testimonials?.subtext}
                  onChange={(e) => setContent({
                    ...content,
                    testimonials: { ...content.testimonials, subtext: e.target.value }
                  })}
                />
              </div>
              <div className="space-y-4">
                <Label>Testimonial Items</Label>
                {content.testimonials?.items.map((item, index) => (
                  <Card key={item.id} className="p-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Quote {index + 1}</Label>
                        <Textarea
                          value={item.quote}
                          onChange={(e) => {
                            const newItems = [...content.testimonials.items];
                            newItems[index] = { ...item, quote: e.target.value };
                            setContent({
                              ...content,
                              testimonials: { ...content.testimonials, items: newItems }
                            });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Author {index + 1}</Label>
                        <Input
                          value={item.author}
                          onChange={(e) => {
                            const newItems = [...content.testimonials.items];
                            newItems[index] = { ...item, author: e.target.value };
                            setContent({
                              ...content,
                              testimonials: { ...content.testimonials, items: newItems }
                            });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Role {index + 1}</Label>
                        <Input
                          value={item.role}
                          onChange={(e) => {
                            const newItems = [...content.testimonials.items];
                            newItems[index] = { ...item, role: e.target.value };
                            setContent({
                              ...content,
                              testimonials: { ...content.testimonials, items: newItems }
                            });
                          }}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
}; 