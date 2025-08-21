import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Plus, Search, X } from "lucide-react";
import { Order, LectureNote } from "@/data/mockOrders";

interface KnowledgePointSelectorProps {
  order: Order;
  selectedPoints: string[];
  onChange: (points: string[]) => void;
}

const KnowledgePointSelector = ({ order, selectedPoints, onChange }: KnowledgePointSelectorProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [customPoints, setCustomPoints] = useState<string[]>([]);
  const [pendingPoints, setPendingPoints] = useState<string[]>([]);

  const getAllKnowledgePoints = () => {
    const lecturePoints = order.lectureNotes.flatMap(note => note.knowledgePoints);
    return [...lecturePoints, ...customPoints];
  };

  // 预置的知识点数据
  const presetKnowledgePoints = ["知识点111", "知识点222", "知识点333"];
  
  // 模拟搜索结果
  const getSearchResults = () => {
    if (!searchQuery.trim()) return presetKnowledgePoints;
    
    const query = searchQuery.toLowerCase();
    return presetKnowledgePoints.filter(point => 
      point.toLowerCase().includes(query)
    );
  };

  const handlePointToggle = (point: string) => {
    if (selectedPoints.includes(point)) {
      onChange(selectedPoints.filter(p => p !== point));
    } else {
      onChange([...selectedPoints, point]);
    }
  };

  const handleTogglePendingPoint = (point: string) => {
    if (pendingPoints.includes(point)) {
      setPendingPoints(pendingPoints.filter(p => p !== point));
    } else {
      setPendingPoints([...pendingPoints, point]);
    }
  };

  const handleAddPendingPoints = () => {
    const newCustomPoints = pendingPoints.filter(point => !customPoints.includes(point));
    setCustomPoints([...customPoints, ...newCustomPoints]);
    onChange([...selectedPoints, ...newCustomPoints]);
    setPendingPoints([]);
    setShowAddDialog(false);
    setSearchQuery("");
  };

  const handleRemoveCustomPoint = (point: string) => {
    setCustomPoints(customPoints.filter(p => p !== point));
    onChange(selectedPoints.filter(p => p !== point));
  };

  return (
    <div className="space-y-4">
      {/* Lecture Notes 知识点 */}
      <div className="space-y-3">
        {order.lectureNotes.map((lectureNote) => (
          <Card key={lectureNote.id} className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">{lectureNote.name}</span>
                <Badge variant="secondary" className="text-xs">PDF</Badge>
              </div>
              <div className="space-y-2">
                {lectureNote.knowledgePoints.map((point) => (
                  <label key={point} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={selectedPoints.includes(point)}
                      onCheckedChange={() => handlePointToggle(point)}
                    />
                    <span className="text-sm">{point}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 自定义知识点 */}
      {customPoints.length > 0 && (
        <Card className="border-dashed border-primary/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">手动添加的知识点</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="space-y-2">
              {customPoints.map((point) => (
                <div key={point} className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer flex-1">
                    <Checkbox
                      checked={selectedPoints.includes(point)}
                      onCheckedChange={() => handlePointToggle(point)}
                    />
                    <span className="text-sm">{point}</span>
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCustomPoint(point)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 添加知识点按钮 */}
      <Button
        variant="outline"
        onClick={() => setShowAddDialog(true)}
        className="w-full gap-2"
      >
        <Plus className="w-4 h-4" />
        手动添加知识点
      </Button>

      {/* 添加知识点对话框 */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>添加知识点</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="输入关键词搜索知识点..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              
              {/* 下拉搜索结果 */}
              {searchQuery.trim() && getSearchResults().length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-40 overflow-y-auto">
                  {getSearchResults().map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer"
                      onClick={() => handleTogglePendingPoint(result)}
                    >
                      <Checkbox
                        checked={pendingPoints.includes(result)}
                        onCheckedChange={() => handleTogglePendingPoint(result)}
                      />
                      <span className="text-sm flex-1">{result}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {pendingPoints.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">待添加知识点：</p>
                <div className="bg-muted/50 rounded p-2 space-y-1">
                  {pendingPoints.map((point, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{point}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTogglePendingPoint(point)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => {
                setShowAddDialog(false);
                setPendingPoints([]);
                setSearchQuery("");
              }} className="flex-1">
                取消
              </Button>
              <Button
                onClick={handleAddPendingPoints}
                disabled={pendingPoints.length === 0}
                className="flex-1"
              >
                添加 ({pendingPoints.length})
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KnowledgePointSelector;