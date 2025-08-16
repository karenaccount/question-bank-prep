import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuiz } from "@/contexts/QuizContext";
import { mockOrders, Order } from "@/data/mockOrders";
import { Search } from "lucide-react";

interface AddToOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: any;
}

const AddToOrderDialog = ({ open, onOpenChange, quiz }: AddToOrderDialogProps) => {
  const { duplicateQuizToOrder } = useQuiz();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [quizName, setQuizName] = useState("");

  const filteredOrders = searchQuery.trim() 
    ? mockOrders.filter(order => 
        order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.course.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    setSearchQuery(order.name);
    setShowDropdown(false);
  };

  const handleAdd = () => {
    if (!selectedOrder || !quizName.trim()) return;

    duplicateQuizToOrder(quiz.id, selectedOrder, quizName.trim());
    toast({
      title: "试卷已添加",
      description: `试卷"${quizName}"已成功添加到订单"${selectedOrder.name}"`,
    });
    onOpenChange(false);
    setSelectedOrder(null);
    setSearchQuery("");
    setQuizName("");
  };

  const resetDialog = () => {
    setSelectedOrder(null);
    setSearchQuery("");
    setQuizName("");
    setShowDropdown(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen);
      if (!isOpen) resetDialog();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>添加到其他订单</DialogTitle>
          <DialogDescription>
            选择要添加试卷的订单并输入试卷名称，系统将为该订单创建一份新的试卷副本。
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Label htmlFor="search">搜索订单</Label>
            <div className="relative">
              <Input
                id="search"
                placeholder="输入订单名称、学生姓名或课程名称"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(e.target.value.trim().length > 0);
                }}
                onFocus={() => searchQuery.trim() && setShowDropdown(true)}
                onBlur={(e) => {
                  // Delay hiding dropdown to allow clicking on items
                  setTimeout(() => {
                    if (!e.currentTarget.contains(document.activeElement)) {
                      setShowDropdown(false);
                    }
                  }, 200);
                }}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              
              {/* Search results dropdown */}
              {showDropdown && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 z-50 bg-background border border-border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0"
                        onClick={() => handleOrderSelect(order)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm">{order.name}</h4>
                            <p className="text-xs text-muted-foreground">{order.student} - {order.course}</p>
                          </div>
                          <Badge variant={order.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                            {order.status === 'active' ? '进行中' : order.status === 'completed' ? '已完成' : '待开始'}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-sm text-muted-foreground">未找到匹配的订单</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {selectedOrder && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">选中的订单：</p>
              <p className="text-sm text-muted-foreground">
                {selectedOrder.name} - {selectedOrder.student} ({selectedOrder.course})
              </p>
            </div>
          )}

          <div>
            <Label htmlFor="quizName">试卷名称</Label>
            <Input
              id="quizName"
              placeholder="请输入试卷名称"
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              disabled={!selectedOrder}
            />
            {selectedOrder && !quizName.trim() && (
              <p className="text-xs text-muted-foreground mt-1">
                请输入试卷名称
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleAdd} disabled={!selectedOrder || !quizName.trim()}>
            添加试卷
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToOrderDialog;