
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WebhookEvent } from "./types";

interface EventsListProps {
  webhookEvents: WebhookEvent[];
  isLoading: boolean;
  selectedEventId: string | null;
  onSelectEvent: (event: WebhookEvent) => void;
}

export const EventsList = ({ 
  webhookEvents, 
  isLoading, 
  selectedEventId, 
  onSelectEvent 
}: EventsListProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Questions to Review</CardTitle>
        <CardDescription>
          {isLoading 
            ? "Loading..." 
            : `${webhookEvents.length} sets of questions waiting for review`}
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-y-auto">
        {webhookEvents.length === 0 && !isLoading ? (
          <div className="text-center py-6 text-muted-foreground">
            No questions to review
          </div>
        ) : (
          <div className="space-y-2">
            {webhookEvents.map((event) => (
              <div 
                key={event.id} 
                className={`p-3 border rounded-md cursor-pointer hover:bg-muted transition-colors ${
                  selectedEventId === event.id ? 'border-primary bg-muted/50' : ''
                }`}
                onClick={() => onSelectEvent(event)}
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{event.source}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(event.created_at)}
                  </span>
                </div>
                <div className="mt-2 font-medium">
                  {event.payload?.sub_topic_name || 'Unknown sub-topic'}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {event.payload?.questions?.length || 0} questions
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
