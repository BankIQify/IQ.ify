
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

const topics: { value: QuestionCategory; label: string }[] = [
  { value: 'verbal', label: 'Verbal Reasoning' },
  { value: 'non_verbal', label: 'Non-Verbal Reasoning' },
  { value: 'brain_training', label: 'Brain Training' }
];

export function TopicSelector({ selectedTopics, onTopicSelection, open, onOpenChange }: TopicSelectorProps) {
  return (
    <div className="relative">
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <span className="truncate">
              {selectedTopics.length === 0
                ? "Select topics..."
                : `${selectedTopics.length} topic${selectedTopics.length === 1 ? '' : 's'} selected`}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[300px] p-0" 
          align="start"
          side="bottom"
          sideOffset={5}
        >
          <Command>
            <CommandInput placeholder="Search topics..." className="h-9" />
            <CommandEmpty>No topics found.</CommandEmpty>
            <CommandGroup className="max-h-[200px] overflow-auto">
              {topics.map((topic) => (
                <CommandItem
                  key={topic.value}
                  value={topic.value}
                  onSelect={() => {
                    onTopicSelection(topic.value);
                    // Don't close the popover after selection since we support multiple selections
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <Check
                      className={cn(
                        "h-4 w-4",
                        selectedTopics.includes(topic.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span>{topic.label}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
