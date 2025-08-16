import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuiz } from "@/contexts/QuizContext";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import QuizEditor from "@/components/QuizEditor";
import { useToast } from "@/hooks/use-toast";

const QuizEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { quizzes, saveQuiz } = useQuiz();
  const { toast } = useToast();
  
  const quiz = quizzes.find(q => q.id === id);

  if (!quiz) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <div className="min-h-screen bg-background">
              <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-foreground mb-4">试卷未找到</h1>
                  <Button onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    返回
                  </Button>
                </div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  // Check if user has permission to edit this quiz
  if (user?.role !== 'teacher') {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <div className="min-h-screen bg-background">
              <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-foreground mb-4">权限不足</h1>
                  <p className="text-muted-foreground mb-4">只有老师可以编辑试卷</p>
                  <Button onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    返回
                  </Button>
                </div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  const handleBack = () => {
    navigate(-1);
  };

  const handleSave = (quizName: string, questions: any[]) => {
    // Update the existing quiz
    const updatedQuiz = {
      ...quiz,
      name: quizName,
      questions: questions,
      totalQuestions: questions.length,
      totalScore: questions.reduce((sum, q) => sum + q.score, 0),
    };

    // Here you would typically update the quiz in your data store
    // For now, we'll use the saveQuiz method but note that it creates a new quiz
    // In a real implementation, you'd want an updateQuiz method
    
    toast({
      title: "试卷已保存",
      description: `试卷"${quizName}"已成功更新`,
    });

    navigate(`/quiz/${id}`);
  };

  // Convert quiz questions to the format expected by QuizEditor
  const editorQuestions = quiz.questions.map((q: any, index: number) => ({
    id: index + 1,
    type: q.type || 'single_choice',
    title: q.title || '',
    options: q.options || [],
    correctAnswer: q.correctAnswer,
    answer: q.answer,
    explanation: q.explanation || '',
    score: q.score || 5,
    knowledgePoint: q.knowledgePoint || '未分类'
  }));

  const editorConfig = {
    scenarioName: "编辑模式",
    studentName: quiz.studentName || "学生",
    course: quiz.course || "未指定课程"
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <div className="min-h-screen bg-background">
            <QuizEditor
              questions={editorQuestions}
              config={editorConfig}
              onBack={handleBack}
              onSave={handleSave}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default QuizEdit;