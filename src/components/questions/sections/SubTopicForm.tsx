
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubTopicList } from "./SubTopicList";

interface SubTopicFormProps {
  sections?: any[];
  onSubTopicAdded: () => void;
}

export const SubTopicForm = ({ sections, onSubTopicAdded }: SubTopicFormProps) => {
  const [selectedCategory, setSelectedCategory] = useState<'verbal' | 'non_verbal' | 'brain_training'>('verbal');
  const [newSubTopicName, setNewSubTopicName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSubTopic = async () => {
    if (!newSubTopicName.trim()) {
      toast.error("Please enter a sub-topic name");
      return;
    }

    try {
      setIsSubmitting(true);

      // First, let's get the section for the selected category
      const { data: sections, error: sectionError } = await supabase
        .from('question_sections')
        .select('id')
        .eq('category', selectedCategory)
        .limit(1);

      if (sectionError) {
        console.error("Error fetching section:", sectionError);
        toast.error("Failed to find section for selected category");
        return;
      }

      if (!sections || sections.length === 0) {
        console.error("No section found for category:", selectedCategory);
        toast.error("No section found for selected category. Please create a section first.");
        return;
      }

      const sectionId = sections[0].id;

      const { error: insertError } = await supabase
        .from('sub_topics')
        .insert([{ 
          name: newSubTopicName,
          section_id: sectionId
        }]);

      if (insertError) {
        console.error("Error inserting sub-topic:", insertError);
        toast.error("Failed to add sub-topic");
        return;
      }

      toast.success("Sub-topic added successfully");
      setNewSubTopicName("");
      onSubTopicAdded();
    } catch (error) {
      console.error("Unexpected error adding sub-topic:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Add New Sub-topic</h3>
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <Label htmlFor="category">Category</Label>
          <Select
            value={selectedCategory}
            onValueChange={(value: 'verbal' | 'non_verbal' | 'brain_training') => {
              setSelectedCategory(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="verbal">Verbal Reasoning</SelectItem>
              <SelectItem value="non_verbal">Non-Verbal Reasoning</SelectItem>
              <SelectItem value="brain_training">Brain Training</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label htmlFor="subTopicName">Sub-topic Name</Label>
          <Input
            id="subTopicName"
            value={newSubTopicName}
            onChange={(e) => setNewSubTopicName(e.target.value)}
            placeholder="Enter sub-topic name"
          />
        </div>
        <Button 
          onClick={handleAddSubTopic}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Sub-topic"}
        </Button>
      </div>

      <SubTopicList 
        selectedCategory={selectedCategory}
        onSubTopicUpdated={onSubTopicAdded}
      />
    </Card>
  );
};
