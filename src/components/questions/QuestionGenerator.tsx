
import { useState } from "react";
import { CustomPromptInput } from "./components/CustomPromptInput";
import { GeneratorActions } from "./components/GeneratorActions";
import { useQuestionMutations } from "./mutations/useQuestionMutations";

interface QuestionGeneratorProps {
  subTopicId: string;
  category: string;
}

export const QuestionGenerator = ({ subTopicId, category }: QuestionGeneratorProps) => {
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
    generateQuestionMutation.mutate({ category, customPrompt });
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
