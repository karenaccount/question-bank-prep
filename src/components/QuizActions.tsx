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
  compact?: boolean; // For homepage use
  iconOnly?: boolean; // For list view with icon-only buttons
}

const QuizActions = ({ quiz, onEdit, compact = false, iconOnly = false }: QuizActionsProps) => {
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

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    } else {
      // Navigate to quiz editor
      navigate(`/quiz/${quiz.id}/edit`);
    }
  };

  const handleDelete = () => {
    deleteQuiz(quiz.id);
    toast({
      title: "试卷已删除",
      description: "试卷及相关答题数据已被删除",
    });
    navigate('/quiz-list');
  };

  const handleToggleFavorite = () => {
    const wasFavorite = quiz.isFavorite;
    toggleFavorite(quiz.id);
    toast({
      title: wasFavorite ? "已取消收藏" : "已加入收藏",
      description: wasFavorite ? "试卷已从收藏列表移除" : "试卷已加入收藏列表",
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
    if (iconOnly) {
      // Icon-only view for list pages
      return (
        <>
          <div className="flex gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleToggleFavorite}
              className="h-8 w-8 p-0"
              title={quiz.isFavorite ? "取消收藏" : "收藏试卷"}
            >
              {quiz.isFavorite ? (
                <HeartOff className="h-4 w-4" />
              ) : (
                <Heart className="h-4 w-4" />
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAddToOrderDialog(true)}
              className="h-8 w-8 p-0"
              title="添加到其他订单"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowShareDialog(true)}
              className="h-8 w-8 p-0"
              title="发给学生"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="更多操作">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  编辑
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

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

          {/* Dialogs */}
          <AddToOrderDialog 
            open={showAddToOrderDialog}
            onOpenChange={setShowAddToOrderDialog}
            quiz={quiz}
          />
          <ShareQuizDialog 
            open={showShareDialog}
            onOpenChange={setShowShareDialog}
            quiz={quiz}
          />
        </>
      );
    }
    
    if (compact) {
      // Compact view for homepage
      return (
        <>
          <div className="flex flex-wrap gap-1">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleToggleFavorite}
              className="h-7 px-2 text-xs"
            >
              {quiz.isFavorite ? (
                <HeartOff className="h-3 w-3" />
              ) : (
                <Heart className="h-3 w-3" />
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowAddToOrderDialog(true)}
              className="h-7 px-2 text-xs"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowShareDialog(true)}
              className="h-7 px-2 text-xs"
            >
              <Share2 className="h-3 w-3" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 px-2">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32">
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  编辑
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Dialogs */}
          <AddToOrderDialog 
            open={showAddToOrderDialog}
            onOpenChange={setShowAddToOrderDialog}
            quiz={quiz}
          />
          <ShareQuizDialog 
            open={showShareDialog}
            onOpenChange={setShowShareDialog}
            quiz={quiz}
          />
        </>
      );
    }

    // Full view for quiz list/detail pages
    return (
      <>
        <div className="flex gap-2">
          {/* High frequency actions exposed */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleToggleFavorite}
            className="gap-2"
          >
            {quiz.isFavorite ? (
              <>
                <HeartOff className="h-4 w-4" />
                取消收藏
              </>
            ) : (
              <>
                <Heart className="h-4 w-4" />
                收藏试卷
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAddToOrderDialog(true)}
            className="gap-2"
          >
            <Copy className="h-4 w-4" />
            添加到其他订单
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowShareDialog(true)}
            className="gap-2"
          >
            <Share2 className="h-4 w-4" />
            发给学生
          </Button>
          
          {/* Other actions in dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="h-4 w-4 mr-2" />
                编辑试卷
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
        </div>

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
    if (iconOnly) {
      return (
        <div className="flex gap-1">
          {canAnswer && (
            <Button onClick={handleGoToAnswer} className="h-8 w-8 p-0" title="去答题">
              <Play className="h-4 w-4" />
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleToggleFavorite}
            className="h-8 w-8 p-0"
            title={quiz.isFavorite ? "取消收藏" : "收藏试卷"}
          >
            {quiz.isFavorite ? (
              <HeartOff className="h-4 w-4" />
            ) : (
              <Heart className="h-4 w-4" />
            )}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0" title="更多操作">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => navigate('/wrong-answers')}>
                <BookOpen className="h-4 w-4 mr-2" />
                查看错题本
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
    
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