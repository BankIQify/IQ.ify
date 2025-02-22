
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type QuestionCategory = 'verbal' | 'non_verbal' | 'brain_training';

interface TopicSelectorProps {
  selectedTopics: QuestionCategory[];
  onTopicSelection: (topic: QuestionCategory) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TopicSelector({ selectedTopics, onTopicSelection, open, onOpenChange }: TopicSelectorProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedTopics.length === 0
            ? "Select topics..."
            : `${selectedTopics.length} topic${selectedTopics.length === 1 ? '' : 's'} selected`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search topics..." />
          <CommandEmpty>No topics found.</CommandEmpty>
          <CommandGroup>
            {['verbal', 'non_verbal', 'brain_training'].map((topic) => (
              <CommandItem
                key={topic}
                value={topic}
                onSelect={() => onTopicSelection(topic as QuestionCategory)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedTopics.includes(topic as QuestionCategory) ? "opacity-100" : "opacity-0"
                  )}
                />
                {topic.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
