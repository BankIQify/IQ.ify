
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { QuestionItem } from "../types";

interface RawTextEditorProps {
  rawText: string;
  onRawTextChange: (value: string) => void;
  onParseQuestions: (text: string) => void;
  parseError: string | null;
  isParsing: boolean;
}

export const RawTextEditor = ({
  rawText,
  onRawTextChange,
  onParseQuestions,
  parseError,
  isParsing
}: RawTextEditorProps) => {
  return (
    <div className="space-y-4">
      <Textarea 
        value={rawText} 
        onChange={(e) => onRawTextChange(e.target.value)} 
        rows={15}
        placeholder="Paste your raw question text here..."
        className="font-mono text-sm"
        disabled={isParsing}
      />
      
      {parseError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{parseError}</AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-end">
        <Button 
          onClick={() => onParseQuestions(rawText)}
          disabled={isParsing || !rawText.trim()}
        >
          {isParsing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Parsing...
            </>
          ) : (
            "Parse Questions"
          )}
        </Button>
      </div>
    </div>
  );
};
