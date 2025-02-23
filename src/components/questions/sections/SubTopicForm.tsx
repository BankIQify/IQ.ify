
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface SubTopicFormProps {
  sections?: any[];
  onSubTopicAdded: () => void;
}

export const SubTopicForm = ({ sections, onSubTopicAdded }: SubTopicFormProps) => {
  const [selectedCategory, setSelectedCategory] = useState<'verbal' | 'non_verbal' | 'brain_training'>('verbal');
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [newSubTopicName, setNewSubTopicName] = useState("");

  // Filter sections based on selected category
  const filteredSections = sections?.filter(section => section.category === selectedCategory);

  const handleAddSubTopic = async () => {
    if (!selectedSection || !newSubTopicName.trim()) {
      toast.error("Please select a section and enter a sub-topic name");
      return;
    }

    try {
      const { error } = await supabase
        .from('sub_topics')
        .insert([{ 
          name: newSubTopicName,
          section_id: selectedSection
        }]);

      if (error) throw error;

      toast.success("Sub-topic added successfully");
      setNewSubTopicName("");
      onSubTopicAdded();
    } catch (error) {
      toast.error("Failed to add sub-topic");
      console.error("Error adding sub-topic:", error);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Add New Sub-topic</h3>
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value as 'verbal' | 'non_verbal' | 'brain_training');
              setSelectedSection("");
            }}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="verbal">Verbal Reasoning</option>
            <option value="non_verbal">Non-Verbal Reasoning</option>
            <option value="brain_training">Brain Training</option>
          </select>
        </div>
        <div className="flex-1">
          <Label htmlFor="sectionSelect">Select Section</Label>
          <select
            id="sectionSelect"
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select a section</option>
            {filteredSections?.map((section) => (
              <option key={section.id} value={section.id}>
                {section.name}
              </option>
            ))}
          </select>
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
        <Button onClick={handleAddSubTopic}>Add Sub-topic</Button>
      </div>
    </Card>
  );
};
