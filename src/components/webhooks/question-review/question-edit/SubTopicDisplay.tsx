
import React from "react";

interface SubTopicDisplayProps {
  subTopicId?: string;
}

export const SubTopicDisplay = ({ subTopicId }: SubTopicDisplayProps) => {
  if (!subTopicId) return null;
  
  return (
    <div className="text-sm text-muted-foreground">
      Subtopic ID: {subTopicId}
    </div>
  );
};
