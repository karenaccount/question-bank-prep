import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuiz } from "@/contexts/QuizContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import {
  Search,
  Trash2,
  Eye,
  EyeOff,
  BookOpen,
  Clock,
  Target,
  Calendar,
  User,
  AlertCircle,
  ArrowLeft,
  FileText,
  CheckCircle,
  RotateCcw,
  Shuffle,
  GraduationCap,
  Package
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const WrongAnswersBook = () => {
  const { user } = useAuth();
  const { wrongAnswers, removeFromWrongAnswers, clearWrongAnswers } = useQuiz();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [scenarioFilter, setScenarioFilter] = useState("all");
  const [showAllAnswers, setShowAllAnswers] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const userWrongAnswers = wrongAnswers.filter(item => item.userId === user?.id);

  // Filter wrong answers
  const filteredWrongAnswers = userWrongAnswers.filter(item => {
    const matchesSearch = item.question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.quizName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = subjectFilter === "all" || item.subject === subjectFilter;
    const matchesCourse = courseFilter === "all" || item.course === courseFilter;
    const matchesScenario = scenarioFilter === "all" || item.scenarioType === scenarioFilter;
    
    const matchesTime = (() => {
      if (timeFilter === "all") return true;
      const now = new Date();
      const itemDate = new Date(item.addedAt);
      
      switch (timeFilter) {
        case "today":
          return itemDate.toDateString() === now.toDateString();
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return itemDate >= weekAgo;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return itemDate >= monthAgo;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesSubject && matchesCourse && matchesScenario && matchesTime;
  });

  // Get unique values for filters
  const uniqueSubjects = [...new Set(userWrongAnswers.map(item => item.subject))];
  const uniqueCourses = [...new Set(userWrongAnswers.map(item => item.course))];
  const uniqueScenarios = [...new Set(userWrongAnswers.map(item => item.scenarioType))];

  const handleRemoveFromWrongAnswers = (questionId: string) => {
    removeFromWrongAnswers(questionId);
  };

  const handleClearAll = () => {
    if (window.confirm("确定要清空所有错题吗？此操作不可撤销。")) {
      clearWrongAnswers();
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'single-choice': '单选题',
      'multiple-choice': '多选题',
      'true-false': '判断题',
      'short-answer': '简答题',
      'essay': '论述题'
    };
    return typeMap[type] || type;
  };

  const toggleQuestionExpanded = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const toggleAllAnswers = () => {
    if (showAllAnswers) {
      setExpandedQuestions(new Set());
    } else {
      setExpandedQuestions(new Set(filteredWrongAnswers.map(item => item.id)));
    }
    setShowAllAnswers(!showAllAnswers);
  };

  const handleRandomQuiz = () => {
    if (filteredWrongAnswers.length === 0) {
      alert("错题本中没有题目可以抽查");
      return;
    }
    
    const shuffled = [...filteredWrongAnswers].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, Math.min(5, filteredWrongAnswers.length));
    
    // Navigate to quiz mode with selected questions
    console.log("Random quiz questions:", selectedQuestions);
    alert(`准备开始错题抽查，共${selectedQuestions.length}道题目`);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    返回
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                      <BookOpen className="h-6 w-6" />
                      错题本
                    </h1>
                    <p className="text-muted-foreground">查看和管理您的错题记录</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {filteredWrongAnswers.length > 0 && (
                    <Button onClick={handleRandomQuiz}>
                      <Shuffle className="h-4 w-4 mr-2" />
                      错题抽查
                    </Button>
                  )}
                  {userWrongAnswers.length > 0 && (
                    <Button variant="destructive" onClick={handleClearAll}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      清空错题本
                    </Button>
                  )}
                </div>
              </div>

              {/* Filters */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">筛选条件</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">搜索</label>
                      <div className="relative">
                        <Input
                          placeholder="搜索题目内容或试卷名称..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pr-10"
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">学科</label>
                      <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择学科" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部学科</SelectItem>
                          {uniqueSubjects.map((subject: string) => (
                            <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">课程</label>
                      <Select value={courseFilter} onValueChange={setCourseFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择课程" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部课程</SelectItem>
                          {uniqueCourses.map((course: string) => (
                            <SelectItem key={course} value={course}>{course}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">场景类型</label>
                      <Select value={scenarioFilter} onValueChange={setScenarioFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择场景类型" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部场景</SelectItem>
                          {uniqueScenarios.map((scenario: string) => (
                            <SelectItem key={scenario} value={scenario}>{scenario}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">时间</label>
                      <Select value={timeFilter} onValueChange={setTimeFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择时间范围" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">全部时间</SelectItem>
                          <SelectItem value="today">今天</SelectItem>
                          <SelectItem value="week">本周</SelectItem>
                          <SelectItem value="month">本月</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Controls */}
              {filteredWrongAnswers.length > 0 && (
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-muted-foreground">
                    共 {filteredWrongAnswers.length} 道错题
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleAllAnswers}
                  >
                    {showAllAnswers ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2" />
                        隐藏所有答案
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-2" />
                        展开所有答案
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Wrong Answers List */}
              <div className="space-y-4">
                {filteredWrongAnswers.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">暂无错题</h3>
                      <p className="text-muted-foreground">
                        {searchQuery || subjectFilter !== "all" || timeFilter !== "all"
                          ? "没有符合筛选条件的错题"
                          : "您还没有做错的题目，继续保持！"
                        }
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filteredWrongAnswers.map((wrongAnswer) => (
                    <Card key={wrongAnswer.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* Question Header */}
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge variant="outline">
                                  {getQuestionTypeLabel(wrongAnswer.question.type)}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  来自试卷：{wrongAnswer.quizName}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {wrongAnswer.addedAt.toLocaleDateString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Package className="h-4 w-4" />
                                  {wrongAnswer.orderName}
                                </span>
                                <span className="flex items-center gap-1">
                                  <FileText className="h-4 w-4" />
                                  {wrongAnswer.subject}
                                </span>
                                <span className="flex items-center gap-1">
                                  <BookOpen className="h-4 w-4" />
                                  {wrongAnswer.course}
                                </span>
                                <span className="flex items-center gap-1">
                                  <GraduationCap className="h-4 w-4" />
                                  {wrongAnswer.scenarioType}
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemoveFromWrongAnswers(wrongAnswer.questionId)}
                              >
                                移出错题本
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleQuestionExpanded(wrongAnswer.id)}
                              >
                                {expandedQuestions.has(wrongAnswer.id) ? (
                                  <>
                                    <EyeOff className="h-4 w-4 mr-1" />
                                    隐藏
                                  </>
                                ) : (
                                  <>
                                    <Eye className="h-4 w-4 mr-1" />
                                    展开
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>

                          {/* Question Content */}
                          <div className="space-y-3">
                            <div>
                              <h4 className="font-medium mb-2">题目：</h4>
                              <p className="text-foreground">{wrongAnswer.question.content}</p>
                            </div>

                            {/* Options for choice questions */}
                            {(wrongAnswer.question.type === 'single-choice' || wrongAnswer.question.type === 'multiple-choice') && (
                              <div>
                                <h4 className="font-medium mb-2">选项：</h4>
                                <div className="space-y-1">
                                  {wrongAnswer.question.options?.map((option: string, index: number) => (
                                    <div key={index} className="flex items-center gap-2">
                                      <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm">
                                        {String.fromCharCode(65 + index)}
                                      </span>
                                      <span>{option}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Show answers and explanation if expanded */}
                            {expandedQuestions.has(wrongAnswer.id) && (
                              <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2 text-red-600">您的答案：</h4>
                                    <p className="text-red-600 bg-red-50 p-2 rounded">
                                      {wrongAnswer.studentAnswer}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-medium mb-2 text-green-600">正确答案：</h4>
                                    <p className="text-green-600 bg-green-50 p-2 rounded">
                                      {wrongAnswer.question.correctAnswer}
                                    </p>
                                  </div>
                                </div>

                                {/* Explanation */}
                                {wrongAnswer.question.explanation && (
                                  <div>
                                    <h4 className="font-medium mb-2">解析：</h4>
                                    <p className="text-muted-foreground bg-blue-50 p-3 rounded">
                                      {wrongAnswer.question.explanation}
                                    </p>
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-2 pt-2">
                            <Button variant="outline" size="sm" onClick={() => navigate(`/quiz/${wrongAnswer.quizId}`)}>
                              查看原试卷
                            </Button>
                            <Button variant="outline" size="sm">
                              <RotateCcw className="h-4 w-4 mr-2" />
                              重新练习
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default WrongAnswersBook;