import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuiz } from "@/contexts/QuizContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft, 
  User, 
  Package, 
  BookOpen, 
  Calendar,
  GraduationCap,
  Eye,
  EyeOff,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  XCircle,
  Lightbulb
} from "lucide-react";
import QuizActions from "@/components/QuizActions";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

const QuizDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { quizzes } = useQuiz();
  
  const isFromFavorites = searchParams.get('from') === 'favorites';
  
  const quiz = quizzes.find(q => q.id === id);
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});
  const [activeQuestionId, setActiveQuestionId] = useState<string>('');

  // Function to scroll to specific question
  const scrollToQuestion = (questionIndex: number) => {
    const element = document.getElementById(`question-${questionIndex}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveQuestionId(`question-${questionIndex}`);
    }
  };

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">试卷未找到</h1>
            <Button onClick={() => navigate(-1)}>返回</Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusBadge = () => {
    if (quiz.isCompleted) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">已答题</Badge>;
    }
    if (quiz.studentScore !== undefined) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">答题中</Badge>;
    }
    return <Badge variant="outline">未答题</Badge>;
  };

  const canViewAnswers = () => {
    if (user?.role === 'teacher') return true;
    return quiz.isCompleted;
  };

  const toggleQuestionExpanded = (questionId: string) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const toggleAllAnswers = () => {
    setShowAllAnswers(!showAllAnswers);
    if (!showAllAnswers) {
      // Expand all questions
      const allExpanded: Record<string, boolean> = {};
      quiz.questions.forEach((_, index) => {
        allExpanded[index.toString()] = true;
      });
      setExpandedQuestions(allExpanded);
    } else {
      // Collapse all questions
      setExpandedQuestions({});
    }
  };

  const isAnswerCorrect = (question: any) => {
    return question.studentAnswer === question.correctAnswer;
  };

  const getCompletionDuration = () => {
    if (!quiz.completedAt || !quiz.createdAt) return "未完成";
    const duration = quiz.completedAt.getTime() - quiz.createdAt.getTime();
    const minutes = Math.floor(duration / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours > 0) {
      return `${hours}小时${remainingMinutes}分钟`;
    }
    return `${minutes}分钟`;
  };

  const getKnowledgePointStats = () => {
    if (!quiz.isCompleted) return [];
    
    const knowledgeStats: Record<string, { total: number; correct: number }> = {};
    
    quiz.questions.forEach((question: any) => {
      const kp = question.knowledgePoint || "其他";
      if (!knowledgeStats[kp]) {
        knowledgeStats[kp] = { total: 0, correct: 0 };
      }
      knowledgeStats[kp].total++;
      if (isAnswerCorrect(question)) {
        knowledgeStats[kp].correct++;
      }
    });

    // Get top 5 knowledge points by question count
    const sortedKnowledgePoints = Object.entries(knowledgeStats)
      .sort(([, a], [, b]) => b.total - a.total)
      .slice(0, 5)
      .map(([name, stats]) => ({
        subject: name,
        accuracy: Math.round((stats.correct / stats.total) * 100),
        fullMark: 100
      }));

    return sortedKnowledgePoints;
  };

  const chartConfig = {
    accuracy: {
      label: "正确率",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar 
          activeView="quiz-list" 
          onViewChange={() => {}} 
        />
        <SidebarInset className="flex-1">
          <div className="px-4 py-6">
            {/* Header */}
            <div className="mb-6">
              {/* Title, Status and Back Button */}
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    返回
                  </Button>
                  <h1 className="text-2xl font-bold text-foreground">{quiz.name}</h1>
                </div>
                
                <div className="flex items-center gap-3">
                  {getStatusBadge()}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex justify-end">
                <div className="flex flex-wrap gap-2">
                  <QuizActions quiz={quiz} isFromFavorites={isFromFavorites} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Quiz Info - Full Width */}
              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>试卷信息</CardTitle>
                  </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">创建时间</div>
                      <div className="font-medium">{quiz.createdAt.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">课程</div>
                      <div className="font-medium">{quiz.course}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">题目数量</div>
                      <div className="font-medium">{quiz.totalQuestions}题</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Lightbulb className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">知识点</div>
                      <div className="font-medium">
                        {quiz.questions && quiz.questions.length > 0 
                          ? [...new Set(quiz.questions.map((q: any) => q.knowledgePoint).filter(Boolean))].join(', ') || '未分类'
                          : '未分类'
                        }
                      </div>
                    </div>
                  </div>

                  {/* Show student and order info only if NOT from favorites */}
                  {!isFromFavorites && (
                    <>
                      <div className="flex items-center gap-3">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">学生</div>
                          <div className="font-medium">{quiz.studentName || '未分配'}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="text-sm text-muted-foreground">订单</div>
                          <div className="font-medium">{quiz.orderName || '未关联'}</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <Separator />

                <div>
                  <div className="text-sm text-muted-foreground mb-1">总分</div>
                  <div className="text-2xl font-bold text-primary">{quiz.totalScore}分</div>
                </div>

                {quiz.isCompleted && quiz.studentScore !== undefined && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">学生得分</div>
                    <div className="text-2xl font-bold text-green-600">
                      {quiz.studentScore}分
                    </div>
                    <div className="text-sm text-muted-foreground">
                      正确率: {Math.round((quiz.studentScore / quiz.totalScore) * 100)}%
                    </div>
                  </div>
                )}

                {quiz.completedAt && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">完成时间</div>
                    <div className="font-medium">{quiz.completedAt.toLocaleString()}</div>
                  </div>
                )}
              </CardContent>
                </Card>

                {/* Quiz Analysis */}
                {quiz.isCompleted && (
                  <Card>
                    <CardHeader>
                      <CardTitle>答题结果分析</CardTitle>
                    </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Target className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">得分</div>
                        <div className="text-lg font-bold">{quiz.studentScore}分</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="text-sm text-muted-foreground">正确率</div>
                        <div className="text-lg font-bold">
                          {Math.round((quiz.studentScore / quiz.totalScore) * 100)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <div>
                      <div className="text-sm text-muted-foreground">完成时长</div>
                      <div className="text-lg font-bold">{getCompletionDuration()}</div>
                    </div>
                  </div>

                  {getKnowledgePointStats().length > 0 && (
                    <div>
                      <div className="text-sm font-medium mb-3">知识点掌握情况</div>
                      <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[250px]"
                      >
                        <RadarChart data={getKnowledgePointStats()}>
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                          />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                          <PolarGrid />
                          <Radar
                            dataKey="accuracy"
                            fill="var(--color-accuracy)"
                            fillOpacity={0.6}
                            stroke="var(--color-accuracy)"
                            strokeWidth={2}
                          />
                        </RadarChart>
                      </ChartContainer>
                    </div>
                  )}
                </CardContent>
                  </Card>
                )}
              </div>

              {/* Question Navigation - Fixed */}
              <div className="sticky top-4 z-20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg border p-4 mb-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-muted-foreground mr-2">快速导航:</span>
                    {quiz.questions.map((_, index) => (
                      <Button
                        key={index}
                        variant={activeQuestionId === `question-${index}` ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => scrollToQuestion(index)}
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </div>
                  
                  {canViewAnswers() && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleAllAnswers}
                      className="flex items-center gap-2"
                    >
                      {showAllAnswers ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          隐藏所有答案
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          展开所有答案
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Questions */}
              <Card>
                <CardHeader>
                  <CardTitle>试卷题目</CardTitle>
                </CardHeader>
              <CardContent>
                <div className="space-y-6">
                {quiz.questions.map((question: any, index: number) => (
                  <Card 
                    key={index} 
                    id={`question-${index}`}
                    className="border-l-4 border-l-primary scroll-mt-24"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="bg-primary text-primary-foreground text-sm font-medium px-2 py-1 rounded">
                              第{index + 1}题
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ({question.score}分)
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {question.type}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-foreground mb-3">
                            {question.title}
                          </h4>
                          
                          {question.options && (
                            <div className="space-y-2 mb-4">
                              {question.options.map((option: string, optIndex: number) => {
                                const optionLetter = String.fromCharCode(65 + optIndex);
                                const isStudentChoice = question.studentAnswer === optionLetter;
                                const isCorrect = question.correctAnswer === optionLetter;
                                
                                return (
                                  <div 
                                    key={optIndex} 
                                    className={`p-3 rounded border transition-colors ${
                                      isStudentChoice && quiz.isCompleted
                                        ? isCorrect
                                          ? 'bg-green-50 border-green-200'
                                          : 'bg-red-50 border-red-200'
                                        : isCorrect && quiz.isCompleted && canViewAnswers()
                                          ? 'bg-green-50 border-green-200'
                                          : isStudentChoice
                                            ? 'bg-blue-50 border-blue-200'
                                            : 'bg-gray-50 border-gray-200'
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">
                                          {optionLetter}.
                                        </span>
                                        <span>{option}</span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {isStudentChoice && (
                                          <span className="text-blue-600 font-medium text-sm">
                                            学生选择
                                          </span>
                                        )}
                                        {quiz.isCompleted && isStudentChoice && (
                                          isCorrect ? (
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                          ) : (
                                            <XCircle className="h-4 w-4 text-red-600" />
                                          )
                                        )}
                                        {quiz.isCompleted && canViewAnswers() && isCorrect && !isStudentChoice && (
                                          <span className="text-green-600 font-medium text-sm">
                                            正确答案
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {question.studentAnswer && !question.options && (
                            <div className={`mb-4 p-3 border rounded ${
                              quiz.isCompleted
                                ? isAnswerCorrect(question)
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-red-50 border-red-200'
                                : 'bg-blue-50 border-blue-200'
                            }`}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-sm text-muted-foreground mb-1">学生答案:</div>
                                  <div className="font-medium">{question.studentAnswer}</div>
                                </div>
                                {quiz.isCompleted && (
                                  isAnswerCorrect(question) ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-red-600" />
                                  )
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {canViewAnswers() && (
                        <Collapsible
                          open={expandedQuestions[index.toString()]}
                          onOpenChange={() => toggleQuestionExpanded(index.toString())}
                        >
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-full justify-between">
                              <span>查看参考答案和解析</span>
                              {expandedQuestions[index.toString()] ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="space-y-3">
                            <Separator />
                            <div className="p-3 bg-green-50 border border-green-200 rounded">
                              <div className="text-sm text-muted-foreground mb-1">参考答案:</div>
                              <div className="font-medium text-green-800">{question.correctAnswer}</div>
                            </div>
                            
                            {question.explanation && (
                              <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                                <div className="text-sm text-muted-foreground mb-1">题目解析:</div>
                                <div className="text-amber-800">{question.explanation}</div>
                              </div>
                            )}

                            {question.knowledgePoint && (
                              <div className="text-sm text-muted-foreground">
                                <span className="font-medium">知识点:</span> {question.knowledgePoint}
                              </div>
                            )}
                          </CollapsibleContent>
                        </Collapsible>
                      )}

                      {!canViewAnswers() && (
                        <div className="text-center py-4 text-muted-foreground">
                          <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">完成答题后可查看参考答案和解析</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
                </div>
              </CardContent>
            </Card>
          </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default QuizDetail;