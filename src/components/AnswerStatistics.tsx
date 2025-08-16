import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BarChart3, Users, Package, Brain } from "lucide-react";
import { useQuiz } from "@/contexts/QuizContext";
import { useAuth } from "@/contexts/AuthContext";

const AnswerStatistics = () => {
  const { getQuizzesByTeacher, getQuizzesByStudent } = useQuiz();
  const { user } = useAuth();
  
  // 答题统计相关状态
  const [statsDimension, setStatsDimension] = useState<'student' | 'order' | 'knowledge'>('student');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [selectedOrderForStats, setSelectedOrderForStats] = useState<string>('');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  
  const quizzes = user?.role === 'teacher' 
    ? getQuizzesByTeacher(user.id) 
    : getQuizzesByStudent('student-1');
  
  // 获取所有学生名单
  const allStudents = Array.from(new Set(quizzes.map(quiz => quiz.studentName)));
  const filteredStudents = allStudents.filter(student => 
    student.toLowerCase().includes(studentSearchQuery.toLowerCase())
  );
  
  // 获取所有订单
  const allOrders = Array.from(new Set(quizzes.map(quiz => quiz.orderName)));
  const filteredOrders = allOrders.filter(order => 
    order.toLowerCase().includes(orderSearchQuery.toLowerCase())
  );
  
  // 计算学生统计数据
  const getStudentStats = (studentName: string) => {
    const studentQuizzes = quizzes.filter(quiz => quiz.studentName === studentName);
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
    const orderQuizzes = quizzes.filter(quiz => quiz.orderName === orderName);
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

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
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
              {user?.role === 'teacher' ? (
                <div className="space-y-4">
                  {/* 学生搜索 */}
                  <div className="relative">
                    <Input
                      placeholder="请搜索学生姓名"
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
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center border-b pb-2">
                    <h4 className="font-medium text-sm">我的答题统计</h4>
                  </div>
                  
                  {/* 完成率 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">完成率</span>
                      <span className="font-medium">
                        {quizzes.length > 0 ? Math.round((quizzes.filter(q => q.isCompleted).length / quizzes.length) * 100) : 0}%
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      已完成 {quizzes.filter(q => q.isCompleted).length} / {quizzes.length} 份试卷
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
            </TabsContent>
            
            <TabsContent value="knowledge" className="space-y-4 mt-4">
              <div className="text-center py-8">
                <Brain className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">知识点统计</h3>
                <p className="text-muted-foreground">该功能正在开发中，敬请期待</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnswerStatistics;