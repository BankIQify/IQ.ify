import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  name: string;
  role: string;
  company: string;
  review: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
}

export const ReviewsEditor: React.FC = () => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedData = (data || []).map(item => ({
        id: item.id as string,
        name: item.name as string,
        role: item.role as string,
        company: item.company as string,
        review: item.review as string,
        rating: item.rating as number,
        status: item.status as 'pending' | 'approved' | 'rejected',
      }));

      setReviews(mappedData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;

      setReviews(reviews.map(review =>
        review.id === id ? { ...review, status: 'approved' } : review
      ));

      toast({
        title: "Success",
        description: "Review approved successfully",
      });
    } catch (error) {
      console.error('Error approving review:', error);
      toast({
        title: "Error",
        description: "Failed to approve review",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;

      setReviews(reviews.map(review =>
        review.id === id ? { ...review, status: 'rejected' } : review
      ));

      toast({
        title: "Success",
        description: "Review rejected successfully",
      });
    } catch (error) {
      console.error('Error rejecting review:', error);
      toast({
        title: "Error",
        description: "Failed to reject review",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setReviews(reviews.filter(review => review.id !== id));
      toast({
        title: "Success",
        description: "Review deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Error",
        description: "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  const filteredReviews = reviews.filter(review => {
    if (activeTab === 'pending') return review.status === 'pending';
    return review.status === 'approved';
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reviews Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value: 'pending' | 'approved') => setActiveTab(value)}>
            <TabsList>
              <TabsTrigger value="pending">Pending Reviews</TabsTrigger>
              <TabsTrigger value="approved">Approved Reviews</TabsTrigger>
            </TabsList>

            <div className="mt-4">
              {filteredReviews.map((review) => (
                <Card key={review.id} className="mb-4 p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{review.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {review.role} at {review.company}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {activeTab === 'pending' ? (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleApprove(review.id)}
                              className="text-green-500 hover:text-green-600"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleReject(review.id)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(review.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Review</Label>
                      <p className="text-sm">{review.review}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label>Rating:</Label>
                      <span className="font-semibold">{review.rating}/5</span>
                    </div>
                  </div>
                </Card>
              ))}

              {filteredReviews.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No {activeTab} reviews found.
                </div>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}; 