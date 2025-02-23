
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface SectionFormProps {
  onSectionAdded: () => void;
}

export const SectionForm = ({ onSectionAdded }: SectionFormProps) => {
  const [newSectionName, setNewSectionName] = useState("");

  const handleAddSection = async () => {
    if (!newSectionName.trim()) {
      toast.error("Please enter a section name");
      return;
    }

    try {
      const { error } = await supabase
        .from('question_sections')
        .insert([{ 
          name: newSectionName,
          category: 'verbal'
        }]);

      if (error) throw error;

      toast.success("Section added successfully");
      setNewSectionName("");
      onSectionAdded();
    } catch (error) {
      toast.error("Failed to add section");
      console.error("Error adding section:", error);
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Add New Section</h3>
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <Label htmlFor="sectionName">Section Name</Label>
          <Input
            id="sectionName"
            value={newSectionName}
            onChange={(e) => setNewSectionName(e.target.value)}
            placeholder="Enter section name"
          />
        </div>
        <Button onClick={handleAddSection}>Add Section</Button>
      </div>
    </Card>
  );
};

