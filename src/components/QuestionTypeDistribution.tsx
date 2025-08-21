import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface QuestionTypeDistributionProps {
  value: { choice: number; open: number };
  onChange: (value: { choice: number; open: number }) => void;
}

const QuestionTypeDistribution = ({ value, onChange }: QuestionTypeDistributionProps) => {
  const [choiceRatio, setChoiceRatio] = useState(value.choice);

  useEffect(() => {
    setChoiceRatio(value.choice);
  }, [value.choice]);

  const handleChoiceRatioChange = (newValue: number[]) => {
    const choice = newValue[0];
    const open = 100 - choice;
    setChoiceRatio(choice);
    onChange({ choice, open });
  };

  return (
    <div className="space-y-4">
      <Label>题型分布</Label>
      
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">选择题</span>
            <span className="text-sm text-muted-foreground">{choiceRatio}%</span>
          </div>
          <Slider
            value={[choiceRatio]}
            onValueChange={handleChoiceRatioChange}
            max={100}
            step={5}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">开放题</span>
            <span className="text-sm text-muted-foreground">{100 - choiceRatio}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full">
            <div 
              className="h-2 bg-primary rounded-full transition-all duration-300"
              style={{ width: `${100 - choiceRatio}%` }}
            />
          </div>
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        拖动滑块调整题型比例，两个题型比例会自动联动
      </div>
    </div>
  );
};

export default QuestionTypeDistribution;