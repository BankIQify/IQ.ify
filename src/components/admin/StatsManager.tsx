import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StatCard {
  id: string;
  highlight: string;
  supportingText: string;
}

interface StatsManagerProps {
  initialStats: StatCard[];
  onSave: (stats: StatCard[]) => void;
}

export const StatsManager = ({ initialStats, onSave }: StatsManagerProps) => {
  const [stats, setStats] = useState<StatCard[]>(initialStats);
  const { toast } = useToast();

  const handleAddCard = () => {
    setStats([
      ...stats,
      {
        id: Date.now().toString(),
        highlight: "",
        supportingText: "",
      },
    ]);
  };

  const handleRemoveCard = (id: string) => {
    setStats(stats.filter((card) => card.id !== id));
  };

  const handleUpdateCard = (id: string, field: keyof StatCard, value: string) => {
    setStats(
      stats.map((card) =>
        card.id === id ? { ...card, [field]: value } : card
      )
    );
  };

  const handleSave = () => {
    // Validate that all cards have content
    const isValid = stats.every(
      (card) => card.highlight.trim() && card.supportingText.trim()
    );

    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields for each card.",
        variant: "destructive",
      });
      return;
    }

    onSave(stats);
    toast({
      title: "Success",
      description: "Stats have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Stats Cards</h2>
        <Button onClick={handleAddCard}>
          <Plus className="h-4 w-4 mr-2" />
          Add Card
        </Button>
      </div>

      <div className="grid gap-6">
        {stats.map((card, index) => (
          <Card key={card.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Card {index + 1}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveCard(card.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Highlight Text</label>
                <Input
                  value={card.highlight}
                  onChange={(e) =>
                    handleUpdateCard(card.id, "highlight", e.target.value)
                  }
                  placeholder="Enter the highlight text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Supporting Text</label>
                <Textarea
                  value={card.supportingText}
                  onChange={(e) =>
                    handleUpdateCard(card.id, "supportingText", e.target.value)
                  }
                  placeholder="Enter the supporting text"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}; 