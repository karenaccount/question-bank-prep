import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuiz } from "@/contexts/QuizContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  EyeOff
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuizActions from "@/components/QuizActions";

const QuizDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { quizzes } = useQuiz();
  
  const quiz = quizzes.find(q => q.id === id);
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Record<string, boolean>>({});

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">试卷未找到</h1>
            <Button onClick={() => navigate(-1)}>返回</Button>
          </div>
        </div>
        <Footer />
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-foreground">{quiz.name}</h1>
              {getStatusBadge()}
            </div>
          </div>
          <QuizActions quiz={quiz} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quiz Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>试卷信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">创建时间</div>
                    <div className="font-medium">{quiz.createdAt.toLocaleString()}</div>
                  </div>
                </div>

                {user?.role === 'teacher' && (
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">学生</div>
                      <div className="font-medium">{quiz.studentName}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">订单</div>
                    <div className="font-medium">{quiz.orderName}</div>
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
          </div>

          {/* Questions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>试卷题目</CardTitle>
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
              </CardHeader>
              <CardContent className="space-y-6">
                {quiz.questions.map((question: any, index: number) => (
                  <Card key={index} className="border-l-4 border-l-primary">
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
                              {question.options.map((option: string, optIndex: number) => (
                                <div 
                                  key={optIndex} 
                                  className={`p-2 rounded border ${
                                    question.studentAnswer === String.fromCharCode(65 + optIndex)
                                      ? 'bg-blue-50 border-blue-200'
                                      : 'bg-gray-50 border-gray-200'
                                  }`}
                                >
                                  <span className="font-medium mr-2">
                                    {String.fromCharCode(65 + optIndex)}.
                                  </span>
                                  {option}
                                  {question.studentAnswer === String.fromCharCode(65 + optIndex) && (
                                    <span className="ml-2 text-blue-600 font-medium">(学生选择)</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {question.studentAnswer && !question.options && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
                              <div className="text-sm text-muted-foreground mb-1">学生答案:</div>
                              <div className="font-medium">{question.studentAnswer}</div>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default QuizDetail;