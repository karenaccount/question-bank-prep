import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useAuth } from "@/contexts/AuthContext";
import { useQuiz } from "@/contexts/QuizContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Clock, User, Package, BookOpen, GraduationCap, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import QuizActions from "@/components/QuizActions";

const QuizList = () => {
  const { user } = useAuth();
  const { quizzes, getQuizzesByTeacher, getQuizzesByStudent } = useQuiz();
  const navigate = useNavigate();
  
  const [orderQuery, setOrderQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [studentQuery, setStudentQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // State for dropdown visibility
  const [orderDropdownOpen, setOrderDropdownOpen] = useState(false);
  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);

  const userQuizzes = user?.role === 'teacher' 
    ? getQuizzesByTeacher(user.id) 
    : getQuizzesByStudent(user?.id || '');

  // Debug information
  console.log('Current user:', user);
  console.log('All quizzes:', quizzes);
  console.log('User quizzes:', userQuizzes);
  console.log('Date range:', dateRange);

  const getStatusBadge = (quiz: any) => {
    if (quiz.isCompleted) {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">已答题</Badge>;
    }
    if (quiz.studentScore !== undefined) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">答题中</Badge>;
    }
    return <Badge variant="outline">未答题</Badge>;
  };

  const getStatusText = (quiz: any) => {
    if (quiz.isCompleted) return "已答题";
    if (quiz.studentScore !== undefined) return "答题中";
    return "未答题";
  };

  // Filter quizzes based on search and filters
  const filteredQuizzes = userQuizzes.filter(quiz => {
    const matchesOrder = orderQuery === "" || quiz.orderName.toLowerCase().includes(orderQuery.toLowerCase());
    const matchesStudent = studentQuery === "" || quiz.studentName.toLowerCase().includes(studentQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || getStatusText(quiz) === statusFilter;
    
    // Date range filter
    let matchesDate = true;
    if (dateRange?.from || dateRange?.to) {
      // Handle both Date objects and serialized date objects
      const quizDate = new Date(quiz.createdAt);
      quizDate.setHours(0, 0, 0, 0); // Set to start of day for comparison
      
      if (dateRange.from && dateRange.to) {
        const fromDate = new Date(dateRange.from);
        const toDate = new Date(dateRange.to);
        fromDate.setHours(0, 0, 0, 0);
        toDate.setHours(23, 59, 59, 999); // Set to end of day for to date
        matchesDate = quizDate >= fromDate && quizDate <= toDate;
      } else if (dateRange.from) {
        const fromDate = new Date(dateRange.from);
        fromDate.setHours(0, 0, 0, 0);
        matchesDate = quizDate >= fromDate;
      } else if (dateRange.to) {
        const toDate = new Date(dateRange.to);
        toDate.setHours(23, 59, 59, 999);
        matchesDate = quizDate <= toDate;
      }
    }
    
    return matchesOrder && matchesStudent && matchesStatus && matchesDate;
  });

  // Get unique values for filters
  const uniqueStudents = [...new Set(userQuizzes.map(q => q.studentName))];
  const uniqueOrders = [...new Set(userQuizzes.map(q => q.orderName))];
  
  // Filter orders based on query
  const filteredOrders = uniqueOrders.filter(order => 
    order.toLowerCase().includes(orderQuery.toLowerCase())
  );
  
  // Filter students based on query
  const filteredStudents = uniqueStudents.filter(student => 
    student.toLowerCase().includes(studentQuery.toLowerCase())
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">试卷管理</h1>
          <p className="text-muted-foreground mt-2">
            {user?.role === 'teacher' ? '管理您创建的所有试卷' : '查看您的所有试卷'}
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">筛选条件</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <DateRangePicker
                  value={dateRange}
                  onChange={setDateRange}
                  placeholder="请选择日期范围"
                />
              </div>

              {user?.role === 'teacher' && (
                <div className="relative">
                  <label className="text-sm font-medium mb-2 block">学生</label>
                  <Input
                    placeholder="输入学生姓名..."
                    value={studentQuery}
                    onChange={(e) => {
                      setStudentQuery(e.target.value);
                      setStudentDropdownOpen(e.target.value.length > 0);
                    }}
                    onFocus={() => setStudentDropdownOpen(studentQuery.length > 0)}
                    onBlur={() => setTimeout(() => setStudentDropdownOpen(false), 200)}
                  />
                  {studentDropdownOpen && filteredStudents.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-md max-h-48 overflow-y-auto">
                      {filteredStudents.map(student => (
                        <div
                          key={student}
                          className="px-3 py-2 hover:bg-accent cursor-pointer text-sm"
                          onClick={() => {
                            setStudentQuery(student);
                            setStudentDropdownOpen(false);
                          }}
                        >
                          {student}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">答题状态</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="未答题">未答题</SelectItem>
                    <SelectItem value="答题中">答题中</SelectItem>
                    <SelectItem value="已答题">已答题</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quiz List */}
        <div className="space-y-6">
          {filteredQuizzes
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .length === 0 ? (
            <div>
              <Card>
                <CardContent className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">暂无试卷</h3>
                  <p className="text-muted-foreground">
                    {orderQuery || studentQuery || statusFilter !== "all" || dateRange?.from
                      ? "没有符合筛选条件的试卷"
                      : user?.role === 'teacher' ? "您还没有创建任何试卷" : "您还没有收到任何试卷"
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredQuizzes
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((quiz) => (
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
                          {getStatusBadge(quiz)}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>{quiz.createdAt.toLocaleDateString()}</span>
                          </div>
                          
                          {user?.role === 'teacher' && (
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{quiz.studentName}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            <span>{quiz.orderName}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span>{quiz.course}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            <span>{quiz.totalQuestions}题</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4" />
                            <span>总分: {quiz.totalScore}分</span>
                          </div>
                        </div>
                        
                        {quiz.isCompleted && quiz.studentScore !== undefined && (
                          <div className="mt-3 text-sm">
                            <span className="text-green-600 font-medium">
                              学生得分: {quiz.studentScore}/{quiz.totalScore}分
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4">
                        <QuizActions quiz={quiz} iconOnly />
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
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default QuizList;