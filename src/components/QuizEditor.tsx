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
  Eye,
  EyeOff,
  Copy,
  Check
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
  // Generate 5 preset questions based on question types
  const generatePresetQuestions = (baseQuestions: Question[]): Question[] => {
    const presetQuestions: Question[] = [
      {
        id: 1,
        type: 'single_choice',
        title: '以下哪个是React的核心概念？',
        options: ['组件化', '面向对象', '函数式编程', '模块化'],
        correctAnswer: 0,
        explanation: 'React的核心概念是组件化，通过组件的方式构建用户界面。',
        score: 5,
        knowledgePoint: 'React基础概念'
      },
      {
        id: 2,
        type: 'single_choice',
        title: 'JavaScript中用于声明变量的关键字有哪些？',
        options: ['var, let, const', 'int, float, string', 'public, private', 'class, function'],
        correctAnswer: 0,
        explanation: 'JavaScript中用于声明变量的关键字包括var、let和const。',
        score: 5,
        knowledgePoint: 'JavaScript语法'
      },
      {
        id: 3,
        type: 'short_answer',
        title: '请简述HTTP和HTTPS的主要区别。',
        answer: 'HTTP是超文本传输协议，传输数据是明文的，不安全；HTTPS是在HTTP基础上加入了SSL/TLS加密，传输数据经过加密，更安全。HTTPS默认使用443端口，而HTTP使用80端口。',
        explanation: '主要区别在于安全性：HTTPS通过SSL/TLS加密保护数据传输，而HTTP是明文传输。',
        score: 10,
        knowledgePoint: '网络协议'
      },
      {
        id: 4,
        type: 'single_choice',
        title: '在数据库设计中，主键的作用是什么？',
        options: ['唯一标识表中的每一行', '提高查询速度', '节省存储空间', '简化操作'],
        correctAnswer: 0,
        explanation: '主键的主要作用是唯一标识表中的每一行数据，确保数据的唯一性。',
        score: 5,
        knowledgePoint: '数据库设计'
      },
      {
        id: 5,
        type: 'short_answer',
        title: '解释什么是MVC架构模式，并说明其优点。',
        answer: 'MVC（Model-View-Controller）是一种软件架构模式，将应用程序分为三个组件：模型（Model）负责数据和业务逻辑，视图（View）负责用户界面，控制器（Controller）负责处理用户输入和协调模型与视图。优点包括：代码组织清晰、职责分离、易于维护和测试、支持并行开发。',
        explanation: 'MVC模式通过分离关注点提高代码的可维护性和可扩展性。',
        score: 15,
        knowledgePoint: '软件架构'
      }
    ];
    
    // If no initial questions provided, return preset questions
    if (baseQuestions.length === 0) {
      return presetQuestions;
    }
    
    return baseQuestions;
  };

  const [questions, setQuestions] = useState<Question[]>(() => generatePresetQuestions(initialQuestions));
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [hideAnswers, setHideAnswers] = useState(false);
  const [copiedQuestionId, setCopiedQuestionId] = useState<number | null>(null);
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

  // Drag and drop handlers
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const getTotalScore = () => {
    return questions.reduce((sum, q) => sum + q.score, 0);
  };

  const handleCopyQuestion = async (question: Question, index: number) => {
    let copyText = `${index + 1}. ${question.title}\n\n`;
    
    if (question.options) {
      question.options.forEach((option, optIndex) => {
        copyText += `${String.fromCharCode(65 + optIndex)}. ${option}\n`;
      });
      copyText += '\n';
    }
    
    if (question.answer && !hideAnswers) {
      copyText += `参考答案：${question.answer}\n\n`;
    }
    
    if (!hideAnswers) {
      copyText += `解析：${question.explanation}\n`;
      copyText += `知识点：${question.knowledgePoint}\n`;
      copyText += `分值：${question.score}分`;
    }

    try {
      await navigator.clipboard.writeText(copyText);
      setCopiedQuestionId(question.id);
      setTimeout(() => setCopiedQuestionId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Sortable Question Item Component
  const SortableQuestionItem = ({ question, index }: { question: Question; index: number }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: question.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <Card 
        ref={setNodeRef} 
        style={style} 
        className={cn(
          "relative flex flex-col quiz-card",
          isDragging && "shadow-lg"
        )}
      >
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div
                {...attributes}
                {...listeners}
                className="cursor-move text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
              >
                <GripVertical className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                  {questionTypeLabels[question.type as keyof typeof questionTypeLabels]}
                </span>
                <span className="text-xs text-muted-foreground">{question.score}分</span>
              </div>
            </div>
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => handleCopyQuestion(question, index)}
                className="relative"
              >
                {copiedQuestionId === question.id ? (
                  <Check className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleEditQuestion(question)}>
                <Edit className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleReplaceQuestion(question.id)}>
                <RefreshCw className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDeleteQuestion(question.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 flex-1 flex flex-col">
          <div className="space-y-3 flex-1">
            <div>
              <p className="font-medium text-sm leading-tight">
                {index + 1}. {question.title}
              </p>
            </div>
            
            {question.options && (
              <div className="space-y-1 flex-1">
                {question.options.map((option, optIndex) => (
                  <div key={optIndex} className={cn(
                    "text-xs leading-tight",
                    !hideAnswers && question.correctAnswer === optIndex && "text-green-600 font-medium"
                  )}>
                    {String.fromCharCode(65 + optIndex)}. {option}
                  </div>
                ))}
              </div>
            )}

            {question.answer && !hideAnswers && (
              <div>
                <p className="text-xs leading-tight">
                  <span className="font-medium">参考答案：</span>{question.answer}
                </p>
              </div>
            )}
          </div>

          {!hideAnswers && (
            <div className="text-xs text-muted-foreground border-t pt-2 mt-3 space-y-1">
              <p>
                <span className="font-medium">解析：</span>{question.explanation}
              </p>
              <p>
                <span className="font-medium">知识点：</span>{question.knowledgePoint}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderQuestionEdit = () => {
    if (!editingQuestion) return null;

    return (
      <Dialog open={!!editingQuestion} onOpenChange={() => setEditingQuestion(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>编辑题目</DialogTitle>
          </DialogHeader>
          
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
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
                  <Select 
                    value={editingQuestion.correctAnswer?.toString()} 
                    onValueChange={(value) => setEditingQuestion(prev => prev ? {...prev, correctAnswer: parseInt(value)} : null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择正确答案" />
                    </SelectTrigger>
                    <SelectContent>
                      {editingQuestion.options.map((option, index) => (
                        <SelectItem key={index} value={index.toString()}>
                          {String.fromCharCode(65 + index)}. {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
          </div>

          {/* Fixed bottom buttons */}
          <div className="border-t pt-4 mt-4 flex justify-end gap-2 bg-background">
            <Button variant="outline" onClick={() => setEditingQuestion(null)}>
              取消
            </Button>
            <Button onClick={handleSaveEdit}>
              保存修改
            </Button>
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
    <div className="container mx-auto px-4 pb-20">
      {/* Fixed Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 py-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              返回
            </Button>
            <div>
              <h3 className="text-lg font-semibold">试卷预览与编辑</h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>共{questions.length}题 | 总分{getTotalScore()}分</p>
                {config?.questionTypes && (
                  <div className="flex gap-4">
                    {config.questionTypes.choice && config.questionTypes.choice.count > 0 && (
                      <span>选择题: {config.questionTypes.choice.count}题
                        {config?.settings?.useIndividualScores && ` (${config.questionTypes.choice.score}分/题)`}
                      </span>
                    )}
                    {config.questionTypes.open && config.questionTypes.open.count > 0 && (
                      <span>开放题: {config.questionTypes.open.count}题
                        {config?.settings?.useIndividualScores && ` (${config.questionTypes.open.score}分/题)`}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setHideAnswers(!hideAnswers)}
            className="gap-2"
          >
            {hideAnswers ? (
              <>
                <Eye className="w-4 h-4" />
                展开所有答案
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                隐藏所有答案
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Questions List */}
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
          <SortableContext 
            items={questions.map(q => q.id)} 
            strategy={rectSortingStrategy}
          >
            <div className="quiz-grid">
              {questions.map((question, index) => (
                <SortableQuestionItem 
                  key={question.id} 
                  question={question} 
                  index={index} 
                />
              ))}
            </div>
          </SortableContext>
      </DndContext>

      {/* Fixed Action Buttons */}
      <div className="fixed bottom-4 right-4 flex gap-2">
        <Button variant="outline" onClick={handleRegenerateAll} className="gap-2 shadow-lg">
          <RefreshCw className="w-4 h-4" />
          重新生成
        </Button>
        <Button onClick={() => setShowSaveDialog(true)} className="gap-2 shadow-lg">
          <Save className="w-4 h-4" />
          保存试卷
        </Button>
      </div>

      {renderQuestionEdit()}
      {renderSaveDialog()}
    </div>
  );
};

export default QuizEditor;