import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { FileText, Clock, CheckCircle, XCircle, Play, Package, BookOpen, GraduationCap, Zap } from "lucide-react";
import { useQuiz } from "@/contexts/QuizContext";
import { useAuth } from "@/contexts/AuthContext";

const StudentDashboard = () => {
  const { getQuizzesByStudent } = useQuiz();
  const { user } = useAuth();
  
  // Mock student ID - in real app this would come from user context
  const studentQuizzes = user ? getQuizzesByStudent('student-1') : [];

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

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
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
                    
                    <div className="flex gap-2 ml-4">
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
    </div>
  );
};

export default StudentDashboard;