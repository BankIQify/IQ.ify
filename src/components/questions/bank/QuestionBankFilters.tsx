
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { QuestionCategory } from "@/types/questions";

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100];

interface QuestionBankFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  category: QuestionCategory | "all";
  onCategoryChange: (value: QuestionCategory | "all") => void;
  subTopicId: string;
  onSubTopicChange: (value: string) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (value: number) => void;
  showDuplicatesOnly: boolean;
  onShowDuplicatesOnlyChange: (value: boolean) => void;
  subTopics?: Array<{ id: string; name: string }>;
}

export const QuestionBankFilters = ({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  subTopicId,
  onSubTopicChange,
  itemsPerPage,
  onItemsPerPageChange,
  showDuplicatesOnly,
  onShowDuplicatesOnlyChange,
  subTopics
}: QuestionBankFiltersProps) => {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <Label>Search Questions</Label>
          <Input
            type="text"
            placeholder="Search by question text..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>

        <div>
          <Label>Category</Label>
          <Select 
            value={category} 
            onValueChange={(value: QuestionCategory | "all") => {
              onCategoryChange(value);
              onSubTopicChange("all");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="verbal">Verbal Reasoning</SelectItem>
              <SelectItem value="non_verbal">Non-Verbal Reasoning</SelectItem>
              <SelectItem value="brain_training">Brain Training</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Sub-topic</Label>
          <Select 
            value={subTopicId} 
            onValueChange={onSubTopicChange}
            disabled={category === "all"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sub-topic" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sub-topics</SelectItem>
              {subTopics?.map((subTopic) => (
                <SelectItem key={subTopic.id} value={subTopic.id}>
                  {subTopic.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Items per page</Label>
          <Select 
            value={itemsPerPage.toString()} 
            onValueChange={(value) => onItemsPerPageChange(Number(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4 flex items-center">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input 
            type="checkbox" 
            checked={showDuplicatesOnly} 
            onChange={(e) => onShowDuplicatesOnlyChange(e.target.checked)}
            className="form-checkbox h-4 w-4"
          />
          <span>Show potential duplicates only</span>
        </label>
      </div>
    </Card>
  );
};
