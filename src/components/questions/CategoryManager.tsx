
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const CategoryManager = () => {
  const [newSectionName, setNewSectionName] = useState("");
  const [newSubTopicName, setNewSubTopicName] = useState("");
  const [selectedSection, setSelectedSection] = useState<string>("");

  // Fetch all sections and their sub-topics
  const { data: sections, refetch: refetchSections } = useQuery({
    queryKey: ['sections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('question_sections')
        .select(`
          *,
          sub_topics (
            id,
            name
          )
        `)
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

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
          category: 'verbal' // Default to verbal, can be enhanced with category selection
        }]);

      if (error) throw error;

      toast.success("Section added successfully");
      setNewSectionName("");
      refetchSections();
    } catch (error) {
      toast.error("Failed to add section");
      console.error("Error adding section:", error);
    }
  };

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
      refetchSections();
    } catch (error) {
      toast.error("Failed to add sub-topic");
      console.error("Error adding sub-topic:", error);
    }
  };

  return (
    <div className="space-y-6">
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

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Add New Sub-topic</h3>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="sectionSelect">Select Section</Label>
            <select
              id="sectionSelect"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a section</option>
              {sections?.map((section) => (
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

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Current Categories</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Section</TableHead>
              <TableHead>Sub-topics</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections?.map((section) => (
              <TableRow key={section.id}>
                <TableCell className="font-medium">{section.name}</TableCell>
                <TableCell>
                  {section.sub_topics?.map((subTopic) => subTopic.name).join(", ")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
