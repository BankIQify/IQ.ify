
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface EditorHeaderProps {
  showRawEditor: boolean;
  onToggleEditorView: () => void;
  onDiscardEvent: () => void;
  onSaveQuestions: () => void;
  isLoading: boolean;
  hasQuestions: boolean;
}

export const EditorHeader = ({
  showRawEditor,
  onToggleEditorView,
  onDiscardEvent,
  onSaveQuestions,
  isLoading,
  hasQuestions
}: EditorHeaderProps) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle>Edit Questions</CardTitle>
        <CardDescription>
          Review and edit questions before saving them to the database
        </CardDescription>
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          onClick={onToggleEditorView}
          disabled={isLoading}
        >
          {showRawEditor ? "Show Formatted" : "Edit Raw Text"}
        </Button>
        <Button 
          variant="outline" 
          onClick={onDiscardEvent}
          disabled={isLoading}
        >
          Discard
        </Button>
        <Button 
          onClick={onSaveQuestions}
          disabled={isLoading || !hasQuestions}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Save All Questions"
          )}
        </Button>
      </div>
    </CardHeader>
  );
};
