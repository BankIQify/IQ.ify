import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const TestimonialForm = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [quote, setQuote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      navigate("/login", { state: { returnTo: "/testimonials/new" } });
      return;
    }

    if (!quote.trim()) {
      toast({
        title: "Error",
        description: "Please provide your testimonial",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("testimonials").insert({
        user_id: user.id,
        name: user.user_metadata?.full_name || "Anonymous",
        quote: quote.trim(),
        rating,
        status: "pending",
        avatar_url: user.user_metadata?.avatar_url || null,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Thank you for your testimonial! It will be reviewed shortly.",
      });
      
      setQuote("");
      setRating(5);
      navigate("/");
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      toast({
        title: "Error",
        description: "Failed to submit testimonial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Share Your Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Your Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setRating(star)}
                  className={star <= rating ? "text-yellow-400" : "text-gray-300"}
                >
                  <Star className="h-6 w-6 fill-current" />
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="testimonial">Your Testimonial</Label>
            <Textarea
              id="testimonial"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Share your experience with IQify..."
              className="min-h-[150px]"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Testimonial"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}; 