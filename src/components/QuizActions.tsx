import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuiz } from "@/contexts/QuizContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  MoreVertical,
  Edit,
  Trash2,
  Heart,
  HeartOff,
  Share2,
  Copy,
  Play,
  BookOpen,
} from "lucide-react";
import AddToOrderDialog from "./AddToOrderDialog";
import ShareQuizDialog from "./ShareQuizDialog";

interface QuizActionsProps {
  quiz: any;
  onEdit?: () => void;
}

const QuizActions = ({ quiz, onEdit }: QuizActionsProps) => {
  const { user } = useAuth();
  const { deleteQuiz, toggleFavorite, addToWrongAnswers } = useQuiz();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddToOrderDialog, setShowAddToOrderDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';
  const canAnswer = isStudent && (!quiz.isCompleted || quiz.studentScore === undefined);

  const handleDelete = () => {
    deleteQuiz(quiz.id);
    toast({
      title: "试卷已删除",
      description: "试卷及相关答题数据已被删除",
    });
    navigate('/quiz-list');
  };

  const handleToggleFavorite = () => {
    toggleFavorite(quiz.id);
    toast({
      title: quiz.isFavorite ? "已取消收藏" : "已加入收藏",
      description: quiz.isFavorite ? "试卷已从收藏列表移除" : "试卷已加入收藏列表",
    });
  };

  const handleGoToAnswer = () => {
    // Navigate to quiz answering interface
    navigate(`/quiz/${quiz.id}/answer`);
  };

  const handleAddToWrongAnswers = (questionId: string) => {
    addToWrongAnswers(questionId, quiz.id);
    toast({
      title: "已加入错题本",
      description: "题目已加入您的错题本",
    });
  };

  if (isTeacher) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="h-4 w-4 mr-2" />
              编辑试卷
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleToggleFavorite}>
              {quiz.isFavorite ? (
                <>
                  <HeartOff className="h-4 w-4 mr-2" />
                  取消收藏
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4 mr-2" />
                  收藏试卷
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowAddToOrderDialog(true)}>
              <Copy className="h-4 w-4 mr-2" />
              添加到其他订单
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowShareDialog(true)}>
              <Share2 className="h-4 w-4 mr-2" />
              发给学生
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              删除试卷
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>确认删除试卷</AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>您确定要删除试卷 "{quiz.name}" 吗？</p>
                {quiz.isCompleted && (
                  <p className="text-destructive font-medium">
                    ⚠️ 注意：该试卷已有学生答题，删除后学生的答题数据也将被永久删除！
                  </p>
                )}
                <p>此操作无法撤销。</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                确认删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Add to Order Dialog */}
        <AddToOrderDialog 
          open={showAddToOrderDialog}
          onOpenChange={setShowAddToOrderDialog}
          quiz={quiz}
        />

        {/* Share Quiz Dialog */}
        <ShareQuizDialog 
          open={showShareDialog}
          onOpenChange={setShowShareDialog}
          quiz={quiz}
        />
      </>
    );
  }

  if (isStudent) {
    return (
      <div className="flex gap-2">
        {canAnswer && (
          <Button onClick={handleGoToAnswer} className="gap-2">
            <Play className="h-4 w-4" />
            去答题
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={handleToggleFavorite}>
              {quiz.isFavorite ? (
                <>
                  <HeartOff className="h-4 w-4 mr-2" />
                  取消收藏
                </>
              ) : (
                <>
                  <Heart className="h-4 w-4 mr-2" />
                  收藏试卷
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/wrong-answers')}>
              <BookOpen className="h-4 w-4 mr-2" />
              查看错题本
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return null;
};

export default QuizActions;