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

  // 模拟搜索结果
  const searchResults = searchQuery.trim() ? [
    `${searchQuery} - 基础概念`,
    `${searchQuery} - 应用技巧`,
    `${searchQuery} - 实践方法`,
  ].filter(point => !getAllKnowledgePoints().includes(point)) : [];

  const getAllKnowledgePoints = () => {
    const lecturePoints = order.lectureNotes.flatMap(note => note.knowledgePoints);
    return [...lecturePoints, ...customPoints];
  };

  const handlePointToggle = (point: string) => {
    if (selectedPoints.includes(point)) {
      onChange(selectedPoints.filter(p => p !== point));
    } else {
      onChange([...selectedPoints, point]);
    }
  };

  const handleAddCustomPoints = (points: string[]) => {
    const newCustomPoints = points.filter(point => !customPoints.includes(point));
    setCustomPoints([...customPoints, ...newCustomPoints]);
    onChange([...selectedPoints, ...newCustomPoints]);
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
            </div>
            
            {searchResults.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">搜索结果：</p>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                      onClick={() => handleAddCustomPoints([result])}
                    >
                      <span className="text-sm">{result}</span>
                      <Plus className="w-4 h-4" />
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddCustomPoints(searchResults)}
                  className="w-full"
                >
                  添加全部搜索结果
                </Button>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                取消
              </Button>
              <Button
                onClick={() => {
                  if (searchQuery.trim()) {
                    handleAddCustomPoints([searchQuery.trim()]);
                  }
                }}
                disabled={!searchQuery.trim()}
                className="flex-1"
              >
                直接添加
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KnowledgePointSelector;