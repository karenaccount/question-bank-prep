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
  const [questionTypes, setQuestionTypes] = useState<QuestionTypes>({
    single_choice: { enabled: true, count: 5, score: 2 },
    multiple_choice: { enabled: false, count: 3, score: 3 },
    fill_blank: { enabled: false, count: 5, score: 2 },
    short_answer: { enabled: true, count: 3, score: 5 },
    calculation: { enabled: false, count: 2, score: 8 }
  });
  
  const [sourceRatio, setSourceRatio] = useState({ xiaoban: 70, realExam: 30 });
  const [difficultyRatio, setDifficultyRatio] = useState({ basic: 40, ability: 40, comprehensive: 20 });
  const [totalScore, setTotalScore] = useState(100);
  const [duration, setDuration] = useState<number | null>(null);
  const [enableIndividualScoring, setEnableIndividualScoring] = useState(true);

  const questionTypeLabels = {
    single_choice: '单选题',
    multiple_choice: '多选题', 
    fill_blank: '填空题',
    short_answer: '简答题',
    calculation: '计算题'
  };

  const difficultyTypes = [
    { key: 'basic', name: '基础巩固（简单）', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'ability', name: '能力提升（中等）', icon: <Target className="w-4 h-4" /> },
    { key: 'comprehensive', name: '综合应用（困难）', icon: <Zap className="w-4 h-4" /> }
  ];

  const handleKnowledgePointToggle = (point: string) => {
    setSelectedKnowledgePoints(prev => 
      prev.includes(point) 
        ? prev.filter(p => p !== point)
        : [...prev, point]
    );
  };

  const handleQuestionTypeToggle = (type: keyof QuestionTypes) => {
    setQuestionTypes(prev => ({
      ...prev,
      [type]: { ...prev[type], enabled: !prev[type].enabled }
    }));
  };

  const handleQuestionTypeChange = (type: keyof QuestionTypes, field: 'count' | 'score', value: number) => {
    setQuestionTypes(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }));
  };

  const getTotalQuestions = () => {
    return Object.values(questionTypes)
      .filter(type => type.enabled)
      .reduce((sum, type) => sum + type.count, 0);
  };

  const getCalculatedTotalScore = () => {
    return Object.values(questionTypes)
      .filter(type => type.enabled)
      .reduce((sum, type) => sum + (type.count * type.score), 0);
  };

  const handleDifficultyChange = (key: 'basic' | 'ability' | 'comprehensive', value: number) => {
    const remaining = 100 - value;
    const otherKeys = (['basic', 'ability', 'comprehensive'] as const).filter(k => k !== key);
    const [first, second] = otherKeys;
    
    // Keep the first other key unchanged, adjust the second
    const firstValue = difficultyRatio[first];
    const secondValue = remaining - firstValue;
    
    setDifficultyRatio({
      ...difficultyRatio,
      [key]: value,
      [second]: Math.max(0, secondValue)
    });
  };

  const getSelectedDifficultyTypes = () => {
    return Object.entries(difficultyRatio)
      .filter(([_, value]) => value > 0)
      .map(([key, _]) => key);
  };

  const handleGenerate = () => {
    const config = {
      knowledgePoints: selectedKnowledgePoints,
      questionTypes: Object.fromEntries(
        Object.entries(questionTypes).filter(([_, config]) => config.enabled)
      ),
      sourceRatio,
      difficultyRatio,
      totalScore: enableIndividualScoring ? getCalculatedTotalScore() : totalScore,
      duration,
      enableIndividualScoring,
      selectedDifficultyTypes: getSelectedDifficultyTypes(),
      totalQuestions: getTotalQuestions(),
      calculatedScore: getCalculatedTotalScore()
    };
    onGenerate(config);
  };

  const isConfigValid = () => {
    return selectedKnowledgePoints.length > 0 && 
           Object.values(questionTypes).some(type => type.enabled) &&
           getSelectedDifficultyTypes().length > 0;
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左列 */}
        <div className="space-y-6">
          {/* 知识点选择 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">选择知识点</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.knowledgePoints.map((point) => (
                  <label key={point} className="flex items-center gap-3 cursor-pointer">
                    <Checkbox
                      checked={selectedKnowledgePoints.includes(point)}
                      onCheckedChange={() => handleKnowledgePointToggle(point)}
                    />
                    <span className="text-sm">{point}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 题型配置 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">题型配置</CardTitle>
                <div className="flex items-center gap-2">
                  <Label className="text-xs">启用单题分值</Label>
                  <Switch
                    checked={enableIndividualScoring}
                    onCheckedChange={setEnableIndividualScoring}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(questionTypes).map(([type, config]) => (
                  <div key={type} className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={config.enabled}
                        onCheckedChange={() => handleQuestionTypeToggle(type as keyof QuestionTypes)}
                      />
                      <span className="text-sm font-medium">
                        {questionTypeLabels[type as keyof typeof questionTypeLabels]}
                      </span>
                    </label>
                    
                    {config.enabled && (
                      <div className={`ml-6 grid ${enableIndividualScoring ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
                        <div>
                          <Label className="text-xs">题目数量</Label>
                          <Input
                            type="number"
                            min="1"
                            value={config.count}
                            onChange={(e) => handleQuestionTypeChange(
                              type as keyof QuestionTypes, 
                              'count', 
                              parseInt(e.target.value) || 0
                            )}
                            className="h-8"
                          />
                        </div>
                        {enableIndividualScoring && (
                          <div>
                            <Label className="text-xs">单题分值</Label>
                            <Input
                              type="number"
                              min="1"
                              value={config.score}
                              onChange={(e) => handleQuestionTypeChange(
                                type as keyof QuestionTypes, 
                                'score', 
                                parseInt(e.target.value) || 0
                              )}
                              className="h-8"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="pt-2 border-t text-sm text-muted-foreground">
                  总题数：{getTotalQuestions()}题
                  {enableIndividualScoring && ` | 计算总分：${getCalculatedTotalScore()}分`}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 考察类型与难度分布 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">考察类型与难度分布</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {difficultyTypes.map((type) => (
                <div key={type.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {type.icon}
                      <span className="text-sm font-medium">{type.name}</span>
                    </div>
                    <span className="text-sm">{difficultyRatio[type.key as keyof typeof difficultyRatio]}%</span>
                  </div>
                  <Slider
                    value={[difficultyRatio[type.key as keyof typeof difficultyRatio]]}
                    onValueChange={([value]) => handleDifficultyChange(type.key as 'basic' | 'ability' | 'comprehensive', value)}
                    max={100}
                    step={5}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 右列 */}
        <div className="space-y-6">
          {/* 题目来源配置 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">题目来源配置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>小班题库</span>
                  <span>{sourceRatio.xiaoban}%</span>
                </div>
                <Slider
                  value={[sourceRatio.xiaoban]}
                  onValueChange={([value]) => setSourceRatio({ xiaoban: value, realExam: 100 - value })}
                  max={100}
                  step={10}
                />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>真题</span>
                  <span>{sourceRatio.realExam}%</span>
                </div>
                <Slider
                  value={[sourceRatio.realExam]}
                  onValueChange={([value]) => setSourceRatio({ xiaoban: 100 - value, realExam: value })}
                  max={100}
                  step={10}
                />
              </div>
            </CardContent>
          </Card>

          {/* 分值和时长设置 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">分值和时长设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>总分</Label>
                <Input
                  type="number"
                  value={enableIndividualScoring ? getCalculatedTotalScore() : totalScore}
                  onChange={(e) => setTotalScore(parseInt(e.target.value) || 100)}
                  disabled={enableIndividualScoring}
                  className="mt-1"
                />
                {enableIndividualScoring && (
                  <p className="text-xs text-muted-foreground mt-1">
                    启用单题分值时，总分自动计算
                  </p>
                )}
              </div>
              <div>
                <Label>考试时长（分钟，选填）</Label>
                <Input
                  type="number"
                  placeholder="不设置时长限制"
                  value={duration || ''}
                  onChange={(e) => setDuration(e.target.value ? parseInt(e.target.value) : null)}
                  className="mt-1"
                />
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
