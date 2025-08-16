import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuiz } from "@/contexts/QuizContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Package, BookOpen, GraduationCap, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuizActions from "@/components/QuizActions";

const QuizList = () => {
  const { user } = useAuth();
  const { quizzes, getQuizzesByTeacher, getQuizzesByStudent } = useQuiz();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [studentFilter, setStudentFilter] = useState("all");
  const [orderFilter, setOrderFilter] = useState("all");
  const [knowledgeFilter, setKnowledgeFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [scenarioFilter, setScenarioFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const userQuizzes = user?.role === 'teacher' 
    ? getQuizzesByTeacher(user.id) 
    : getQuizzesByStudent(user?.id || '');

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
    const matchesSearch = quiz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.orderName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStudent = studentFilter === "all" || quiz.studentName === studentFilter;
    const matchesOrder = orderFilter === "all" || quiz.orderName === orderFilter;
    const matchesStatus = statusFilter === "all" || getStatusText(quiz) === statusFilter;
    
    return matchesSearch && matchesStudent && matchesOrder && matchesStatus;
  });

  // Get unique values for filters
  const uniqueStudents = [...new Set(userQuizzes.map(q => q.studentName))];
  const uniqueOrders = [...new Set(userQuizzes.map(q => q.orderName))];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">试卷管理</h1>
            <p className="text-muted-foreground mt-2">
              {user?.role === 'teacher' ? '管理您创建的所有试卷' : '查看您的所有试卷'}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate(-1)}>
            返回
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">筛选条件</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">搜索</label>
                <Input
                  placeholder="搜索试卷名称、学生或订单..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
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

              {user?.role === 'teacher' && (
                <div>
                  <label className="text-sm font-medium mb-2 block">学生</label>
                  <Select value={studentFilter} onValueChange={setStudentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="选择学生" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部学生</SelectItem>
                      {uniqueStudents.map(student => (
                        <SelectItem key={student} value={student}>{student}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div>
                <label className="text-sm font-medium mb-2 block">订单</label>
                <Select value={orderFilter} onValueChange={setOrderFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择订单" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部订单</SelectItem>
                    {uniqueOrders.map(order => (
                      <SelectItem key={order} value={order}>{order}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

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
        <div className="space-y-4">
          {filteredQuizzes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">暂无试卷</h3>
                <p className="text-muted-foreground">
                  {searchQuery || timeFilter !== "all" || studentFilter !== "all" || orderFilter !== "all" || statusFilter !== "all"
                    ? "没有符合筛选条件的试卷"
                    : user?.role === 'teacher' ? "您还没有创建任何试卷" : "您还没有收到任何试卷"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredQuizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{quiz.name}</h3>
                        {getStatusBadge(quiz)}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm text-muted-foreground">
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
                    
                    <div className="flex gap-2 ml-4">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/quiz/${quiz.id}`}>查看详情</Link>
                      </Button>
                      <QuizActions quiz={quiz} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default QuizList;