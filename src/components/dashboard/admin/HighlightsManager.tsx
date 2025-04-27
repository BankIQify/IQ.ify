import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

interface Highlight {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'draft' | 'archived';
  color: string;
}

const defaultHighlights: Highlight[] = [
  {
    id: "1",
    title: "IQify students achieve 100% GCSE scores",
    description: "Our platform helps students across Britain and China reach top academic results.",
    status: 'active',
    color: 'pink'
  },
  {
    id: "2",
    title: "40% higher job placement rate",
    description: "Graduates from selective schools using IQify have significantly better career outcomes.",
    status: 'active',
    color: 'blue'
  },
  {
    id: "3",
    title: "70% industry preference for cognitive skills",
    description: "Companies like Google and Apple prioritize cognitive abilities over basic memorization.",
    status: 'draft',
    color: 'green'
  }
];

export const HighlightsManager = () => {
  const [highlights, setHighlights] = useState<Highlight[]>(defaultHighlights);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newHighlight, setNewHighlight] = useState({ title: '', description: '', color: 'pink' });
  const { toast } = useToast();
  const { user } = useAuth();

  const handleAddHighlight = () => {
    if (!newHighlight.title || !newHighlight.description) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const newId = (Math.random() + 1).toString(36).substring(7);
    const newHighlightData = {
      id: newId,
      title: newHighlight.title,
      description: newHighlight.description,
      status: 'draft',
      color: newHighlight.color
    };

    setHighlights([...highlights, newHighlightData]);
    setNewHighlight({ title: '', description: '', color: 'pink' });
    toast({
      title: "Success",
      description: "New highlight added successfully"
    });
  };

  const handleEditHighlight = (highlight: Highlight) => {
    setIsEditing(highlight.id);
    setNewHighlight({
      title: highlight.title,
      description: highlight.description,
      color: highlight.color
    });
  };

  const handleUpdateHighlight = () => {
    if (!isEditing) return;

    const updatedHighlights = highlights.map(h =>
      h.id === isEditing ? {
        ...h,
        title: newHighlight.title,
        description: newHighlight.description,
        color: newHighlight.color
      } : h
    );

    setHighlights(updatedHighlights);
    setIsEditing(null);
    setNewHighlight({ title: '', description: '', color: 'pink' });
    toast({
      title: "Success",
      description: "Highlight updated successfully"
    });
  };

  const handleDeleteHighlight = (id: string) => {
    const updatedHighlights = highlights.filter(h => h.id !== id);
    setHighlights(updatedHighlights);
    toast({
      title: "Success",
      description: "Highlight deleted successfully"
    });
  };

  const handleStatusChange = (id: string, status: 'active' | 'draft' | 'archived') => {
    const updatedHighlights = highlights.map(h =>
      h.id === id ? { ...h, status } : h
    );
    setHighlights(updatedHighlights);
    toast({
      title: "Success",
      description: "Highlight status updated successfully"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Highlights from HQ</h2>
        <Button
          variant="outline"
          onClick={() => setNewHighlight({ title: '', description: '', color: 'pink' })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Highlight
        </Button>
      </div>

      {/* Edit Form */}
      {isEditing && (
        <Card className="p-6">
          <div className="space-y-4">
            <Input
              placeholder="Highlight Title"
              value={newHighlight.title}
              onChange={(e) => setNewHighlight({ ...newHighlight, title: e.target.value })}
            />
            <Textarea
              placeholder="Highlight Description"
              value={newHighlight.description}
              onChange={(e) => setNewHighlight({ ...newHighlight, description: e.target.value })}
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(null);
                  setNewHighlight({ title: '', description: '', color: 'pink' });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateHighlight}>
                Update Highlight
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Highlights Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {highlights.map((highlight) => (
          <Card key={highlight.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  highlight.color === 'pink' ? 'bg-pink-500' :
                  highlight.color === 'blue' ? 'bg-blue-500' :
                  highlight.color === 'green' ? 'bg-green-500' :
                  highlight.color === 'purple' ? 'bg-purple-500' :
                  highlight.color === 'yellow' ? 'bg-yellow-500' : 'bg-gray-500'
                }`} />
                <h3 className="text-lg font-semibold">{highlight.title}</h3>
              </div>
              <div className="flex items-center gap-2">
                {highlight.status === 'active' && (
                  <span className="text-green-500">Active</span>
                )}
                {highlight.status === 'draft' && (
                  <span className="text-yellow-500">Draft</span>
                )}
                {highlight.status === 'archived' && (
                  <span className="text-gray-500">Archived</span>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{highlight.description}</p>
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditHighlight(highlight)}
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteHighlight(highlight.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
              {highlight.status !== 'active' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(highlight.id, 'active')}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Activate
                </Button>
              )}
              {highlight.status === 'active' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(highlight.id, 'archived')}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Archive
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
