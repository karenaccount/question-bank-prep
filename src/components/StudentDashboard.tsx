import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Clock, CheckCircle, XCircle, Play } from "lucide-react";

const StudentDashboard = () => {
  const papers = [
    {
      id: 1,
      name: "第一单元测试卷",
      order: "数学基础课程",
      questions: 15,
      time: "2小时前",
      completed: false,
      score: null
    },
    {
      id: 2,
      name: "代数运算练习卷",
      order: "数学基础课程", 
      questions: 12,
      time: "1天前",
      completed: true,
      score: 88
    },
    {
      id: 3,
      name: "几何图形测试卷",
      order: "数学基础课程",
      questions: 20,
      time: "3天前",
      completed: true,
      score: 92
    },
    {
      id: 4,
      name: "函数应用练习卷",
      order: "数学基础课程",
      questions: 10,
      time: "5天前",
      completed: false,
      score: null
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
            我的试卷
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {papers.map((paper) => (
              <Card key={paper.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* 试卷标题和状态 */}
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-lg leading-tight">{paper.name}</h3>
                      {paper.completed ? (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          已完成
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="w-3 h-3 mr-1" />
                          未完成
                        </Badge>
                      )}
                    </div>

                    {/* 试卷信息 */}
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>所属订单：{paper.order}</p>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {paper.questions}题
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {paper.time}
                        </span>
                      </div>
                    </div>

                    {/* 分数显示 */}
                    {paper.completed && paper.score && (
                      <div className="text-center py-2">
                        <div className="text-2xl font-bold text-primary">{paper.score}分</div>
                        <div className="text-sm text-muted-foreground">本次得分</div>
                      </div>
                    )}

                    {/* 操作按钮 */}
                    <div className="pt-2">
                      {paper.completed ? (
                        <Button variant="outline" className="w-full">
                          查看详情
                        </Button>
                      ) : (
                        <Button className="w-full gap-2">
                          <Play className="w-4 h-4" />
                          开始答题
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 空状态 */}
          {papers.length === 0 && (
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