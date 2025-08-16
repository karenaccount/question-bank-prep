import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuiz } from "@/contexts/QuizContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Heart, 
  Search, 
  Calendar as CalendarIcon,
  Clock,
  User,
  Package,
  BookOpen,
  GraduationCap,
  Zap,
  Target,
  Layers
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import QuizActions from "@/components/QuizActions";

const FavoritesQuizzes = () => {
  const { user } = useAuth();
  const { getFavoriteQuizzes } = useQuiz();
  const navigate = useNavigate();
  
  const [orderQuery, setOrderQuery] = useState("");
  const [dateRange, setDateRange] = useState<{from?: Date; to?: Date}>({});
  const [studentQuery, setStudentQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [knowledgePointFilter, setKnowledgePointFilter] = useState("all");
  const [scenarioFilter, setScenarioFilter] = useState("all");
  
  // State for dropdown visibility
  const [orderDropdownOpen, setOrderDropdownOpen] = useState(false);
  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);
  const [subjectDropdownOpen, setSubjectDropdownOpen] = useState(false);
  const [knowledgePointDropdownOpen, setKnowledgePointDropdownOpen] = useState(false);

  const favoriteQuizzes = user ? getFavoriteQuizzes(user.id) : [];

  // Get unique values for filters
  const uniqueSubjects = [...new Set(favoriteQuizzes.map(quiz => quiz.course))];
  const uniqueKnowledgePoints = [...new Set(favoriteQuizzes.flatMap(quiz => quiz.questions.map((question: any) => question.knowledgePoint).filter(Boolean)))];
  
  // Filter subjects and knowledge points based on query
  const filteredSubjects = uniqueSubjects.filter(subject => 
    subject.toLowerCase().includes((subjectFilter === "all" ? "" : subjectFilter).toLowerCase())
  );
  
  const filteredKnowledgePoints = uniqueKnowledgePoints.filter(kp => 
    kp.toLowerCase().includes((knowledgePointFilter === "all" ? "" : knowledgePointFilter).toLowerCase())
  );

  // Filter quizzes - only show currently favorited quizzes
  const filteredQuizzes = favoriteQuizzes.filter(quiz => {
    // First check if quiz is still favorited
    const isFavorited = quiz.isFavorite;
    if (!isFavorited) return false;
    
    const matchesOrder = orderQuery === "" || quiz.orderName.toLowerCase().includes(orderQuery.toLowerCase());
    const matchesStudent = studentQuery === "" || quiz.studentName.toLowerCase().includes(studentQuery.toLowerCase());
    const matchesSubject = subjectFilter === "all" || quiz.course.toLowerCase().includes(subjectFilter.toLowerCase());
    const matchesKnowledgePoint = knowledgePointFilter === "all" || 
      quiz.questions.some((q: any) => q.knowledgePoint?.toLowerCase().includes(knowledgePointFilter.toLowerCase()));
    const matchesScenario = scenarioFilter === "all"; // Scenario filtering disabled for now
    
    // Date range filter
    const matchesDate = !dateRange.from || !dateRange.to || 
      (quiz.createdAt >= dateRange.from && quiz.createdAt <= dateRange.to);
    
    return matchesOrder && matchesStudent && matchesSubject && matchesKnowledgePoint && matchesScenario && matchesDate;
  });

  const uniqueStudents = [...new Set(favoriteQuizzes.map(q => q.studentName))];
  const uniqueOrders = [...new Set(favoriteQuizzes.map(q => q.orderName))];
  
  // Filter orders based on query
  const filteredOrders = uniqueOrders.filter(order => 
    order.toLowerCase().includes(orderQuery.toLowerCase())
  );
  
  // Filter students based on query
  const filteredStudents = uniqueStudents.filter(student => 
    student.toLowerCase().includes(studentQuery.toLowerCase())
  );

  const getStatusBadge = (quiz: any) => {
    if (quiz.isCompleted) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">已答题</Badge>;
    }
    if (quiz.studentScore !== undefined) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">答题中</Badge>;
    }
    return <Badge variant="outline">未答题</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-500" />
            收藏的试卷
          </h1>
          <p className="text-muted-foreground mt-2">
            查看您收藏的所有试卷
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">筛选条件</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <label className="text-sm font-medium mb-2 block">订单号</label>
                <Input
                  placeholder="输入订单名称..."
                  value={orderQuery}
                  onChange={(e) => {
                    setOrderQuery(e.target.value);
                    setOrderDropdownOpen(e.target.value.length > 0);
                  }}
                  onFocus={() => setOrderDropdownOpen(orderQuery.length > 0)}
                  onBlur={() => setTimeout(() => setOrderDropdownOpen(false), 200)}
                />
                {orderDropdownOpen && filteredOrders.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-md max-h-48 overflow-y-auto">
                    {filteredOrders.map(order => (
                      <div
                        key={order}
                        className="px-3 py-2 hover:bg-accent cursor-pointer text-sm"
                        onClick={() => {
                          setOrderQuery(order);
                          setOrderDropdownOpen(false);
                        }}
                      >
                        {order}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">时间段</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateRange.from && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "yyyy-MM-dd")} - {format(dateRange.to, "yyyy-MM-dd")}
                          </>
                        ) : (
                          format(dateRange.from, "yyyy-MM-dd")
                        )
                      ) : (
                        "选择日期范围"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{from: dateRange.from, to: dateRange.to}}
                      onSelect={(range) => setDateRange(range || {})}
                      numberOfMonths={2}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>


              <div className="relative">
                <label className="text-sm font-medium mb-2 block">课程</label>
                <Input
                  placeholder="输入课程名称..."
                  value={subjectFilter === "all" ? "" : subjectFilter}
                  onChange={(e) => {
                    setSubjectFilter(e.target.value || "all");
                    setSubjectDropdownOpen(e.target.value.length > 0);
                  }}
                  onFocus={() => setSubjectDropdownOpen((subjectFilter !== "all" && subjectFilter.length > 0))}
                  onBlur={() => setTimeout(() => setSubjectDropdownOpen(false), 200)}
                />
                {subjectDropdownOpen && filteredSubjects.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-md max-h-48 overflow-y-auto">
                    {filteredSubjects.map(subject => (
                      <div
                        key={subject}
                        className="px-3 py-2 hover:bg-accent cursor-pointer text-sm"
                        onClick={() => {
                          setSubjectFilter(subject);
                          setSubjectDropdownOpen(false);
                        }}
                      >
                        {subject}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="relative">
                <label className="text-sm font-medium mb-2 block">知识点</label>
                <Input
                  placeholder="输入知识点..."
                  value={knowledgePointFilter === "all" ? "" : knowledgePointFilter}
                  onChange={(e) => {
                    setKnowledgePointFilter(e.target.value || "all");
                    setKnowledgePointDropdownOpen(e.target.value.length > 0);
                  }}
                  onFocus={() => setKnowledgePointDropdownOpen((knowledgePointFilter !== "all" && knowledgePointFilter.length > 0))}
                  onBlur={() => setTimeout(() => setKnowledgePointDropdownOpen(false), 200)}
                />
                {knowledgePointDropdownOpen && filteredKnowledgePoints.length > 0 && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-md max-h-48 overflow-y-auto">
                    {filteredKnowledgePoints.map(kp => (
                      <div
                        key={kp}
                        className="px-3 py-2 hover:bg-accent cursor-pointer text-sm"
                        onClick={() => {
                          setKnowledgePointFilter(kp);
                          setKnowledgePointDropdownOpen(false);
                        }}
                      >
                        {kp}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">场景类型</label>
                <Select value={scenarioFilter} onValueChange={setScenarioFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择场景类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="Pretest">Pretest</SelectItem>
                    <SelectItem value="随堂测验">随堂测验</SelectItem>
                    <SelectItem value="课后作业">课后作业</SelectItem>
                    <SelectItem value="阶段小测">阶段小测</SelectItem>
                    <SelectItem value="模拟考试">模拟考试</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Favorites List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredQuizzes.length === 0 ? (
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="text-center py-12">
                  <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">暂无收藏</h3>
                  <p className="text-muted-foreground">
                    {orderQuery || studentQuery || subjectFilter !== "all" || dateRange.from
                      ? "没有符合筛选条件的收藏试卷"
                      : "您还没有收藏任何试卷"
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredQuizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                         <div className="flex items-center gap-3 mb-2">
                           <Link 
                             to={`/quiz/${quiz.id}`}
                             className="text-lg font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
                           >
                             {quiz.name}
                           </Link>
                           <Heart className="h-4 w-4 text-red-500 fill-current" />
                         </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{quiz.createdAt.toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span>{quiz.course}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            <span>概率论</span> {/* Mock knowledge point */}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4" />
                            <span>期中考试</span> {/* Mock scenario type */}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            <span>{quiz.totalQuestions}题/{quiz.totalScore}分</span>
                          </div>
                        </div>
                        
                      </div>
                      
                      <div className="ml-4">
                        <QuizActions quiz={quiz} iconOnly isFromFavorites />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesQuizzes;