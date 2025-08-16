import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuiz } from "@/contexts/QuizContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Calendar,
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
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuizActions from "@/components/QuizActions";

const FavoritesQuizzes = () => {
  const { user } = useAuth();
  const { getFavoriteQuizzes } = useQuiz();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [knowledgePointFilter, setKnowledgePointFilter] = useState("all");
  const [scenarioFilter, setScenarioFilter] = useState("all");

  const favoriteQuizzes = user ? getFavoriteQuizzes(user.id) : [];

  // Filter quizzes - only show currently favorited quizzes
  const filteredQuizzes = favoriteQuizzes.filter(quiz => {
    // First check if quiz is still favorited
    const isFavorited = quiz.isFavorite;
    if (!isFavorited) return false;
    
    const matchesSearch = quiz.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.orderName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubject = subjectFilter === "all" || quiz.course === subjectFilter;
    
    // Time filter logic
    const matchesTime = timeFilter === "all" || (() => {
      const now = new Date();
      const quizDate = new Date(quiz.createdAt);
      switch (timeFilter) {
        case "today":
          return quizDate.toDateString() === now.toDateString();
        case "week":
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return quizDate >= oneWeekAgo;
        case "month":
          const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          return quizDate >= oneMonthAgo;
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesSubject && matchesTime;
  });

  // Get unique values for filters
  const uniqueSubjects = [...new Set(favoriteQuizzes.map(quiz => quiz.course))];
  // Mock data for knowledge points and scenarios - in real app these would come from quiz data
  const knowledgePoints = ["概率论", "线性代数", "微积分", "数据结构", "算法"];
  const scenarios = ["期中考试", "期末考试", "随堂测验", "作业练习", "竞赛训练"];

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
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Heart className="h-8 w-8 text-red-500" />
              收藏的试卷
            </h1>
            <p className="text-muted-foreground mt-2">
              查看您收藏的所有试卷
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="md:col-span-2 lg:col-span-1">
                <label className="text-sm font-medium mb-2 block">搜索</label>
                <div className="relative">
                  <Input
                    placeholder="搜索试卷名称、学生或订单..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
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

              <div>
                <label className="text-sm font-medium mb-2 block">知识点</label>
                <Select value={knowledgePointFilter} onValueChange={setKnowledgePointFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择知识点" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部知识点</SelectItem>
                    {knowledgePoints.map((point: string) => (
                      <SelectItem key={point} value={point}>{point}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">课程</label>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择课程" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部课程</SelectItem>
                    {uniqueSubjects.map((subject: string) => (
                      <SelectItem key={subject} value={subject}>{subject}</SelectItem>
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
                    <SelectItem value="all">全部类型</SelectItem>
                    {scenarios.map((scenario: string) => (
                      <SelectItem key={scenario} value={scenario}>{scenario}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Favorites List */}
        <div className="space-y-4">
          {filteredQuizzes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">暂无收藏</h3>
                <p className="text-muted-foreground">
                  {searchQuery || subjectFilter !== "all" || timeFilter !== "all"
                    ? "没有符合筛选条件的收藏试卷"
                    : "您还没有收藏任何试卷"
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
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 text-sm text-muted-foreground mb-3">
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
                          <Target className="h-4 w-4" />
                          <span>概率论</span> {/* Mock knowledge point */}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span>{quiz.course}</span>
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

export default FavoritesQuizzes;