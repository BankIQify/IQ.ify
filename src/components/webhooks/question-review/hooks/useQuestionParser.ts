
import { useState } from "react";
import { parseRawQuestions } from "../utils/questionParser";
import { QuestionItem } from "../types";
import { useToast } from "@/hooks/use-toast";
import { parseQuestionBlock } from "../utils/questionParser/parseQuestionBlock";

export const useQuestionParser = (subTopicId?: string, onSetQuestions?: (questions: QuestionItem[]) => void) => {
  const [rawText, setRawText] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const { toast } = useToast();

  const handleRawTextChange = (text: string) => {
    setRawText(text);
  };

  const handleParseRawText = (text: string) => {
    if (!onSetQuestions) return;
    
    try {
      setIsParsing(true);
      setParseError(null);
      
      if (!text.trim()) {
        setParseError("Raw text cannot be empty");
        return;
      }
      
      const parsedQuestions = parseRawQuestions(text);
      if (parsedQuestions.length === 0) {
        setParseError("No questions could be parsed from the text. Please check the format or try selecting sections manually.");
        return;
      }
      
      // Add subTopicId to each question
      const questionsWithSubTopic = parsedQuestions.map(q => ({
        ...q,
        subTopicId: q.subTopicId || subTopicId
      }));
      
      onSetQuestions(questionsWithSubTopic);
      setParseError(null);
      
      toast({
        title: "Questions parsed",
        description: `Successfully parsed ${questionsWithSubTopic.length} questions`
      });
    } catch (error) {
      console.error("Error parsing questions:", error);
      setParseError(error instanceof Error ? error.message : "Failed to parse questions. Please check the format.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleParseIndividualSelections = (selections: string[]) => {
    if (!onSetQuestions || selections.length === 0) return;
    
    try {
      setIsParsing(true);
      setParseError(null);
      
      const parsedQuestions = selections.map(selection => {
        const parsedQuestion = parseQuestionBlock(selection);
        return {
          ...parsedQuestion,
          subTopicId: subTopicId
        };
      }).filter(q => q.question.trim().length > 0);
      
      if (parsedQuestions.length === 0) {
        setParseError("No valid questions could be parsed from your selections.");
        return;
      }
      
      onSetQuestions(parsedQuestions);
      setParseError(null);
      
      toast({
        title: "Selections parsed",
        description: `Successfully parsed ${parsedQuestions.length} questions from your selections`
      });
    } catch (error) {
      console.error("Error parsing selections:", error);
      setParseError(error instanceof Error ? error.message : "Failed to parse selections.");
    } finally {
      setIsParsing(false);
    }
  };

  return {
    rawText,
    parseError,
    isParsing,
    handleRawTextChange,
    handleParseRawText,
    handleParseIndividualSelections
  };
};
