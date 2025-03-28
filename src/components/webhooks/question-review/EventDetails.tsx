
import { Card } from "@/components/ui/card";
import { WebhookEvent } from "./types";

interface EventDetailsProps {
  event: WebhookEvent;
}

export const EventDetails = ({ event }: EventDetailsProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="p-3 bg-muted rounded-md">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm font-medium">Source</p>
          <p className="text-sm">{event.source}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Received</p>
          <p className="text-sm">{formatDate(event.created_at)}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Sub-topic</p>
          <p className="text-sm">{event.payload?.sub_topic_name || event.payload?.sub_topic_id || 'Unknown'}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Questions</p>
          <p className="text-sm">{event.payload?.questions?.length || 0}</p>
        </div>
      </div>
    </div>
  );
};
