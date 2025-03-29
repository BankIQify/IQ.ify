import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Check, X, ArrowUp, ArrowDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Testimonial {
  id: string;
  user_id: string;
  name: string;
  role: string | null;
  avatar_url: string | null;
  quote: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
}

export const TestimonialManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ["testimonials", activeTab],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .eq("status", activeTab)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Testimonial[];
    },
  });

  const updateTestimonialMutation = useMutation({
    mutationFn: async ({ id, status, displayOrder }: { id: string; status: string; displayOrder?: number }) => {
      if (status === "approved") {
        // First, update the testimonial status
        const { error: testimonialError } = await supabase
          .from("testimonials")
          .update({ status })
          .eq("id", id);

        if (testimonialError) throw testimonialError;

        // Then, add to approved_testimonials if not already there
        const { error: approvedError } = await supabase
          .from("approved_testimonials")
          .upsert({ 
            testimonial_id: id,
            display_order: displayOrder || 0
          });

        if (approvedError) throw approvedError;
      } else {
        // If rejecting, remove from approved_testimonials if present
        if (status === "rejected") {
          await supabase
            .from("approved_testimonials")
            .delete()
            .eq("testimonial_id", id);
        }

        // Update testimonial status
        const { error } = await supabase
          .from("testimonials")
          .update({ status })
          .eq("id", id);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
      toast({
        title: "Success",
        description: "Testimonial status updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating testimonial:", error);
      toast({
        title: "Error",
        description: "Failed to update testimonial status",
        variant: "destructive",
      });
    },
  });

  const updateDisplayOrderMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: "up" | "down" }) => {
      const { data: currentOrder } = await supabase
        .from("approved_testimonials")
        .select("display_order")
        .eq("testimonial_id", id)
        .single();

      if (!currentOrder) throw new Error("Testimonial not found");

      const newOrder = direction === "up" 
        ? currentOrder.display_order - 1 
        : currentOrder.display_order + 1;

      const { error } = await supabase
        .from("approved_testimonials")
        .update({ display_order: newOrder })
        .eq("testimonial_id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["testimonials"] });
    },
    onError: (error) => {
      console.error("Error updating display order:", error);
      toast({
        title: "Error",
        description: "Failed to update display order",
        variant: "destructive",
      });
    },
  });

  const handleStatusUpdate = (id: string, status: "approved" | "rejected") => {
    updateTestimonialMutation.mutate({ 
      id, 
      status,
      displayOrder: status === "approved" ? testimonials.length : undefined
    });
  };

  const handleDisplayOrderUpdate = (id: string, direction: "up" | "down") => {
    updateDisplayOrderMutation.mutate({ id, direction });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Manage Testimonials</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          {["pending", "approved", "rejected"].map((status) => (
            <TabsContent key={status} value={status}>
              {isLoading ? (
                <div className="text-center py-4">Loading testimonials...</div>
              ) : testimonials.length === 0 ? (
                <div className="text-center py-4">No {status} testimonials</div>
              ) : (
                <div className="space-y-4">
                  {testimonials.map((testimonial) => (
                    <Card key={testimonial.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <Avatar className="h-10 w-10">
                            {testimonial.avatar_url ? (
                              <AvatarImage src={testimonial.avatar_url} alt={testimonial.name} />
                            ) : (
                              <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <div className="font-semibold">{testimonial.name}</div>
                            {testimonial.role && (
                              <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                            )}
                            <div className="flex mt-1">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                              ))}
                            </div>
                            <p className="mt-2 text-muted-foreground">{testimonial.quote}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {status === "approved" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDisplayOrderUpdate(testimonial.id, "up")}
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDisplayOrderUpdate(testimonial.id, "down")}
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600"
                                onClick={() => handleStatusUpdate(testimonial.id, "approved")}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600"
                                onClick={() => handleStatusUpdate(testimonial.id, "rejected")}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          {status === "rejected" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-green-600"
                              onClick={() => handleStatusUpdate(testimonial.id, "approved")}
                            >
                              Approve
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}; 