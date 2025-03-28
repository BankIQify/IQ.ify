
import { Label } from "@/components/ui/label";
import { OptionInput } from "./OptionInput";

interface DualChoiceEditorProps {
  primaryOptions: string[];
  secondaryOptions: string[];
  correctPrimaryAnswer?: string;
  correctSecondaryAnswer?: string;
  onPrimaryOptionChange: (index: number, value: string) => void;
  onSecondaryOptionChange: (index: number, value: string) => void;
  onCorrectPrimaryAnswerChange: (value: string) => void;
  onCorrectSecondaryAnswerChange: (value: string) => void;
}

export const DualChoiceEditor = ({
  primaryOptions,
  secondaryOptions,
  correctPrimaryAnswer,
  correctSecondaryAnswer,
  onPrimaryOptionChange,
  onSecondaryOptionChange,
  onCorrectPrimaryAnswerChange,
  onCorrectSecondaryAnswerChange
}: DualChoiceEditorProps) => {
  if (!Array.isArray(primaryOptions) || !Array.isArray(secondaryOptions)) {
    return null;
  }

  return (
    <>
      <div className="space-y-2">
        <Label>Primary Options</Label>
        {primaryOptions.map((option, i) => (
          <OptionInput
            key={i}
            option={option}
            isCorrect={option === correctPrimaryAnswer}
            onOptionChange={(value) => onPrimaryOptionChange(i, value)}
            onSetCorrect={() => onCorrectPrimaryAnswerChange(option)}
            showRemoveButton={false}
          />
        ))}
      </div>

      <div className="space-y-2">
        <Label>Secondary Options</Label>
        {secondaryOptions.map((option, i) => (
          <OptionInput
            key={i}
            option={option}
            isCorrect={option === correctSecondaryAnswer}
            onOptionChange={(value) => onSecondaryOptionChange(i, value)}
            onSetCorrect={() => onCorrectSecondaryAnswerChange(option)}
            showRemoveButton={false}
          />
        ))}
      </div>
    </>
  );
};
