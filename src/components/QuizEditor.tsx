import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  RefreshCw, 
  Save, 
  GripVertical,
  Plus,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Question {
  id: number;
  type: string;
  title: string;
  options?: string[];
  correctAnswer?: number | string;
  answer?: string;
  explanation: string;
  score: number;
  knowledgePoint: string;
}

interface QuizEditorProps {
  questions: Question[];
  config: any;
  onBack: () => void;
  onSave: (quizName: string, questions: Question[]) => void;
}

const QuizEditor = ({ questions: initialQuestions, config, onBack, onSave }: QuizEditorProps) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [quizName, setQuizName] = useState(() => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    const scenarioName = config.scenarioName || "测验";
    const studentName = config.studentName || "学生";
    return `${studentName} ${scenarioName} ${dateStr}`;
  });

  const questionTypeLabels = {
    single_choice: '单选题',
    multiple_choice: '多选题',
    fill_blank: '填空题',
    short_answer: '简答题',
    calculation: '计算题'
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion({ ...question });
  };

  const handleSaveEdit = () => {
    if (editingQuestion) {
      setQuestions(prev => prev.map(q => 
        q.id === editingQuestion.id ? editingQuestion : q
      ));
      setEditingQuestion(null);
    }
  };

  const handleDeleteQuestion = (questionId: number) => {
    setQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const handleReplaceQuestion = (questionId: number) => {
    // Simulate replacing with a new question of the same type
    const questionToReplace = questions.find(q => q.id === questionId);
    if (questionToReplace) {
      const newQuestion: Question = {
        ...questionToReplace,
        id: Date.now(), // Generate new ID
        title: `新的${questionTypeLabels[questionToReplace.type as keyof typeof questionTypeLabels]}题目`,
        explanation: "新生成的题目解析"
      };
      setQuestions(prev => prev.map(q => 
        q.id === questionId ? newQuestion : q
      ));
    }
  };

  const handleReorderQuestion = (fromIndex: number, toIndex: number) => {
    const newQuestions = [...questions];
    const [movedQuestion] = newQuestions.splice(fromIndex, 1);
    newQuestions.splice(toIndex, 0, movedQuestion);
    setQuestions(newQuestions);
  };

  const handleRegenerateAll = () => {
    // Simulate regenerating all questions
    const newQuestions = questions.map((q, index) => ({
      ...q,
      id: Date.now() + index,
      title: `重新生成的${questionTypeLabels[q.type as keyof typeof questionTypeLabels]}题目 ${index + 1}`,
      explanation: "重新生成的题目解析"
    }));
    setQuestions(newQuestions);
  };

  const getTotalScore = () => {
    return questions.reduce((sum, q) => sum + q.score, 0);
  };

  const renderQuestionEdit = () => {
    if (!editingQuestion) return null;

    return (
      <Dialog open={!!editingQuestion} onOpenChange={() => setEditingQuestion(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>编辑题目</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>题目类型</Label>
              <Input value={questionTypeLabels[editingQuestion.type as keyof typeof questionTypeLabels]} disabled />
            </div>
            
            <div>
              <Label>题干</Label>
              <Textarea
                value={editingQuestion.title}
                onChange={(e) => setEditingQuestion(prev => prev ? {...prev, title: e.target.value} : null)}
                rows={3}
              />
            </div>

            {editingQuestion.options && (
              <div>
                <Label>选项</Label>
                <div className="space-y-2">
                  {editingQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="w-6 text-sm">{String.fromCharCode(65 + index)}.</span>
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...editingQuestion.options!];
                          newOptions[index] = e.target.value;
                          setEditingQuestion(prev => prev ? {...prev, options: newOptions} : null);
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <Label>正确答案</Label>
                  <Input
                    type="number"
                    min="0"
                    max={editingQuestion.options.length - 1}
                    value={editingQuestion.correctAnswer as number}
                    onChange={(e) => setEditingQuestion(prev => prev ? {...prev, correctAnswer: parseInt(e.target.value)} : null)}
                  />
                </div>
              </div>
            )}

            {editingQuestion.answer && (
              <div>
                <Label>参考答案</Label>
                <Textarea
                  value={editingQuestion.answer}
                  onChange={(e) => setEditingQuestion(prev => prev ? {...prev, answer: e.target.value} : null)}
                  rows={3}
                />
              </div>
            )}

            <div>
              <Label>解析</Label>
              <Textarea
                value={editingQuestion.explanation}
                onChange={(e) => setEditingQuestion(prev => prev ? {...prev, explanation: e.target.value} : null)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>分值</Label>
                <Input
                  type="number"
                  min="1"
                  value={editingQuestion.score}
                  onChange={(e) => setEditingQuestion(prev => prev ? {...prev, score: parseInt(e.target.value) || 1} : null)}
                />
              </div>
              <div>
                <Label>知识点</Label>
                <Input
                  value={editingQuestion.knowledgePoint}
                  onChange={(e) => setEditingQuestion(prev => prev ? {...prev, knowledgePoint: e.target.value} : null)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setEditingQuestion(null)}>
                取消
              </Button>
              <Button onClick={handleSaveEdit}>
                保存修改
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const renderSaveDialog = () => (
    <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>保存试卷</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>试卷名称</Label>
            <Input
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              placeholder="请输入试卷名称"
            />
          </div>
          <div className="text-sm text-muted-foreground">
            <p>试卷信息：</p>
            <p>• 总题数：{questions.length}题</p>
            <p>• 总分值：{getTotalScore()}分</p>
            <p>• 题型分布：{Object.entries(
              questions.reduce((acc, q) => {
                acc[q.type] = (acc[q.type] || 0) + 1;
                return acc;
              }, {} as Record<string, number>)
            ).map(([type, count]) => `${questionTypeLabels[type as keyof typeof questionTypeLabels]} ${count}题`).join('、')}</p>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              取消
            </Button>
            <Button onClick={() => onSave(quizName, questions)}>
              确认保存
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            返回
          </Button>
          <div>
            <h3 className="text-lg font-semibold">试卷预览与编辑</h3>
            <p className="text-sm text-muted-foreground">
              共{questions.length}题 | 总分{getTotalScore()}分
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRegenerateAll} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            重新生成
          </Button>
          <Button onClick={() => setShowSaveDialog(true)} className="gap-2">
            <Save className="w-4 h-4" />
            保存试卷
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <Card key={question.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GripVertical className="w-4 h-4 cursor-move" />
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                      {questionTypeLabels[question.type as keyof typeof questionTypeLabels]}
                    </span>
                    <span>{question.score}分</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEditQuestion(question)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleReplaceQuestion(question.id)}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteQuestion(question.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium">{index + 1}. {question.title}</p>
                </div>
                
                {question.options && (
                  <div className="ml-4 space-y-1">
                    {question.options.map((option, optIndex) => (
                      <div key={optIndex} className={cn(
                        "text-sm",
                        question.correctAnswer === optIndex && "text-green-600 font-medium"
                      )}>
                        {String.fromCharCode(65 + optIndex)}. {option}
                      </div>
                    ))}
                  </div>
                )}

                {question.answer && (
                  <div className="ml-4">
                    <p className="text-sm"><span className="font-medium">参考答案：</span>{question.answer}</p>
                  </div>
                )}

                <div className="text-xs text-muted-foreground border-t pt-2">
                  <p><span className="font-medium">解析：</span>{question.explanation}</p>
                  <p><span className="font-medium">知识点：</span>{question.knowledgePoint}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {renderQuestionEdit()}
      {renderSaveDialog()}
    </div>
  );
};

export default QuizEditor;