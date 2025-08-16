import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus, FileText, Clock, BarChart3, CheckCircle, User, Package, BookOpen, GraduationCap, Zap, Heart, Users, Filter, Brain } from "lucide-react";
import { mockOrders, Order } from "@/data/mockOrders";
import FastQuizMode from "./FastQuizMode";
import DetailedQuizMode from "./DetailedQuizMode";
import QuizGeneration from "./QuizGeneration";
import QuizEditor from "./QuizEditor";
import QuizActions from "./QuizActions";
import { useQuiz } from "@/contexts/QuizContext";
import { useAuth } from "@/contexts/AuthContext";

const TeacherDashboard = () => {
  const { saveQuiz, getQuizzesByTeacher, getFavoriteQuizzes } = useQuiz();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [mode, setMode] = useState<'selection' | 'fast' | 'detailed' | 'generating' | 'editing'>('selection');
  const [showDropdown, setShowDropdown] = useState(false);
  const [quizConfig, setQuizConfig] = useState<any>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  
  // 答题统计相关状态
  const [statsDimension, setStatsDimension] = useState<'student' | 'order' | 'knowledge'>('student');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [selectedOrderForStats, setSelectedOrderForStats] = useState<string>('');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  
  const teacherQuizzes = user ? getQuizzesByTeacher(user.id) : [];
  
  // 获取所有学生名单
  const allStudents = Array.from(new Set(teacherQuizzes.map(quiz => quiz.studentName)));
  const filteredStudents = allStudents.filter(student => 
    student.toLowerCase().includes(studentSearchQuery.toLowerCase())
  );
  
  // 获取所有订单
  const allOrders = Array.from(new Set(teacherQuizzes.map(quiz => quiz.orderName)));
  const filteredOrders = allOrders.filter(order => 
    order.toLowerCase().includes(orderSearchQuery.toLowerCase())
  );
  
  // 计算学生统计数据
  const getStudentStats = (studentName: string) => {
    const studentQuizzes = teacherQuizzes.filter(quiz => quiz.studentName === studentName);
    const completedQuizzes = studentQuizzes.filter(quiz => quiz.isCompleted);
    const totalQuizzes = studentQuizzes.length;
    const completionRate = totalQuizzes > 0 ? Math.round((completedQuizzes.length / totalQuizzes) * 100) : 0;
    
    // 计算平均正确率
    const totalCorrectQuestions = completedQuizzes.reduce((sum, quiz) => {
      if (quiz.studentScore && quiz.totalScore) {
        return sum + (quiz.studentScore / quiz.totalScore) * quiz.totalQuestions;
      }
      return sum;
    }, 0);
    const totalQuestions = completedQuizzes.reduce((sum, quiz) => sum + quiz.totalQuestions, 0);
    const averageAccuracy = totalQuestions > 0 ? Math.round((totalCorrectQuestions / totalQuestions) * 100) : 0;
    
    // 计算薄弱知识点（模拟数据）
    const weakKnowledgePoints = [
      { name: '函数与方程', errorRate: 45 },
      { name: '几何图形', errorRate: 38 },
      { name: '数据分析', errorRate: 32 },
      { name: '概率统计', errorRate: 28 },
      { name: '代数运算', errorRate: 25 }
    ].slice(0, 5);
    
    return {
      completedQuizzes: completedQuizzes.length,
      totalQuizzes,
      completionRate,
      averageAccuracy,
      weakKnowledgePoints
    };
  };
  
  // 计算订单统计数据
  const getOrderStats = (orderName: string) => {
    const orderQuizzes = teacherQuizzes.filter(quiz => quiz.orderName === orderName);
    const completedQuizzes = orderQuizzes.filter(quiz => quiz.isCompleted);
    const totalQuizzes = orderQuizzes.length;
    const completionRate = totalQuizzes > 0 ? Math.round((completedQuizzes.length / totalQuizzes) * 100) : 0;
    
    // 计算平均正确率
    const totalCorrectQuestions = completedQuizzes.reduce((sum, quiz) => {
      if (quiz.studentScore && quiz.totalScore) {
        return sum + (quiz.studentScore / quiz.totalScore) * quiz.totalQuestions;
      }
      return sum;
    }, 0);
    const totalQuestions = completedQuizzes.reduce((sum, quiz) => sum + quiz.totalQuestions, 0);
    const averageAccuracy = totalQuestions > 0 ? Math.round((totalCorrectQuestions / totalQuestions) * 100) : 0;
    
    // 计算薄弱知识点（模拟数据）
    const weakKnowledgePoints = [
      { name: '函数与方程', errorRate: 42 },
      { name: '几何图形', errorRate: 35 },
      { name: '数据分析', errorRate: 30 },
      { name: '概率统计', errorRate: 25 },
      { name: '代数运算', errorRate: 22 }
    ].slice(0, 5);
    
    return {
      completedQuizzes: completedQuizzes.length,
      totalQuizzes,
      completionRate,
      averageAccuracy,
      weakKnowledgePoints
    };
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    
    if (!value.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const results = mockOrders.filter(order => 
      order.name.toLowerCase().includes(value.toLowerCase()) ||
      order.student.toLowerCase().includes(value.toLowerCase()) ||
      order.course.toLowerCase().includes(value.toLowerCase())
    );
    
    setSearchResults(results);
    setShowDropdown(true);
  };

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    setShowDropdown(false);
    setSearchQuery(order.name);
  };

  const handleModeSelect = (modeType: 'fast' | 'detailed') => {
    setMode(modeType);
  };

  const handleGenerate = (config: any) => {
    setQuizConfig({
      ...config,
      studentName: selectedOrder?.student
    });
    setMode('generating');
  };

  const handleGenerationComplete = (questions: any[]) => {
    setGeneratedQuestions(questions);
    setMode('editing');
  };

  const handleSaveQuiz = (quizName: string, questions: any[]) => {
    if (selectedOrder && user) {
      saveQuiz({
        name: quizName,
        orderName: selectedOrder.name,
        studentName: selectedOrder.student,
        course: selectedOrder.course,
        questions,
        totalQuestions: questions.length,
        totalScore: questions.reduce((sum, q) => sum + (q.score || 0), 0),
        createdBy: user.id,
        assignedTo: 'student-1', // Mock student ID - should be from selectedOrder
      });
    }
    setMode('selection');
    setSelectedOrder(null);
    setQuizConfig(null);
    setGeneratedQuestions([]);
  };

  const resetMode = () => {
    setMode('selection');
    setSelectedOrder(null);
    setQuizConfig(null);
    setGeneratedQuestions([]);
  };

  if (mode === 'fast' && selectedOrder) {
    return (
      <FastQuizMode
        order={selectedOrder}
        onBack={resetMode}
        onGenerate={handleGenerate}
      />
    );
  }

  if (mode === 'detailed' && selectedOrder) {
    return (
      <DetailedQuizMode
        order={selectedOrder}
        onBack={resetMode}
        onGenerate={handleGenerate}
      />
    );
  }

  if (mode === 'generating' && quizConfig) {
    return (
      <QuizGeneration
        config={quizConfig}
        onBack={resetMode}
        onComplete={handleGenerationComplete}
      />
    );
  }

  if (mode === 'editing' && generatedQuestions.length > 0) {
    return (
      <QuizEditor
        questions={generatedQuestions}
        config={quizConfig}
        onBack={resetMode}
        onSave={handleSaveQuiz}
      />
    );
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 出题模块 - 主要模块 */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                智能出题
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* 搜索订单 */}
              <div className="relative">
                <label className="text-sm font-medium mb-2 block">搜索订单</label>
                <div className="relative">
                  <Input 
                    placeholder="输入订单名称、学生姓名或课程名称" 
                    className="w-full"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  
                  {/* 搜索结果下拉列表 */}
                  {showDropdown && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 bg-background border border-border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                      {searchResults.map((order) => (
                        <div
                          key={order.id}
                          className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                          onClick={() => handleOrderSelect(order)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-sm">{order.name}</h4>
                              <p className="text-xs text-muted-foreground">{order.student} - {order.course}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                知识点：{order.knowledgePoints.join(', ')}
                              </p>
                            </div>
                            <Badge variant={order.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                              {order.status === 'active' ? '进行中' : order.status === 'completed' ? '已完成' : '待开始'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* 无搜索结果提示 */}
                  {showDropdown && searchQuery.trim() && searchResults.length === 0 && (
                    <div className="absolute top-full left-0 right-0 z-50 bg-background border border-border rounded-md shadow-lg mt-1 p-4 text-center">
                      <p className="text-sm text-muted-foreground">未找到匹配的订单</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 选中的订单显示区域 */}
              <div>
                <label className="text-sm font-medium mb-2 block">已选择订单</label>
                {selectedOrder ? (
                  <Card className="border-primary/50 bg-primary/5">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <h4 className="font-medium">{selectedOrder.name}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            学生：{selectedOrder.student} | 课程：{selectedOrder.course}
                          </p>
                          <div className="text-sm">
                            <p className="font-medium mb-1">相关知识点：</p>
                            <ul className="text-muted-foreground space-y-1">
                              {selectedOrder.knowledgePoints.map((point, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <FileText className="w-3 h-3" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedOrder(null);
                            setSearchQuery("");
                            setShowDropdown(false);
                          }}
                        >
                          重新选择
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="border border-dashed border-border rounded-lg p-6 text-center text-muted-foreground">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>请先搜索并选择订单</p>
                  </div>
                )}
              </div>

              {/* 出题模式选择 */}
              <div>
                <label className="text-sm font-medium mb-3 block">出题模式</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card 
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      mode === 'fast' ? 'border-primary ring-2 ring-primary/20' : 'border-primary/20'
                    } ${!selectedOrder ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => selectedOrder && handleModeSelect('fast')}
                  >
                    <CardContent className="p-4 text-center">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium mb-1">快速出题模式</h3>
                      <p className="text-sm text-muted-foreground">AI自动分析课件，快速生成试卷</p>
                      {mode === 'fast' && (
                        <CheckCircle className="w-5 h-5 mx-auto mt-2 text-green-600" />
                      )}
                    </CardContent>
                  </Card>
                  <Card 
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      mode === 'detailed' ? 'border-primary ring-2 ring-primary/20' : 'border-primary/20'
                    } ${!selectedOrder ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => selectedOrder && handleModeSelect('detailed')}
                  >
                    <CardContent className="p-4 text-center">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium mb-1">精细化出题模式</h3>
                      <p className="text-sm text-muted-foreground">精准控制题目类型、难度和数量</p>
                      {mode === 'detailed' && (
                        <CheckCircle className="w-5 h-5 mx-auto mt-2 text-green-600" />
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {/* 开始生成按钮 */}
                {selectedOrder && (mode === 'fast' || mode === 'detailed') && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      已选择{mode === 'fast' ? '快速出题模式' : '精细化出题模式'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 右侧模块 */}
        <div className="space-y-6">
          {/* 最近试卷 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">最近试卷</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/quiz-list">查看全部</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teacherQuizzes.slice(0, 3).map((quiz) => (
                  <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-sm font-semibold text-foreground">{quiz.name}</h3>
                            {quiz.isCompleted ? (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">已答题</Badge>
                            ) : quiz.studentScore !== undefined ? (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">答题中</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">未答题</Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{quiz.createdAt.toLocaleDateString()}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{quiz.studentName}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              <span>{quiz.orderName}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              <span>{quiz.course}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              <span>{quiz.totalQuestions}题</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Zap className="h-3 w-3" />
                              <span>{quiz.totalScore}分</span>
                            </div>
                          </div>
                          
                          {quiz.isCompleted && quiz.studentScore !== undefined && (
                            <div className="mt-2 text-xs">
                              <span className="text-green-600 font-medium">
                                学生得分: {quiz.studentScore}/{quiz.totalScore}分
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-2 flex flex-col gap-1">
                          <Button asChild variant="outline" size="sm" className="text-xs h-7">
                            <Link to={`/quiz/${quiz.id}`}>查看详情</Link>
                          </Button>
                          <QuizActions quiz={quiz} compact />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {teacherQuizzes.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground">暂无试卷</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 我的收藏 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                我的收藏
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/favorites">查看全部</Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {user && getFavoriteQuizzes(user.id).filter(quiz => quiz.isFavorite).slice(0, 3).map((quiz) => (
                  <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-sm font-semibold text-foreground">{quiz.name}</h3>
                            {quiz.isCompleted ? (
                              <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">已答题</Badge>
                            ) : quiz.studentScore !== undefined ? (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">答题中</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs">未答题</Badge>
                            )}
                            <Heart className="w-3 h-3 text-red-500 fill-current" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{quiz.createdAt.toLocaleDateString()}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{quiz.studentName}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              <span>{quiz.orderName}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              <span>{quiz.course}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="ml-2 flex flex-col gap-1">
                          <Button asChild variant="outline" size="sm" className="text-xs h-7">
                            <Link to={`/quiz/${quiz.id}`}>查看详情</Link>
                          </Button>
                          <QuizActions quiz={quiz} compact />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {(!user || getFavoriteQuizzes(user.id).filter(quiz => quiz.isFavorite).length === 0) && (
                  <div className="text-center py-4">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground">暂无收藏试卷</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 答题统计 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="w-5 h-5" />
                答题统计
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={statsDimension} onValueChange={(value) => setStatsDimension(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="student" className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    按学生
                  </TabsTrigger>
                  <TabsTrigger value="order" className="flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    按订单
                  </TabsTrigger>
                  <TabsTrigger value="knowledge" className="flex items-center gap-1">
                    <Brain className="w-3 h-3" />
                    按知识点
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="student" className="space-y-4 mt-4">
                  {/* 学生搜索 */}
                  <div className="relative">
                    <Input
                      placeholder="搜索学生姓名"
                      value={studentSearchQuery}
                      onChange={(e) => setStudentSearchQuery(e.target.value)}
                      className="pr-8"
                    />
                    <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                  
                  {/* 学生选择 */}
                  {filteredStudents.length > 0 && (
                    <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择学生" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredStudents.map((student) => (
                          <SelectItem key={student} value={student}>
                            {student}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {/* 学生统计数据 */}
                  {selectedStudent && (() => {
                    const stats = getStudentStats(selectedStudent);
                    return (
                      <div className="space-y-4">
                        <div className="text-center border-b pb-2">
                          <h4 className="font-medium text-sm">{selectedStudent} 的答题统计</h4>
                        </div>
                        
                        {/* 完成率 */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">完成率</span>
                            <span className="font-medium">{stats.completionRate}%</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            已完成 {stats.completedQuizzes} / {stats.totalQuizzes} 份试卷
                          </div>
                        </div>
                        
                        {/* 正确率 */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">平均正确率</span>
                            <span className="font-medium text-green-600">{stats.averageAccuracy}%</span>
                          </div>
                        </div>
                        
                        {/* 薄弱知识点 */}
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">薄弱知识点 (错误率最高)</h5>
                          <div className="space-y-1">
                            {stats.weakKnowledgePoints.map((point, index) => (
                              <div key={index} className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">{point.name}</span>
                                <Badge variant="destructive" className="text-xs">
                                  {point.errorRate}%
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  
                  {!selectedStudent && (
                    <div className="text-center py-4">
                      <Users className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                      <p className="text-sm text-muted-foreground">请选择学生查看统计</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="order" className="space-y-4 mt-4">
                  {/* 订单搜索 */}
                  <div className="relative">
                    <Input
                      placeholder="请搜索订单号或学生姓名"
                      value={orderSearchQuery}
                      onChange={(e) => setOrderSearchQuery(e.target.value)}
                      className="pr-8"
                    />
                    <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                  
                  {/* 订单选择 */}
                  {filteredOrders.length > 0 && (
                    <Select value={selectedOrderForStats} onValueChange={setSelectedOrderForStats}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择订单" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredOrders.map((order) => (
                          <SelectItem key={order} value={order}>
                            {order}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  
                  {/* 订单统计数据 */}
                  {selectedOrderForStats && (() => {
                    const stats = getOrderStats(selectedOrderForStats);
                    return (
                      <div className="space-y-4">
                        <div className="text-center border-b pb-2">
                          <h4 className="font-medium text-sm">{selectedOrderForStats} 的答题统计</h4>
                        </div>
                        
                        {/* 完成率 */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">完成率</span>
                            <span className="font-medium">{stats.completionRate}%</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            已完成 {stats.completedQuizzes} / {stats.totalQuizzes} 份试卷
                          </div>
                        </div>
                        
                        {/* 正确率 */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">平均正确率</span>
                            <span className="font-medium text-green-600">{stats.averageAccuracy}%</span>
                          </div>
                        </div>
                        
                        {/* 薄弱知识点 */}
                        <div className="space-y-2">
                          <h5 className="text-sm font-medium">薄弱知识点 (错误率最高)</h5>
                          <div className="space-y-1">
                            {stats.weakKnowledgePoints.map((point, index) => (
                              <div key={index} className="flex justify-between items-center text-xs">
                                <span className="text-muted-foreground">{point.name}</span>
                                <Badge variant="destructive" className="text-xs">
                                  {point.errorRate}%
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                  
                  {!selectedOrderForStats && (
                    <div className="text-center py-4">
                      <Package className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                      <p className="text-sm text-muted-foreground">请选择订单查看统计</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="knowledge" className="space-y-4 mt-4">
                  <div className="space-y-6">
                    {/* 知识点错误率柱状图 */}
                    <div>
                      <h5 className="text-sm font-medium mb-3">知识点错误率 (前20个)</h5>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {[
                          { name: '二次函数', errorRate: 65 },
                          { name: '三角函数', errorRate: 58 },
                          { name: '立体几何', errorRate: 52 },
                          { name: '概率统计', errorRate: 48 },
                          { name: '数列问题', errorRate: 45 },
                          { name: '函数单调性', errorRate: 42 },
                          { name: '向量运算', errorRate: 38 },
                          { name: '圆锥曲线', errorRate: 35 },
                          { name: '导数应用', errorRate: 32 },
                          { name: '不等式', errorRate: 28 },
                          { name: '对数函数', errorRate: 25 },
                          { name: '排列组合', errorRate: 22 },
                          { name: '平面几何', errorRate: 20 },
                          { name: '指数函数', errorRate: 18 },
                          { name: '集合运算', errorRate: 15 }
                        ].map((point, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground w-16 text-right">
                              {point.name}
                            </span>
                            <div className="flex-1 flex items-center gap-2">
                              <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-red-500 to-orange-500" 
                                  style={{ width: `${point.errorRate}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-medium text-red-600 w-10">
                                {point.errorRate}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* 常考知识点词云 */}
                    <div>
                      <h5 className="text-sm font-medium mb-3">常考知识点 (按出现频次)</h5>
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg">
                        <div className="flex flex-wrap gap-2 justify-center">
                          {[
                            { name: '函数与方程', freq: 89, size: 'text-lg' },
                            { name: '几何图形', freq: 76, size: 'text-base' },
                            { name: '数据分析', freq: 68, size: 'text-sm' },
                            { name: '概率统计', freq: 65, size: 'text-sm' },
                            { name: '代数运算', freq: 58, size: 'text-xs' },
                            { name: '三角函数', freq: 52, size: 'text-xs' },
                            { name: '立体几何', freq: 45, size: 'text-xs' },
                            { name: '导数应用', freq: 42, size: 'text-xs' },
                            { name: '向量运算', freq: 38, size: 'text-xs' },
                            { name: '圆锥曲线', freq: 35, size: 'text-xs' },
                            { name: '数列问题', freq: 32, size: 'text-xs' },
                            { name: '不等式', freq: 28, size: 'text-xs' }
                          ].map((point, index) => (
                            <Badge 
                              key={index} 
                              variant="outline" 
                              className={`${point.size} font-medium transition-all hover:scale-110 cursor-pointer`}
                              style={{ 
                                backgroundColor: `hsl(${200 + index * 15}, 70%, ${90 - point.freq / 5}%)`,
                                borderColor: `hsl(${200 + index * 15}, 70%, ${70 - point.freq / 10}%)`
                              }}
                              title={`出现次数: ${point.freq}`}
                            >
                              {point.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;