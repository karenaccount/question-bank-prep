import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, FileText, Clock, BarChart3, CheckCircle } from "lucide-react";
import { mockOrders, Order } from "@/data/mockOrders";
import FastQuizMode from "./FastQuizMode";

const TeacherDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedMode, setSelectedMode] = useState<'fast' | 'detailed' | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFastMode, setShowFastMode] = useState(false);

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

  const handleModeSelect = (mode: 'fast' | 'detailed') => {
    setSelectedMode(mode);
    if (mode === 'fast') {
      setShowFastMode(true);
    }
  };

  const handleStartGenerating = () => {
    if (selectedOrder && selectedMode) {
      // 这里后续会连接到实际的出题逻辑
      alert(`开始为订单 ${selectedOrder.name} 生成试卷 (${selectedMode === 'fast' ? '快速模式' : '精细化模式'})`);
    }
  };

  const handleFastModeGenerate = (config: any) => {
    console.log('生成试卷配置:', config);
    alert(`开始生成${config.scenario.name}试卷，题目数量：${config.config.questionCount}题`);
    setShowFastMode(false);
  };

  const handleBackFromFastMode = () => {
    setShowFastMode(false);
    setSelectedMode(null);
  };

  // 如果显示快速模式界面
  if (showFastMode && selectedOrder) {
    return (
      <div className="container mx-auto px-4 py-8">
        <FastQuizMode
          order={selectedOrder}
          onBack={handleBackFromFastMode}
          onGenerate={handleFastModeGenerate}
        />
      </div>
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
                      selectedMode === 'fast' ? 'border-primary ring-2 ring-primary/20' : 'border-primary/20'
                    } ${!selectedOrder ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => selectedOrder && handleModeSelect('fast')}
                  >
                    <CardContent className="p-4 text-center">
                      <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium mb-1">快速出题模式</h3>
                      <p className="text-sm text-muted-foreground">AI自动分析课件，快速生成试卷</p>
                      {selectedMode === 'fast' && (
                        <CheckCircle className="w-5 h-5 mx-auto mt-2 text-green-600" />
                      )}
                    </CardContent>
                  </Card>
                  <Card 
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      selectedMode === 'detailed' ? 'border-primary ring-2 ring-primary/20' : 'border-primary/20'
                    } ${!selectedOrder ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => selectedOrder && handleModeSelect('detailed')}
                  >
                    <CardContent className="p-4 text-center">
                      <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <h3 className="font-medium mb-1">精细化出题模式</h3>
                      <p className="text-sm text-muted-foreground">精准控制题目类型、难度和数量</p>
                      {selectedMode === 'detailed' && (
                        <CheckCircle className="w-5 h-5 mx-auto mt-2 text-green-600" />
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                {/* 开始生成按钮 */}
                {selectedOrder && selectedMode && (
                  <div className="mt-4 text-center">
                    <Button onClick={handleStartGenerating} size="lg" className="gap-2">
                      <Plus className="w-4 h-4" />
                      开始生成试卷
                    </Button>
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