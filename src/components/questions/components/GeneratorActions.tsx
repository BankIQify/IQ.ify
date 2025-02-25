
import { Button } from "@/components/ui/button";

interface GeneratorActionsProps {
  onTestDelay: () => void;
  onGenerate: () => void;
  isTestingDelay: boolean;
  isGenerating: boolean;
  isTestingConnection: boolean;
  subTopicId: string;
  testDelayError?: Error;
  connectionError?: Error;
}

export const GeneratorActions = ({
  onTestDelay,
  onGenerate,
  isTestingDelay,
  isGenerating,
  isTestingConnection,
  subTopicId,
  testDelayError,
  connectionError,
}: GeneratorActionsProps) => {
  return (
    <div className="space-y-2">
      <Button 
        onClick={onTestDelay}
        disabled={isTestingDelay}
        variant="outline"
        className="w-full"
      >
        {isTestingDelay ? "Testing Delay..." : "Test Delay Function"}
      </Button>

      <Button 
        onClick={onGenerate}
        disabled={isGenerating || isTestingConnection || !subTopicId}
        className="w-full"
      >
        {isGenerating 
          ? "Generating..." 
          : isTestingConnection 
          ? "Testing Connection..." 
          : "Generate New Question"}
      </Button>

      {connectionError && (
        <p className="text-sm text-red-500">
          Connection test failed: {connectionError.message}
        </p>
      )}

      {testDelayError && (
        <p className="text-sm text-red-500">
          Delay test failed: {testDelayError.message}
        </p>
      )}
    </div>
  );
};
