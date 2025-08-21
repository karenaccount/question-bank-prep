import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Clock, Target, BookOpen, GraduationCap, FileText } from "lucide-react";
import { Order } from "@/data/mockOrders";
import { quizScenarios, QuizScenario } from "@/data/quizScenarios";
import KnowledgePointSelector from "./KnowledgePointSelector";
import QuestionTypeDistribution from "./QuestionTypeDistribution";

interface FastQuizModeProps {
  order: Order;
  onBack: () => void;
  onGenerate: (config: any) => void;
}

const FastQuizMode = ({ order, onBack, onGenerate }: FastQuizModeProps) => {
  const [selectedScenario, setSelectedScenario] = useState<QuizScenario | null>(null);
  const [config, setConfig] = useState<any>({});

  const getScenarioIcon = (scenarioId: string) => {
    switch (scenarioId) {
      case 'pretest': return <Target className="w-6 h-6" />;
      case 'class_quiz': return <Clock className="w-6 h-6" />;
      case 'homework': return <BookOpen className="w-6 h-6" />;
      case 'stage_test': return <FileText className="w-6 h-6" />;
      case 'mock_exam': return <GraduationCap className="w-6 h-6" />;
      default: return <FileText className="w-6 h-6" />;
    }
  };

  const handleScenarioSelect = (scenario: QuizScenario) => {
    setSelectedScenario(scenario);
    setConfig({
      questionCount: scenario.questionCount.min,
      selectedKnowledgePoints: [],
      focusAreas: [],
      examDuration: 60,
      questionTypeDistribution: { choice: 60, open: 40 }
    });
  };

  const handleGenerate = () => {
    const generateConfig = {
      scenario: selectedScenario,
      scenarioName: selectedScenario?.name,
      questionCount: config.questionCount,
      configuration: config,
      totalQuestions: config.questionCount
    };
    onGenerate(generateConfig);
  };

  const renderScenarioConfig = () => {
    if (!selectedScenario) return null;

    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getScenarioIcon(selectedScenario.id)}
            {selectedScenario.name} 配置
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 题目数量 */}
          <div>
            <Label>题目数量</Label>
            <div className="flex items-center gap-4 mt-2">
              <Input
                type="number"
                min={selectedScenario.questionCount.min}
                max={selectedScenario.questionCount.max}
                value={config.questionCount}
                onChange={(e) => setConfig({...config, questionCount: parseInt(e.target.value)})}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">
                ({selectedScenario.questionCount.min}-{selectedScenario.questionCount.max}题)
              </span>
            </div>
          </div>

          {/* 选择知识点 */}
          <div>
            <Label>选择知识点</Label>
            <div className="mt-2">
              <KnowledgePointSelector
                order={order}
                selectedPoints={config.selectedKnowledgePoints || []}
                onChange={(points) => setConfig({...config, selectedKnowledgePoints: points})}
              />
            </div>
          </div>

          {/* 题型分布 - 所有场景都有 */}
          <QuestionTypeDistribution
            value={config.questionTypeDistribution || { choice: 60, open: 40 }}
            onChange={(distribution) => setConfig({...config, questionTypeDistribution: distribution})}
          />

          {/* 模拟考试的考试时长 */}
          {selectedScenario.id === 'mock_exam' && (
            <div>
              <Label>考试时长（分钟）</Label>
              <Input
                type="number"
                value={config.examDuration}
                onChange={(e) => setConfig({...config, examDuration: parseInt(e.target.value)})}
                className="w-32 mt-2"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button onClick={() => setSelectedScenario(null)} variant="outline">
              重新选择场景
            </Button>
            <Button onClick={handleGenerate} className="flex-1">
              开始生成试卷
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          返回
        </Button>
        <div>
          <h3 className="text-lg font-semibold">快速出题模式</h3>
          <p className="text-sm text-muted-foreground">订单：{order.name} - {order.student}</p>
        </div>
      </div>

      {!selectedScenario ? (
        <div>
          <h4 className="font-medium mb-4">选择出题场景</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizScenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className="cursor-pointer hover:shadow-md transition-shadow border-primary/20"
                onClick={() => handleScenarioSelect(scenario)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-primary">
                      {getScenarioIcon(scenario.id)}
                    </div>
                    <div>
                      <h5 className="font-medium">{scenario.name}</h5>
                      <p className="text-xs text-muted-foreground">{scenario.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {scenario.questionCount.min}-{scenario.questionCount.max}题
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {scenario.features.slice(0, 2).join('、')}
                      {scenario.features.length > 2 && '...'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        renderScenarioConfig()
      )}
    </div>
  );
};

export default FastQuizMode;