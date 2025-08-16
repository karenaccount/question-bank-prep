import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Search, Plus, FileText, Clock, BarChart3, CheckCircle, User, Package, BookOpen, GraduationCap, Zap } from "lucide-react";
import { mockOrders, Order } from "@/data/mockOrders";
import FastQuizMode from "./FastQuizMode";
import DetailedQuizMode from "./DetailedQuizMode";
import QuizGeneration from "./QuizGeneration";
import QuizEditor from "./QuizEditor";
import { useQuiz } from "@/contexts/QuizContext";
import { useAuth } from "@/contexts/AuthContext";

const TeacherDashboard = () => {
  const { saveQuiz, getQuizzesByTeacher } = useQuiz();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [mode, setMode] = useState<'selection' | 'fast' | 'detailed' | 'generating' | 'editing'>('selection');
  const [showDropdown, setShowDropdown] = useState(false);
  const [quizConfig, setQuizConfig] = useState<any>(null);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);
  
  const teacherQuizzes = user ? getQuizzesByTeacher(user.id) : [];

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
          {/* 试卷管理 */}
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
                        
                        <div className="ml-2">
                          <Button asChild variant="outline" size="sm" className="text-xs h-7">
                            <Link to={`/quiz/${quiz.id}`}>查看详情</Link>
                          </Button>
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

          {/* 答题统计 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <BarChart3 className="w-5 h-5" />
                答题统计
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">12</div>
                  <div className="text-sm text-muted-foreground">本周生成试卷</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <div className="text-sm text-muted-foreground">已完成答题</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">85%</div>
                  <div className="text-sm text-muted-foreground">平均正确率</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;