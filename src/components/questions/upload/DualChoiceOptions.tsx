
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface DualChoiceOptionsProps {
  primaryOptions: string[];
  secondaryOptions: string[];
  correctPrimaryIndex: number;
  correctSecondaryIndex: number;
  onPrimaryOptionChange: (index: number, value: string) => void;
  onSecondaryOptionChange: (index: number, value: string) => void;
  onCorrectPrimaryChange: (index: number) => void;
  onCorrectSecondaryChange: (index: number) => void;
}

export const DualChoiceOptions = ({
  primaryOptions,
  secondaryOptions,
  correctPrimaryIndex,
  correctSecondaryIndex,
  onPrimaryOptionChange,
  onSecondaryOptionChange,
  onCorrectPrimaryChange,
  onCorrectSecondaryChange
}: DualChoiceOptionsProps) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label className="text-base font-semibold">Primary Options</Label>
        <div className="space-y-3">
          {primaryOptions.map((option, index) => (
            <div key={index} className="flex items-center gap-3">
              <RadioGroup 
                value={String(correctPrimaryIndex)} 
                onValueChange={(value) => onCorrectPrimaryChange(parseInt(value))}
                className="flex items-center"
              >
                <RadioGroupItem value={String(index)} id={`primary-${index}`} />
              </RadioGroup>
              <Input
                value={option}
                onChange={(e) => onPrimaryOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">Secondary Options</Label>
        <div className="space-y-3">
          {secondaryOptions.map((option, index) => (
            <div key={index} className="flex items-center gap-3">
              <RadioGroup 
                value={String(correctSecondaryIndex)} 
                onValueChange={(value) => onCorrectSecondaryChange(parseInt(value))}
                className="flex items-center"
              >
                <RadioGroupItem value={String(index)} id={`secondary-${index}`} />
              </RadioGroup>
              <Input
                value={option}
                onChange={(e) => onSecondaryOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-1"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
