import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BarChart3, Users, Package, Brain, TrendingUp, ChevronDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuiz } from "@/contexts/QuizContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const AnswerStatistics = () => {
  const { getQuizzesByTeacher, getQuizzesByStudent } = useQuiz();
  const { user } = useAuth();
  
  // 答题统计相关状态
  const [statsDimension, setStatsDimension] = useState<'student' | 'order' | 'knowledge'>('knowledge');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [selectedOrderForStats, setSelectedOrderForStats] = useState<string>('');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);
  const [showOrderDropdown, setShowOrderDropdown] = useState(false);
  const studentDropdownRef = useRef<HTMLDivElement>(null);
  const orderDropdownRef = useRef<HTMLDivElement>(null);
  
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
  
  // 模拟知识点错误率数据
  const knowledgeErrorData = [
    { name: '函数与方程', errorRate: 45, totalQuestions: 120 },
    { name: '几何图形', errorRate: 38, totalQuestions: 95 },
    { name: '数据分析', errorRate: 35, totalQuestions: 88 },
    { name: '概率统计', errorRate: 32, totalQuestions: 76 },
    { name: '代数运算', errorRate: 28, totalQuestions: 102 },
    { name: '三角函数', errorRate: 25, totalQuestions: 65 },
    { name: '立体几何', errorRate: 23, totalQuestions: 54 },
    { name: '数列', errorRate: 22, totalQuestions: 43 },
    { name: '不等式', errorRate: 20, totalQuestions: 38 },
    { name: '圆锥曲线', errorRate: 18, totalQuestions: 32 },
    { name: '导数应用', errorRate: 17, totalQuestions: 29 },
    { name: '向量运算', errorRate: 15, totalQuestions: 25 },
    { name: '排列组合', errorRate: 14, totalQuestions: 22 },
    { name: '复数', errorRate: 12, totalQuestions: 18 },
    { name: '集合运算', errorRate: 10, totalQuestions: 15 },
    { name: '逻辑推理', errorRate: 9, totalQuestions: 12 },
    { name: '平面几何', errorRate: 8, totalQuestions: 10 },
    { name: '指数对数', errorRate: 7, totalQuestions: 8 },
    { name: '二项式定理', errorRate: 6, totalQuestions: 6 },
    { name: '极限', errorRate: 5, totalQuestions: 4 }
  ];
  
  // 模拟常考知识点数据（词云样式）
  const frequentKnowledgeData = [
    { name: '函数与方程', count: 120, size: 'text-2xl' },
    { name: '代数运算', count: 102, size: 'text-xl' },
    { name: '几何图形', count: 95, size: 'text-xl' },
    { name: '数据分析', count: 88, size: 'text-lg' },
    { name: '概率统计', count: 76, size: 'text-lg' },
    { name: '三角函数', count: 65, size: 'text-base' },
    { name: '立体几何', count: 54, size: 'text-base' },
    { name: '数列', count: 43, size: 'text-sm' },
    { name: '不等式', count: 38, size: 'text-sm' },
    { name: '圆锥曲线', count: 32, size: 'text-sm' },
    { name: '导数应用', count: 29, size: 'text-xs' },
    { name: '向量运算', count: 25, size: 'text-xs' },
    { name: '排列组合', count: 22, size: 'text-xs' },
    { name: '复数', count: 18, size: 'text-xs' },
    { name: '集合运算', count: 15, size: 'text-xs' },
    { name: '逻辑推理', count: 12, size: 'text-xs' },
    { name: '平面几何', count: 10, size: 'text-xs' },
    { name: '指数对数', count: 8, size: 'text-xs' },
    { name: '二项式定理', count: 6, size: 'text-xs' },
    { name: '极限', count: 4, size: 'text-xs' }
  ];
  
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (studentDropdownRef.current && !studentDropdownRef.current.contains(event.target as Node)) {
        setShowStudentDropdown(false);
      }
      if (orderDropdownRef.current && !orderDropdownRef.current.contains(event.target as Node)) {
        setShowOrderDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleStudentSelect = (student: string) => {
    setSelectedStudent(student);
    setStudentSearchQuery(student);
    setShowStudentDropdown(false);
  };

  const handleOrderSelect = (order: string) => {
    setSelectedOrderForStats(order);
    setOrderSearchQuery(order);
    setShowOrderDropdown(false);
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
              <TabsTrigger value="knowledge" className="flex items-center gap-1">
                <Brain className="w-3 h-3" />
                按知识点
              </TabsTrigger>
              <TabsTrigger value="student" className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                按学生
              </TabsTrigger>
              <TabsTrigger value="order" className="flex items-center gap-1">
                <Package className="w-3 h-3" />
                按订单
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="knowledge" className="space-y-6 mt-4">
              <div className="space-y-6">
                {/* 知识点错误率柱状图 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      知识点错误率分析
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={knowledgeErrorData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="name" 
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            fontSize={12}
                          />
                          <YAxis 
                            label={{ value: '错误率 (%)', angle: -90, position: 'insideLeft' }}
                          />
                          <Tooltip 
                            formatter={(value, name) => [`${value}%`, '错误率']}
                            labelFormatter={(label) => `知识点: ${label}`}
                          />
                          <Bar 
                            dataKey="errorRate" 
                            fill="hsl(var(--destructive))"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* 常考知识点词云 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5" />
                      常考知识点分布
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="min-h-60 p-6 bg-muted/30 rounded-lg">
                      <div className="flex flex-wrap justify-center items-center gap-3 leading-relaxed">
                        {frequentKnowledgeData.map((item, index) => {
                          const colors = [
                            'text-blue-600', 'text-green-600', 'text-purple-600', 
                            'text-red-600', 'text-yellow-600', 'text-indigo-600',
                            'text-pink-600', 'text-teal-600', 'text-orange-600',
                            'text-cyan-600'
                          ];
                          const randomColor = colors[index % colors.length];
                          
                          return (
                            <span
                              key={item.name}
                              className={`${item.size} ${randomColor} font-medium hover:scale-110 transition-transform cursor-pointer inline-block mx-1 my-1`}
                              title={`出现 ${item.count} 次`}
                              style={{
                                fontWeight: Math.min(800, 400 + Math.floor(item.count / 10) * 100)
                              }}
                            >
                              {item.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-muted-foreground text-center">
                      * 字体大小代表出现频次，点击查看具体次数
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="student" className="space-y-4 mt-4">
              {user?.role === 'teacher' ? (
                <div className="space-y-4">
                  {/* 学生搜索下拉框 */}
                  <div className="relative" ref={studentDropdownRef}>
                    <div className="relative">
                      <Input
                        placeholder="搜索学生姓名..."
                        value={studentSearchQuery}
                        onChange={(e) => {
                          setStudentSearchQuery(e.target.value);
                          setShowStudentDropdown(true);
                        }}
                        onFocus={() => setShowStudentDropdown(true)}
                        className="pr-8"
                      />
                      <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    </div>
                    
                    {/* Student Dropdown */}
                    {showStudentDropdown && filteredStudents.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                        {filteredStudents.map((student) => (
                          <div
                            key={student}
                            className="px-4 py-2 hover:bg-muted cursor-pointer text-sm"
                            onClick={() => handleStudentSelect(student)}
                          >
                            {student}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
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
              {/* 订单搜索下拉框 */}
              <div className="relative" ref={orderDropdownRef}>
                <div className="relative">
                  <Input
                    placeholder="搜索订单号..."
                    value={orderSearchQuery}
                    onChange={(e) => {
                      setOrderSearchQuery(e.target.value);
                      setShowOrderDropdown(true);
                    }}
                    onFocus={() => setShowOrderDropdown(true)}
                    className="pr-8"
                  />
                  <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                </div>
                
                {/* Order Dropdown */}
                {showOrderDropdown && filteredOrders.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                    {filteredOrders.map((order) => (
                      <div
                        key={order}
                        className="px-4 py-2 hover:bg-muted cursor-pointer text-sm"
                        onClick={() => handleOrderSelect(order)}
                      >
                        {order}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
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
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnswerStatistics;