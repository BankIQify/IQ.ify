
import { Label } from "@/components/ui/label";

interface SubTopic {
  id: string;
  name: string;
  section_id: string;
}

interface SubTopicSelectorProps {
  availableSubTopics: SubTopic[];
  selectedSubTopics: string[];
  onSubTopicChange: (subTopicId: string, checked: boolean) => void;
}

export function SubTopicSelector({ availableSubTopics, selectedSubTopics, onSubTopicChange }: SubTopicSelectorProps) {
  if (availableSubTopics.length === 0) return null;

  return (
    <div className="space-y-2">
      <Label>Sub-topics (Optional)</Label>
      <div className="grid grid-cols-1 gap-2">
        {availableSubTopics.map((subTopic) => (
          <div key={subTopic.id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              id={subTopic.id}
              checked={selectedSubTopics.includes(subTopic.id)}
              onChange={(e) => onSubTopicChange(subTopic.id, e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor={subTopic.id} className="text-sm">
              {subTopic.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
