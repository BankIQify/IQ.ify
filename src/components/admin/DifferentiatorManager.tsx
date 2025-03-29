import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Trash2, Plus, Save } from "lucide-react";
import { IconPicker } from "@/components/ui/icon-picker";
import { useToast } from "@/hooks/use-toast";

interface Differentiator {
  id: string;
  title: string;
  description: string;
  icon: string;
  order_index: number;
}

export const DifferentiatorManager = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newDifferentiator, setNewDifferentiator] = useState({
    title: "",
    description: "",
    icon: "Sparkles",
    order_index: 0,
  });

  const { data: differentiators = [], isError } = useQuery({
    queryKey: ["differentiators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("differentiators")
        .select("*")
        .order("order_index");
      if (error) {
        toast({
          title: "Error fetching differentiators",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data as Differentiator[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (newItem: Omit<Differentiator, "id">) => {
      const { data, error } = await supabase
        .from("differentiators")
        .insert([{ ...newItem, order_index: differentiators.length }])
        .select()
        .single();
      if (error) {
        toast({
          title: "Error adding differentiator",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["differentiators"] });
      setIsAdding(false);
      setNewDifferentiator({ title: "", description: "", icon: "Sparkles", order_index: 0 });
      toast({
        title: "Success",
        description: "Differentiator added successfully",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("differentiators")
        .delete()
        .eq("id", id);
      if (error) {
        toast({
          title: "Error deleting differentiator",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["differentiators"] });
      toast({
        title: "Success",
        description: "Differentiator deleted successfully",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Differentiator> }) => {
      const { error } = await supabase
        .from("differentiators")
        .update(data)
        .eq("id", id);
      if (error) {
        toast({
          title: "Error updating differentiator",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["differentiators"] });
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Differentiators</h2>
        <Button 
          onClick={() => setIsAdding(true)}
          disabled={isAdding}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Add New Form */}
        {isAdding && (
          <div className="p-6 rounded-sm shadow-lg bg-[#fff8b8] relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gray-300 shadow-inner border-2 border-gray-400" />
            <div className="space-y-4">
              <IconPicker
                value={newDifferentiator.icon}
                onChange={(icon) => setNewDifferentiator(prev => ({ ...prev, icon }))}
              />
              <Input
                placeholder="Title"
                value={newDifferentiator.title}
                onChange={(e) => setNewDifferentiator(prev => ({ ...prev, title: e.target.value }))}
                className="font-handwriting"
              />
              <Textarea
                placeholder="Description"
                value={newDifferentiator.description}
                onChange={(e) => setNewDifferentiator(prev => ({ ...prev, description: e.target.value }))}
                className="font-handwriting"
                rows={3}
              />
              <div className="flex gap-2">
                <Button 
                  onClick={() => addMutation.mutate(newDifferentiator)}
                  className="w-full"
                  variant="default"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button 
                  onClick={() => setIsAdding(false)}
                  variant="outline"
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Existing Differentiators */}
        {differentiators.map((diff, index) => (
          <div 
            key={diff.id}
            className={`
              p-6 rounded-sm shadow-lg relative
              ${index % 3 === 0 ? 'bg-[#fff8b8]' : index % 3 === 1 ? 'bg-[#b8fff9]' : 'bg-[#ffb8ee]'}
            `}
          >
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-gray-300 shadow-inner border-2 border-gray-400" />
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <IconPicker
                  value={diff.icon}
                  onChange={(icon) => updateMutation.mutate({ id: diff.id, data: { icon } })}
                />
              </div>
              <Input
                value={diff.title}
                onChange={(e) => updateMutation.mutate({ id: diff.id, data: { title: e.target.value } })}
                className="text-xl font-semibold mb-3 font-handwriting text-center"
              />
              <Textarea
                value={diff.description}
                onChange={(e) => updateMutation.mutate({ id: diff.id, data: { description: e.target.value } })}
                className="text-gray-700 font-handwriting text-center"
                rows={3}
              />
              <Button
                variant="ghost"
                size="icon"
                className="mt-4 hover:bg-red-100 hover:text-red-600"
                onClick={() => deleteMutation.mutate(diff.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 