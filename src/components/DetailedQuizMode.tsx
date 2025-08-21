import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Settings, BookOpen, Target, Zap } from "lucide-react";
import { Order } from "@/data/mockOrders";
import KnowledgePointSelector from "./KnowledgePointSelector";
import DifficultyDistribution from "./DifficultyDistribution";

interface DetailedQuizModeProps {
  order: Order;
  onBack: () => void;
  onGenerate: (config: any) => void;
}

interface QuestionTypeConfig {
  enabled: boolean;
  count: number;
  score: number;
}

interface QuestionTypes {
  single_choice: QuestionTypeConfig;
  multiple_choice: QuestionTypeConfig;
  fill_blank: QuestionTypeConfig;
  short_answer: QuestionTypeConfig;
  calculation: QuestionTypeConfig;
}

const DetailedQuizMode = ({ order, onBack, onGenerate }: DetailedQuizModeProps) => {
  const [selectedKnowledgePoints, setSelectedKnowledgePoints] = useState<string[]>([]);
  const [questionTypes, setQuestionTypes] = useState({
    choice: 5,
    open: 3
  });
  
  const [examTypes, setExamTypes] = useState({
    understanding: 40,
    application: 40,
    synthesis: 20
  });
  
  const [difficultyDistribution, setDifficultyDistribution] = useState({
    easy: 40,
    medium: 40,
    hard: 20
  });
  
  const [settings, setSettings] = useState({
    totalScore: 100,
    duration: 90
  });

  const handleGenerate = () => {
    const config = {
      scenarioName: "精细化测验",
      knowledgePoints: selectedKnowledgePoints,
      questionTypes,
      examTypes,
      difficultyDistribution,
      settings
    };
    onGenerate(config);
  };

  const isConfigValid = () => {
    return selectedKnowledgePoints.length > 0 && 
           (questionTypes.choice > 0 || questionTypes.open > 0);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          返回
        </Button>
        <div>
          <h3 className="text-lg font-semibold">精细化出题模式</h3>
          <p className="text-sm text-muted-foreground">订单：{order.name} - {order.student}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 左列 */}
        <div className="space-y-6">
          {/* 选择知识点 */}
          <Card>
            <CardHeader>
              <CardTitle>选择知识点</CardTitle>
            </CardHeader>
            <CardContent>
              <KnowledgePointSelector
                order={order}
                selectedPoints={selectedKnowledgePoints}
                onChange={setSelectedKnowledgePoints}
              />
            </CardContent>
          </Card>

          {/* 考察类型与难度分布 */}
          <Card>
            <CardHeader>
              <CardTitle>考察类型与难度分布</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium mb-4">考察类型</p>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span>理解记忆</span>
                      <div className="flex items-center gap-2 w-32">
                        <Slider
                          value={[examTypes.understanding]}
                          onValueChange={(value) => setExamTypes({...examTypes, understanding: value[0]})}
                          max={100}
                          step={5}
                        />
                        <span className="text-sm text-muted-foreground w-10">{examTypes.understanding}%</span>
                      </div>
                    </label>
                    <label className="flex items-center justify-between">
                      <span>应用分析</span>
                      <div className="flex items-center gap-2 w-32">
                        <Slider
                          value={[examTypes.application]}
                          onValueChange={(value) => setExamTypes({...examTypes, application: value[0]})}
                          max={100}
                          step={5}
                        />
                        <span className="text-sm text-muted-foreground w-10">{examTypes.application}%</span>
                      </div>
                    </label>
                    <label className="flex items-center justify-between">
                      <span>综合创新</span>
                      <div className="flex items-center gap-2 w-32">
                        <Slider
                          value={[examTypes.synthesis]}
                          onValueChange={(value) => setExamTypes({...examTypes, synthesis: value[0]})}
                          max={100}
                          step={5}
                        />
                        <span className="text-sm text-muted-foreground w-10">{examTypes.synthesis}%</span>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-4">难度分布</p>
                  <DifficultyDistribution
                    distribution={difficultyDistribution}
                    onChange={setDifficultyDistribution}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右列 */}
        <div className="space-y-6">
          {/* 题型配置 */}
          <Card>
            <CardHeader>
              <CardTitle>题型配置</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="flex items-center justify-between">
                    <span>选择题</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        value={questionTypes.choice}
                        onChange={(e) => setQuestionTypes({...questionTypes, choice: parseInt(e.target.value) || 0})}
                        className="w-20 text-center"
                      />
                      <span className="text-sm text-muted-foreground">道</span>
                    </div>
                  </label>
                  <label className="flex items-center justify-between">
                    <span>开放题</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        value={questionTypes.open}
                        onChange={(e) => setQuestionTypes({...questionTypes, open: parseInt(e.target.value) || 0})}
                        className="w-20 text-center"
                      />
                      <span className="text-sm text-muted-foreground">道</span>
                    </div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 分值和时长设置 */}
          <Card>
            <CardHeader>
              <CardTitle>分值和时长设置</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label>总分值</Label>
                  <Input
                    type="number"
                    min="0"
                    max="200"
                    value={settings.totalScore}
                    onChange={(e) => setSettings({...settings, totalScore: parseInt(e.target.value) || 0})}
                    placeholder="100"
                  />
                </div>
                <div className="space-y-2">
                  <Label>考试时长（分钟）</Label>
                  <Input
                    type="number"
                    min="0"
                    max="300"
                    value={settings.duration}
                    onChange={(e) => setSettings({...settings, duration: parseInt(e.target.value) || 0})}
                    placeholder="90"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 底部操作按钮 */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button variant="outline" onClick={onBack}>
          取消
        </Button>
        <Button 
          onClick={handleGenerate}
          disabled={!isConfigValid()}
          className="gap-2"
        >
          <Settings className="w-4 h-4" />
          生成试卷
        </Button>
      </div>
    </div>
  );
};

export default DetailedQuizMode;
