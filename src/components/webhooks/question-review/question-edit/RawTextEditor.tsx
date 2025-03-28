
import { useState, useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, Scissors, FileStack, Save } from "lucide-react";
import { QuestionItem } from "../types";
import { parseQuestionBlock } from "../utils/questionParser/parseQuestionBlock";

interface RawTextEditorProps {
  rawText: string;
  onRawTextChange: (value: string) => void;
  onParseQuestions: (text: string) => void;
  onParseSelections?: (selections: string[]) => void;
  parseError: string | null;
  isParsing: boolean;
}

export const RawTextEditor = ({
  rawText,
  onRawTextChange,
  onParseQuestions,
  onParseSelections,
  parseError,
  isParsing
}: RawTextEditorProps) => {
  const [selections, setSelections] = useState<{start: number, end: number, text: string}[]>([]);
  const [currentSelection, setCurrentSelection] = useState<{start: number, end: number, text: string} | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Handle text selection
  const handleTextSelect = () => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;
    
    if (selectionStart === selectionEnd) return;
    
    const selectedText = rawText.substring(selectionStart, selectionEnd);
    
    setCurrentSelection({
      start: selectionStart,
      end: selectionEnd,
      text: selectedText
    });
  };
  
  // Add current selection to the list
  const addSelection = () => {
    if (!currentSelection) return;
    
    setSelections(prev => [...prev, currentSelection]);
    setCurrentSelection(null);
    
    // Reset textarea selection
    if (textareaRef.current) {
      textareaRef.current.selectionStart = 0;
      textareaRef.current.selectionEnd = 0;
      textareaRef.current.focus();
    }
  };
  
  // Parse only selected sections
  const parseSelectedSections = () => {
    if (selections.length === 0) {
      // If no selections, parse the full text
      onParseQuestions(rawText);
      return;
    }
    
    // Sort selections by start position
    const sortedSelections = [...selections].sort((a, b) => a.start - b.start);
    
    // Join selected sections
    const combinedText = sortedSelections.map(s => s.text).join("\n\n");
    onParseQuestions(combinedText);
  };
  
  // Clear all selections
  const clearSelections = () => {
    setSelections([]);
    setCurrentSelection(null);
  };
  
  // Handle parsing each selection separately
  const parseAsIndividualQuestions = () => {
    if (selections.length === 0 || !onParseSelections) return;
    
    // Get all selected texts as an array
    const selectionTexts = selections.map(selection => selection.text);
    
    // Pass the array of selections to the parent handler
    onParseSelections(selectionTexts);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium">
            Raw Question Text
          </div>
          <div className="flex items-center space-x-2">
            {currentSelection && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={addSelection}
                className="h-7 px-2 text-xs"
              >
                <FileStack className="h-3.5 w-3.5 mr-1" />
                Add Selection
              </Button>
            )}
            {selections.length > 0 && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={clearSelections}
                className="h-7 px-2 text-xs"
              >
                Clear Selections ({selections.length})
              </Button>
            )}
          </div>
        </div>
        
        <Textarea 
          ref={textareaRef}
          value={rawText} 
          onChange={(e) => onRawTextChange(e.target.value)} 
          onSelect={handleTextSelect}
          rows={15}
          placeholder="Paste your raw question text here..."
          className="font-mono text-sm"
          disabled={isParsing}
        />
      </div>
      
      {selections.length > 0 && (
        <div className="border rounded-md p-3 bg-muted/30">
          <h4 className="text-sm font-medium mb-2">Selected Sections ({selections.length})</h4>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {selections.map((selection, index) => (
              <div key={index} className="bg-background p-2 rounded-sm border text-xs font-mono overflow-hidden text-ellipsis whitespace-nowrap">
                {selection.text.substring(0, 50)}
                {selection.text.length > 50 ? '...' : ''}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {parseError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{parseError}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-end space-x-2">
        {selections.length > 0 && onParseSelections && (
          <Button 
            onClick={parseAsIndividualQuestions}
            disabled={isParsing || selections.length === 0}
            variant="outline"
          >
            <Scissors className="mr-2 h-4 w-4" />
            Parse As Individual Questions
          </Button>
        )}
        
        <Button 
          onClick={parseSelectedSections}
          disabled={isParsing || !rawText.trim()}
        >
          {isParsing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Parsing...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {selections.length > 0 ? "Parse Selected Sections" : "Parse All Text"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
