import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { FileText, Clock, CheckCircle, XCircle, Play, Package, BookOpen, GraduationCap, Zap, AlertCircle, Calendar, Trash2, BarChart3, Search, Users, Brain } from "lucide-react";
import QuizActions from "./QuizActions";
import { useQuiz } from "@/contexts/QuizContext";
import { useAuth } from "@/contexts/AuthContext";

const StudentDashboard = () => {
  const { getQuizzesByStudent, wrongAnswers, removeFromWrongAnswers } = useQuiz();
  const { user } = useAuth();
  
  // Mock student ID - in real app this would come from user context
  const studentQuizzes = user ? getQuizzesByStudent('student-1') : [];
  const userWrongAnswers = wrongAnswers.filter(item => item.userId === user?.id);
  
  // 统计功能状态
  const [statsDimension, setStatsDimension] = useState<'student' | 'order' | 'knowledge'>('student');
  const [selectedOrderForStats, setSelectedOrderForStats] = useState<string>('');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  
  // 获取所有订单
  const allOrders = Array.from(new Set(studentQuizzes.map(quiz => quiz.orderName)));
  const filteredOrders = allOrders.filter(order => 
    order.toLowerCase().includes(orderSearchQuery.toLowerCase())
  );
  
  // 计算订单统计数据
  const getOrderStats = (orderName: string) => {
    const orderQuizzes = studentQuizzes.filter(quiz => quiz.orderName === orderName);
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

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}分钟前`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}小时前`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}天前`;
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

  const handleRemoveFromWrongAnswers = (questionId: string) => {
    removeFromWrongAnswers(questionId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 我的试卷 */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-6 h-6" />
              我的试卷
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/quiz-list">查看全部</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentQuizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{quiz.name}</h3>
                        {quiz.isCompleted ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">已答题</Badge>
                        ) : quiz.studentScore !== undefined ? (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">答题中</Badge>
                        ) : (
                          <Badge variant="outline">未答题</Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{quiz.createdAt.toLocaleDateString()}</span>
                        </div>
                        
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
                    
                    <div className="flex flex-col gap-2 ml-4">
                      {quiz.isCompleted ? (
                        <Button asChild variant="outline" size="sm">
                          <Link to={`/quiz/${quiz.id}`}>查看详情</Link>
                        </Button>
                      ) : (
                        <Button asChild size="sm" className="gap-2">
                          <Link to={`/quiz/${quiz.id}`}>
                            <Play className="w-4 h-4" />
                            开始答题
                          </Link>
                        </Button>
                      )}
                      <QuizActions quiz={quiz} compact />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 空状态 */}
          {studentQuizzes.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">暂无试卷</h3>
              <p className="text-muted-foreground">请等待老师为您分配试卷</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 错题本 */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-6 h-6" />
              错题本
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/wrong-answers">查看全部</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userWrongAnswers.slice(0, 3).map((wrongAnswer) => (
              <Card key={wrongAnswer.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline">
                          {getQuestionTypeLabel(wrongAnswer.question.type)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {wrongAnswer.quizName}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{wrongAnswer.addedAt.toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>{wrongAnswer.subject}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span>{wrongAnswer.course}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          <span>{wrongAnswer.scenarioType}</span>
                        </div>
                      </div>
                      
                      <div className="text-sm">
                        <p className="text-foreground font-medium mb-1">题目：</p>
                        <p className="text-muted-foreground line-clamp-2">{wrongAnswer.question.content}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRemoveFromWrongAnswers(wrongAnswer.questionId)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {userWrongAnswers.length === 0 && (
              <div className="text-center py-4">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500 opacity-50" />
                <p className="text-sm text-muted-foreground">暂无错题，继续保持！</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 答题统计 */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
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
              <div className="space-y-4">
                <div className="text-center border-b pb-2">
                  <h4 className="font-medium text-sm">我的答题统计</h4>
                </div>
                
                {/* 完成率 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">完成率</span>
                    <span className="font-medium">
                      {studentQuizzes.length > 0 ? Math.round((studentQuizzes.filter(q => q.isCompleted).length / studentQuizzes.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    已完成 {studentQuizzes.filter(q => q.isCompleted).length} / {studentQuizzes.length} 份试卷
                  </div>
                </div>
                
                {/* 正确率 */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">平均正确率</span>
                    <span className="font-medium text-green-600">85%</span>
                  </div>
                </div>
                
                {/* 薄弱知识点 */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">薄弱知识点 (错误率最高)</h5>
                  <div className="space-y-1">
                    {[
                      { name: '函数与方程', errorRate: 45 },
                      { name: '几何图形', errorRate: 38 },
                      { name: '数据分析', errorRate: 32 },
                      { name: '概率统计', errorRate: 28 },
                      { name: '代数运算', errorRate: 25 }
                    ].map((point, index) => (
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
            </TabsContent>
            
            <TabsContent value="order" className="space-y-4 mt-4">
              {/* 订单搜索 */}
              <div className="relative">
                <Input
                  placeholder="搜索订单号"
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
  );
};

export default StudentDashboard;