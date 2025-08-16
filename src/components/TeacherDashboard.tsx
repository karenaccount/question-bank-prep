import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, FileText, Clock, BarChart3 } from "lucide-react";

const TeacherDashboard = () => {
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
              <div>
                <label className="text-sm font-medium mb-2 block">搜索订单</label>
                <div className="flex gap-2">
                  <Input placeholder="输入订单号或学生姓名" className="flex-1" />
                  <Button className="gap-2">
                    <Search className="w-4 h-4" />
                    搜索
                  </Button>
                </div>
              </div>

              {/* 订单选择区域 */}
              <div>
                <label className="text-sm font-medium mb-2 block">选择订单</label>
                <div className="border border-dashed border-border rounded-lg p-6 text-center text-muted-foreground">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>请先搜索并选择订单</p>
                </div>
              </div>

              {/* 出题模式选择 */}
              <div>
                <label className="text-sm font-medium mb-3 block">出题模式</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="cursor-pointer hover:shadow-md transition-shadow border-primary/20">
                    <CardContent className="p-4 text-center">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium mb-1">快速出题模式</h3>
                      <p className="text-sm text-muted-foreground">AI自动分析课件，快速生成试卷</p>
                    </CardContent>
                  </Card>
                  <Card className="cursor-pointer hover:shadow-md transition-shadow border-primary/20">
                    <CardContent className="p-4 text-center">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium mb-1">精细化出题模式</h3>
                      <p className="text-sm text-muted-foreground">精准控制题目类型、难度和数量</p>
                    </CardContent>
                  </Card>
                </div>
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
              <Button variant="ghost" size="sm">查看全部</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border rounded-lg p-3">
                    <h4 className="font-medium text-sm">第{i}单元测试卷</h4>
                    <p className="text-xs text-muted-foreground">订单：张同学数学辅导</p>
                    <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                      <span>10题</span>
                      <span>1小时前</span>
                    </div>
                  </div>
                ))}
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