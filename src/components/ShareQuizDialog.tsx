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
import { useToast } from "@/hooks/use-toast";
import { Copy, Share2, QrCode } from "lucide-react";

interface ShareQuizDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: any;
}

const ShareQuizDialog = ({ open, onOpenChange, quiz }: ShareQuizDialogProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  // Generate a unique share link for the quiz
  const shareLink = `${window.location.origin}/quiz/${quiz.id}/answer?token=${btoa(quiz.id + quiz.assignedTo)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      toast({
        title: "链接已复制",
        description: "专属答题链接已复制到剪贴板",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "复制失败",
        description: "请手动复制链接",
        variant: "destructive",
      });
    }
  };

  const handleShareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `试卷：${quiz.name}`,
          text: `请点击链接完成试卷答题`,
          url: shareLink,
        });
      } catch (err) {
        // User cancelled share or share failed
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            分享试卷给学生
          </DialogTitle>
          <DialogDescription>
            生成专属链接发送给学生 "{quiz.studentName}"，学生需要以正确的账号登录才能答题。
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="share-link">专属答题链接</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="share-link"
                value={shareLink}
                readOnly
                className="flex-1"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleCopyLink}
                className="px-3"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            {copied && (
              <p className="text-sm text-green-600 mt-1">已复制到剪贴板！</p>
            )}
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>使用说明：</strong>
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• 学生必须先登录对应的学生账号</li>
              <li>• 只有指定的学生才能打开此链接</li>
              <li>• 链接可重复使用，直到试卷完成</li>
            </ul>
          </div>

          <div className="flex items-center justify-center p-4 border-2 border-dashed border-muted rounded-lg">
            <div className="text-center">
              <QrCode className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">二维码功能即将上线</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            关闭
          </Button>
          {navigator.share && (
            <Button onClick={handleShareNative}>
              <Share2 className="h-4 w-4 mr-2" />
              分享链接
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareQuizDialog;