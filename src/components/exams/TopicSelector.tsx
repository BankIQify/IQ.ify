import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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

const topics: { value: QuestionCategory; label: string; description: string }[] = [
  { 
    value: 'verbal', 
    label: 'Verbal Reasoning',
    description: 'Test your language and comprehension skills'
  },
  { 
    value: 'non_verbal', 
    label: 'Non-Verbal Reasoning',
    description: 'Challenge your pattern recognition abilities'
  },
  { 
    value: 'brain_training', 
    label: 'Brain Training',
    description: 'Enhance your cognitive and problem-solving skills'
  }
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
            className={cn(
              "w-full justify-between border-2 transition-all duration-200",
              "hover:bg-accent hover:text-accent-foreground",
              "focus:ring-2 focus:ring-[#1EAEDB] focus:ring-offset-2",
              open && "border-[#1EAEDB] bg-accent"
            )}
          >
            <span className="truncate font-medium">
              {selectedTopics.length === 0
                ? "Select topics..."
                : `${selectedTopics.length} topic${selectedTopics.length === 1 ? '' : 's'} selected`}
            </span>
            <ChevronsUpDown className={cn(
              "ml-2 h-4 w-4 shrink-0 transition-transform duration-200",
              open ? "rotate-180 transform" : ""
            )} />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[350px] p-0 shadow-lg border-2" 
          align="start"
          side="bottom"
          sideOffset={5}
        >
          <Command className="rounded-lg">
            <CommandInput 
              placeholder="Search topics..." 
              className="h-11 rounded-t-lg border-b-2 font-medium" 
            />
            <CommandList>
              <CommandEmpty className="py-6 text-center text-sm">
                <span className="text-muted-foreground">No topics found.</span>
              </CommandEmpty>
              <CommandGroup className="p-2">
                {topics.map((topic) => (
                  <CommandItem
                    key={topic.value}
                    value={topic.value}
                    onSelect={() => {
                      onTopicSelection(topic.value);
                    }}
                    className={cn(
                      "flex items-center gap-3 p-3 cursor-pointer rounded-md",
                      "transition-all duration-200 hover:bg-accent",
                      selectedTopics.includes(topic.value) && "bg-accent/50"
                    )}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full border-2",
                        selectedTopics.includes(topic.value) 
                          ? "border-[#1EAEDB] bg-[#1EAEDB] text-white"
                          : "border-muted-foreground"
                      )}>
                        <Check className={cn(
                          "h-4 w-4 transition-opacity",
                          selectedTopics.includes(topic.value) ? "opacity-100" : "opacity-0"
                        )} />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{topic.label}</span>
                        <span className="text-xs text-muted-foreground">{topic.description}</span>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
