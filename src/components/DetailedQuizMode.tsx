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
    choice: { count: 5, score: 5 },
    open: { count: 3, score: 10 }
  });
  
  const [difficultyDistribution, setDifficultyDistribution] = useState({
    easy: 40,
    medium: 40,
    hard: 20
  });
  
  const [settings, setSettings] = useState({
    totalScore: 100,
    duration: 90,
    useIndividualScores: false
  });

  // 计算总分值
  const calculateTotalScore = () => {
    if (settings.useIndividualScores) {
      return questionTypes.choice.count * questionTypes.choice.score + 
             questionTypes.open.count * questionTypes.open.score;
    }
    return settings.totalScore;
  };

  const handleGenerate = () => {
    const config = {
      scenarioName: "精细化测验",
      knowledgePoints: selectedKnowledgePoints,
      questionTypes,
      difficultyDistribution,
      settings: {
        ...settings,
        totalScore: calculateTotalScore()
      }
    };
    onGenerate(config);
  };

  const isConfigValid = () => {
    return selectedKnowledgePoints.length > 0 && 
           (questionTypes.choice.count > 0 || questionTypes.open.count > 0);
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

          {/* 难度分布 */}
          <Card>
            <CardHeader>
              <CardTitle>难度分布</CardTitle>
            </CardHeader>
            <CardContent>
              <DifficultyDistribution
                distribution={difficultyDistribution}
                onChange={setDifficultyDistribution}
              />
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
                {/* 单题分值开关 */}
                <div className="flex items-center justify-between">
                  <Label>单题分值设置</Label>
                  <Switch
                    checked={settings.useIndividualScores}
                    onCheckedChange={(checked) => setSettings({...settings, useIndividualScores: checked})}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>选择题</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        value={questionTypes.choice.count}
                        onChange={(e) => setQuestionTypes({
                          ...questionTypes, 
                          choice: { ...questionTypes.choice, count: parseInt(e.target.value) || 0 }
                        })}
                        className="w-20 text-center"
                      />
                      <span className="text-sm text-muted-foreground">道</span>
                      {settings.useIndividualScores && (
                        <>
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            value={questionTypes.choice.score}
                            onChange={(e) => setQuestionTypes({
                              ...questionTypes, 
                              choice: { ...questionTypes.choice, score: parseInt(e.target.value) || 0 }
                            })}
                            className="w-20 text-center"
                          />
                          <span className="text-sm text-muted-foreground">分/题</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>开放题</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        value={questionTypes.open.count}
                        onChange={(e) => setQuestionTypes({
                          ...questionTypes, 
                          open: { ...questionTypes.open, count: parseInt(e.target.value) || 0 }
                        })}
                        className="w-20 text-center"
                      />
                      <span className="text-sm text-muted-foreground">道</span>
                      {settings.useIndividualScores && (
                        <>
                          <Input
                            type="number"
                            min="0"
                            max="20"
                            value={questionTypes.open.score}
                            onChange={(e) => setQuestionTypes({
                              ...questionTypes, 
                              open: { ...questionTypes.open, score: parseInt(e.target.value) || 0 }
                            })}
                            className="w-20 text-center"
                          />
                          <span className="text-sm text-muted-foreground">分/题</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* 题目总数显示 */}
                <div className="pt-2 border-t">
                  <div className="text-sm text-muted-foreground">
                    题目总数：{questionTypes.choice.count + questionTypes.open.count} 道
                  </div>
                  {settings.useIndividualScores && (
                    <div className="text-sm text-muted-foreground">
                      计算总分：{calculateTotalScore()} 分
                    </div>
                  )}
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
                     value={settings.useIndividualScores ? calculateTotalScore() : settings.totalScore}
                     onChange={(e) => setSettings({...settings, totalScore: parseInt(e.target.value) || 0})}
                     placeholder="100"
                     disabled={settings.useIndividualScores}
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
