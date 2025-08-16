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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuiz } from "@/contexts/QuizContext";
import { mockOrders } from "@/data/mockOrders";
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
  const [selectedOrder, setSelectedOrder] = useState("");

  const filteredOrders = mockOrders.filter(order => 
    order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    const order = mockOrders.find(o => o.id === selectedOrder);
    if (!order) return;

    duplicateQuizToOrder(quiz.id, order);
    toast({
      title: "试卷已添加",
      description: `试卷已成功添加到订单 "${order.name}"`,
    });
    onOpenChange(false);
    setSelectedOrder("");
    setSearchQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>添加到其他订单</DialogTitle>
          <DialogDescription>
            选择要添加试卷的订单，系统将为该订单创建一份新的试卷副本。
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="search">搜索订单</Label>
            <div className="relative">
              <Input
                id="search"
                placeholder="输入订单名称、学生姓名或课程名称"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>
          </div>

          <div>
            <Label htmlFor="order">选择订单</Label>
            <Select value={selectedOrder} onValueChange={setSelectedOrder}>
              <SelectTrigger>
                <SelectValue placeholder="请选择订单" />
              </SelectTrigger>
              <SelectContent>
                {filteredOrders.map((order) => (
                  <SelectItem key={order.id} value={order.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{order.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {order.student} - {order.course}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedOrder && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium">即将添加到：</p>
              <p className="text-sm text-muted-foreground">
                {filteredOrders.find(o => o.id === selectedOrder)?.name}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleAdd} disabled={!selectedOrder}>
            添加试卷
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddToOrderDialog;