
import { useState } from "react";
import { CustomPromptInput } from "./components/CustomPromptInput";
import { GeneratorActions } from "./components/GeneratorActions";
import { useQuestionMutations } from "./mutations/useQuestionMutations";
import type { AnswerLayoutConfig } from "./utils/subTopicAnswerLayouts";

interface QuestionGeneratorProps {
  subTopicId: string;
  category: string;
  answerLayout?: AnswerLayoutConfig | null;
}

export const QuestionGenerator = ({ subTopicId, category, answerLayout }: QuestionGeneratorProps) => {
  const [customPrompt, setCustomPrompt] = useState("");
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [isTestingDelay, setIsTestingDelay] = useState(false);
  
  const { 
    testDelayMutation,
    testConnectionMutation,
    generateQuestionMutation 
  } = useQuestionMutations(subTopicId);

  const handleGenerateQuestion = async () => {
    setIsTestingConnection(true);
    await testConnectionMutation.mutateAsync();
    setIsTestingConnection(false);
    
    // Include the answer layout in the custom prompt if available
    let updatedPrompt = customPrompt;
    if (answerLayout) {
      const layoutInfo = `Answer format: ${answerLayout.layout}. ${answerLayout.description}`;
      updatedPrompt = customPrompt ? `${customPrompt}\n\n${layoutInfo}` : layoutInfo;
    }
    
    generateQuestionMutation.mutate({ category, customPrompt: updatedPrompt });
  };

  const handleTestDelay = () => {
    setIsTestingDelay(true);
    testDelayMutation.mutate(undefined, {
      onSettled: () => setIsTestingDelay(false)
    });
  };

  return (
    <div className="space-y-4">
      <CustomPromptInput 
        value={customPrompt}
        onChange={setCustomPrompt}
      />

      <GeneratorActions
        onTestDelay={handleTestDelay}
        onGenerate={handleGenerateQuestion}
        isTestingDelay={isTestingDelay}
        isGenerating={generateQuestionMutation.isPending}
        isTestingConnection={isTestingConnection}
        subTopicId={subTopicId}
        testDelayError={testDelayMutation.error as Error}
        connectionError={testConnectionMutation.error as Error}
      />
    </div>
  );
};
