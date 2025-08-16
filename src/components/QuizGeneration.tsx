import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Clock, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuizGenerationProps {
  config: any;
  onBack: () => void;
  onComplete: (questions: any[]) => void;
}

interface GenerationStep {
  id: string;
  title: string;
  description: string;
  duration: number;
}

const generationSteps: GenerationStep[] = [
  {
    id: "analyzing",
    title: "正在分析条件",
    description: "分析出题配置和知识点要求",
    duration: 2000
  },
  {
    id: "matching",
    title: "正在匹配题库",
    description: "根据条件匹配合适的题目",
    duration: 3000
  },
  {
    id: "generating",
    title: "正在获取题目",
    description: "生成完整的试卷内容",
    duration: 5000
  }
];

const QuizGeneration = ({ config, onBack, onComplete }: QuizGenerationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [generatedContent, setGeneratedContent] = useState("");
  const [isTypewriting, setIsTypewriting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Calculate estimated time based on config complexity
    const baseTime = 10; // seconds
    const questionCount = config.totalQuestions || 10;
    const complexityMultiplier = questionCount > 20 ? 1.5 : questionCount > 10 ? 1.2 : 1;
    setEstimatedTime(Math.ceil(baseTime * complexityMultiplier));
  }, [config]);

  useEffect(() => {
    if (currentStep < generationSteps.length && !isCompleted) {
      const step = generationSteps[currentStep];
      
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (step.duration / 100));
          if (newProgress >= 100) {
            clearInterval(interval);
            setCompletedSteps(prev => [...prev, step.id]);
            
            // For the last step, start typewriter effect after completion
            if (currentStep === generationSteps.length - 1) {
              setTimeout(() => {
                startTypewriterEffect();
              }, 500);
            } else {
              // Move to next step for non-last steps
              setTimeout(() => {
                setCurrentStep(prev => prev + 1);
                setProgress(0);
              }, 500);
            }
          }
          return Math.min(newProgress, 100);
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [currentStep, isCompleted]);

  const startTypewriterEffect = () => {
    setIsTypewriting(true);
    const content = `
1. 下列哪个选项正确描述了函数的定义？
A. 函数是一个包含变量的表达式
B. 函数是输入和输出之间的对应关系
C. 函数只能包含数字
D. 函数必须是线性的

2. 计算题：求函数 f(x) = 2x + 3 在 x = 5 时的值。

3. 简答题：请解释什么是函数的单调性，并举例说明。
    `;

    let index = 0;
    const typeInterval = setInterval(() => {
      if (index < content.length) {
        setGeneratedContent(content.substring(0, index + 1));
        // Update progress based on typewriter progress
        const typeProgress = (index / content.length) * 100;
        setProgress(typeProgress);
        index++;
      } else {
        clearInterval(typeInterval);
        // Mark step as completed and finish
        setCompletedSteps(prev => [...prev, generationSteps[generationSteps.length - 1].id]);
        setProgress(100);
        setIsCompleted(true);
        
        setTimeout(() => {
          // Generate mock questions and complete
          const mockQuestions = generateMockQuestions(config);
          onComplete(mockQuestions);
        }, 1000);
      }
    }, 50);
  };

  const generateMockQuestions = (config: any) => {
    // Generate mock questions based on config
    return [
      {
        id: 1,
        type: "single_choice",
        title: "下列哪个选项正确描述了函数的定义？",
        options: [
          "函数是一个包含变量的表达式",
          "函数是输入和输出之间的对应关系",
          "函数只能包含数字",
          "函数必须是线性的"
        ],
        correctAnswer: 1,
        explanation: "函数是定义在某个数集上的单值对应关系，即每个输入值对应唯一的输出值。",
        score: 5,
        knowledgePoint: "函数基本概念"
      },
      {
        id: 2,
        type: "calculation",
        title: "计算题：求函数 f(x) = 2x + 3 在 x = 5 时的值。",
        answer: "f(5) = 2×5 + 3 = 13",
        explanation: "将 x = 5 代入函数表达式：f(5) = 2×5 + 3 = 10 + 3 = 13",
        score: 8,
        knowledgePoint: "函数求值"
      },
      {
        id: 3,
        type: "short_answer",
        title: "简答题：请解释什么是函数的单调性，并举例说明。",
        answer: "函数的单调性是指函数在某个区间内函数值随自变量的变化趋势。单调递增：当x1<x2时，f(x1)≤f(x2)；单调递减：当x1<x2时，f(x1)≥f(x2)。例如：y=x在R上单调递增，y=-x在R上单调递减。",
        explanation: "单调性是函数的重要性质，反映函数值的变化规律。",
        score: 10,
        knowledgePoint: "函数性质"
      }
    ];
  };

  const overallProgress = currentStep === generationSteps.length - 1 && completedSteps.includes(generationSteps[currentStep].id) 
    ? 100 
    : ((currentStep + progress / 100) / generationSteps.length) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          返回
        </Button>
        <div>
          <h3 className="text-lg font-semibold">正在生成试卷</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            预计完成时间：{estimatedTime}秒
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Overall Progress with 3 Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">生成进度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                {generationSteps.map((step, index) => (
                  <div key={step.id} className="flex flex-col items-center flex-1">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors mb-2",
                      completedSteps.includes(step.id) 
                        ? "bg-primary border-primary text-primary-foreground"
                        : index === currentStep
                          ? "border-primary text-primary"
                          : "border-muted-foreground/30 text-muted-foreground"
                    )}>
                      {completedSteps.includes(step.id) ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <span className="text-sm font-medium">{index + 1}</span>
                      )}
                    </div>
                    <div className="text-xs text-center max-w-20">
                      <div className="font-medium truncate">{step.title}</div>
                    </div>
                    {index < generationSteps.length - 1 && (
                      <div className={cn(
                        "absolute h-0.5 w-20 mt-4 transition-colors",
                        completedSteps.includes(step.id) ? "bg-primary" : "bg-muted"
                      )} style={{ left: `${(index + 1) * 33.33}%`, transform: 'translateX(-50%)' }} />
                    )}
                  </div>
                ))}
              </div>
              <div className="relative">
                <Progress value={overallProgress} className="h-2" />
              </div>
              <div className="text-sm text-center text-muted-foreground">
                {Math.round(overallProgress)}% 完成
              </div>
              {currentStep < generationSteps.length && (
                <div className="text-xs text-center text-muted-foreground">
                  当前步骤: {generationSteps[currentStep]?.description}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Generated Content Preview - Show when step 3 starts or typewriting begins */}
        {(currentStep === generationSteps.length - 1 && isTypewriting) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">题目预览</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {generatedContent}
                  <span className="animate-pulse">|</span>
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuizGeneration;