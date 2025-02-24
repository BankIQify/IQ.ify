
import React, { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2 } from "lucide-react";

interface SubTopic {
  id: string;
  name: string;
  section_id: string;
}

interface SubTopicListProps {
  selectedCategory: 'verbal' | 'non_verbal' | 'brain_training';
  onSubTopicUpdated: () => void;
}

export const SubTopicList = ({ selectedCategory, onSubTopicUpdated }: SubTopicListProps) => {
  const [editingSubTopic, setEditingSubTopic] = useState<SubTopic | null>(null);
  const [editedName, setEditedName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [subTopics, setSubTopics] = useState<SubTopic[]>([]);

  const fetchSubTopics = async () => {
    try {
      const { data: sections } = await supabase
        .from('question_sections')
        .select('id')
        .eq('category', selectedCategory)
        .single();

      if (sections?.id) {
        const { data: subTopicsData, error } = await supabase
          .from('sub_topics')
          .select('*')
          .eq('section_id', sections.id);

        if (error) {
          console.error("Error fetching sub-topics:", error);
          toast.error("Failed to fetch sub-topics");
          return;
        }

        setSubTopics(subTopicsData || []);
      }
    } catch (error) {
      console.error("Error fetching sub-topics:", error);
      toast.error("Failed to fetch sub-topics");
    }
  };

  React.useEffect(() => {
    fetchSubTopics();
  }, [selectedCategory]);

  const handleEdit = (subTopic: SubTopic) => {
    setEditingSubTopic(subTopic);
    setEditedName(subTopic.name);
    setIsDialogOpen(true);
  };

  const handleDelete = async (subTopic: SubTopic) => {
    if (confirm("Are you sure you want to delete this sub-topic? This action cannot be undone.")) {
      setIsLoading(true);
      try {
        const { error } = await supabase
          .from('sub_topics')
          .delete()
          .eq('id', subTopic.id);

        if (error) throw error;

        toast.success("Sub-topic deleted successfully");
        fetchSubTopics();
        onSubTopicUpdated();
      } catch (error) {
        console.error("Error deleting sub-topic:", error);
        toast.error("Failed to delete sub-topic");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpdate = async () => {
    if (!editingSubTopic) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('sub_topics')
        .update({ name: editedName })
        .eq('id', editingSubTopic.id);

      if (error) throw error;

      toast.success("Sub-topic updated successfully");
      setIsDialogOpen(false);
      fetchSubTopics();
      onSubTopicUpdated();
    } catch (error) {
      console.error("Error updating sub-topic:", error);
      toast.error("Failed to update sub-topic");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold mb-2">Existing Sub-topics</h4>
      <div className="space-y-2">
        {subTopics.map((subTopic) => (
          <div
            key={subTopic.id}
            className="flex items-center justify-between p-2 border rounded-md bg-background"
          >
            <span>{subTopic.name}</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(subTopic)}
                disabled={isLoading}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(subTopic)}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
        {subTopics.length === 0 && (
          <p className="text-sm text-muted-foreground">No sub-topics found for this category.</p>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Sub-topic</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="editSubTopicName">Sub-topic Name</Label>
            <Input
              id="editSubTopicName"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              placeholder="Enter new sub-topic name"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate}
              disabled={isLoading || !editedName.trim()}
            >
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

