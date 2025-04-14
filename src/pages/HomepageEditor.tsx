import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from "lucide-react";

interface WhyChooseCard {
  id: string;
  title: string;
  description: string;
  image_url: string;
  order_index: number;
}

interface AboutIQifyCard {
  id: string;
  main_text: string;
  diagonal_text: string;
  media_url: string | null;
  media_type: string | null;
  order_index: number;
}

interface Differentiator {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const HomepageEditor = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [whyChooseCards, setWhyChooseCards] = useState<WhyChooseCard[]>([]);
  const [aboutIQifyCards, setAboutIQifyCards] = useState<AboutIQifyCard[]>([]);
  const [differentiators, setDifferentiators] = useState<Differentiator[]>([]);
  const [content, setContent] = useState({
    heroTitle: "",
    heroDescription: "",
    features: [],
    testimonials: []
  });

  useEffect(() => {
    fetchWhyChooseCards();
    fetchAboutIQifyCards();
    fetchDifferentiators();
  }, []);

  const fetchWhyChooseCards = async () => {
    try {
      const { data, error } = await supabase
        .from('why_choose_cards')
        .select('*')
        .order('order_index');
      
      if (error) throw error;
      setWhyChooseCards((data as unknown as WhyChooseCard[]) || []);
    } catch (error) {
      console.error('Error fetching why choose cards:', error);
      toast({
        title: "Error",
        description: "Failed to fetch why choose cards",
        variant: "destructive",
      });
    }
  };

  const fetchAboutIQifyCards = async () => {
    const { data, error } = await supabase
      .from('about_iqify_cards')
      .select('*')
      .order('order_index');
    
    if (error) {
      console.error('Error fetching About IQify cards:', error);
      return;
    }
    
    setAboutIQifyCards((data as unknown as AboutIQifyCard[]) || []);
  };

  const fetchDifferentiators = async () => {
    const { data, error } = await supabase
      .from('differentiators')
      .select('*')
      .order('order_index');
    
    if (error) {
      console.error('Error fetching differentiators:', error);
      return;
    }
    
    setDifferentiators((data as unknown as Differentiator[]) || []);
  };

  const handleAddCard = async () => {
    try {
      const newOrderIndex = whyChooseCards.length;
      const { data, error } = await supabase
        .from('why_choose_cards')
        .insert({
          title: 'New Card',
          description: 'Enter description here',
          image_url: '',
          order_index: newOrderIndex
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setWhyChooseCards([...whyChooseCards, data as unknown as WhyChooseCard]);
      toast({
        title: "Success",
        description: "New card added successfully",
      });
    } catch (error) {
      console.error('Error adding card:', error);
      toast({
        title: "Error",
        description: "Failed to add new card",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCard = async (id: string, updates: Partial<WhyChooseCard>) => {
    try {
      const { error } = await supabase
        .from('why_choose_cards')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
      
      setWhyChooseCards(whyChooseCards.map(card => 
        card.id === id ? { ...card, ...updates } : card
      ));
    } catch (error) {
      console.error('Error updating card:', error);
      toast({
        title: "Error",
        description: "Failed to update card",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('why_choose_cards')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setWhyChooseCards(whyChooseCards.filter(card => card.id !== id));
      toast({
        title: "Success",
        description: "Card deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting card:', error);
      toast({
        title: "Error",
        description: "Failed to delete card",
        variant: "destructive",
      });
    }
  };

  const handleAddAboutIQifyCard = async () => {
    try {
      const newCard = {
        main_text: '',
        diagonal_text: '',
        media_url: null,
        media_type: null,
        order_index: aboutIQifyCards.length
      };

      const { data, error } = await supabase
        .from('about_iqify_cards')
        .insert(newCard)
        .select()
        .single();

      if (error) throw error;

      setAboutIQifyCards([...aboutIQifyCards, data as unknown as AboutIQifyCard]);
      toast({
        title: "Success",
        description: "Card added successfully",
      });
    } catch (error) {
      console.error('Error adding About IQify card:', error);
      toast({
        title: "Error",
        description: "Failed to add card",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAboutIQifyCard = async (id: string, updates: Partial<AboutIQifyCard>) => {
    try {
      const { error } = await supabase
        .from('about_iqify_cards')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setAboutIQifyCards(aboutIQifyCards.map(card => 
        card.id === id ? { ...card, ...updates } : card
      ));
      toast({
        title: "Success",
        description: "Card updated successfully",
      });
    } catch (error) {
      console.error('Error updating About IQify card:', error);
      toast({
        title: "Error",
        description: "Failed to update card",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAboutIQifyCard = async (id: string) => {
    try {
      const { error } = await supabase
        .from('about_iqify_cards')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setAboutIQifyCards(aboutIQifyCards.filter(card => card.id !== id));
      toast({
        title: "Success",
        description: "Card deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting About IQify card:', error);
      toast({
        title: "Error",
        description: "Failed to delete card",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('homepage_content')
        .upsert({ id: 1, content });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Homepage content saved successfully",
      });
    } catch (error) {
      console.error('Error saving homepage content:', error);
      toast({
        title: "Error",
        description: "Failed to save homepage content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content">Content Management</TabsTrigger>
          <TabsTrigger value="about">About IQify</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <div className="space-y-8">
            {/* Why Choose IQify Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Why Choose IQify</h2>
                <Button onClick={handleAddCard}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Card
                </Button>
              </div>

              <div className="space-y-4">
                {whyChooseCards.map((card) => (
                  <Card key={card.id} className="p-4">
                    <div className="space-y-4">
                      <Input
                        placeholder="Title"
                        value={card.title}
                        onChange={(e) => handleUpdateCard(card.id, { title: e.target.value })}
                      />
                      <Textarea
                        placeholder="Description"
                        value={card.description}
                        onChange={(e) => handleUpdateCard(card.id, { description: e.target.value })}
                      />
                      <Input
                        placeholder="Image URL"
                        value={card.image_url || ''}
                        onChange={(e) => handleUpdateCard(card.id, { image_url: e.target.value })}
                      />
                      <div className="flex justify-end">
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteCard(card.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="about">
          <div className="space-y-8">
            {/* About IQify Cards Section */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">About IQify Cards</h2>
                <Button onClick={handleAddAboutIQifyCard}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Card
                </Button>
              </div>

              <div className="space-y-4">
                {aboutIQifyCards.map((card) => (
                  <Card key={card.id} className="p-4">
                    <div className="space-y-4">
                      <Input
                        placeholder="Main Text"
                        value={card.main_text}
                        onChange={(e) => handleUpdateAboutIQifyCard(card.id, { main_text: e.target.value })}
                      />
                      <Textarea
                        placeholder="Diagonal Text"
                        value={card.diagonal_text}
                        onChange={(e) => handleUpdateAboutIQifyCard(card.id, { diagonal_text: e.target.value })}
                      />
                      <Input
                        placeholder="Media URL"
                        value={card.media_url || ''}
                        onChange={(e) => handleUpdateAboutIQifyCard(card.id, { media_url: e.target.value })}
                      />
                      <div className="flex justify-end">
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteAboutIQifyCard(card.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button 
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default HomepageEditor; 