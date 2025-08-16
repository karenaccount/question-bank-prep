import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export interface Quiz {
  id: string;
  name: string;
  orderName: string;
  studentName: string;
  course: string;
  questions: any[];
  totalQuestions: number;
  totalScore: number;
  createdAt: Date;
  createdBy: string; // teacher id
  assignedTo: string; // student id
  isCompleted: boolean;
  studentScore?: number;
  completedAt?: Date;
  isFavorite?: boolean;
}

export interface WrongAnswer {
  id: string;
  userId: string;
  questionId: string;
  quizId: string;
  quizName: string;
  subject: string;
  question: any;
  studentAnswer: string;
  addedAt: Date;
}

interface QuizContextType {
  quizzes: Quiz[];
  wrongAnswers: WrongAnswer[];
  loading: boolean;
  saveQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt' | 'isCompleted'>) => Promise<void>;
  getQuizzesByTeacher: (teacherId: string) => Quiz[];
  getQuizzesByStudent: (studentId: string) => Quiz[];
  getFavoriteQuizzes: (userId: string) => Quiz[];
  completeQuiz: (quizId: string, score: number) => Promise<void>;
  deleteQuiz: (quizId: string) => Promise<void>;
  toggleFavorite: (quizId: string) => Promise<void>;
  duplicateQuizToOrder: (quizId: string, order: any) => Promise<void>;
  addToWrongAnswers: (questionId: string, quizId: string) => Promise<void>;
  removeFromWrongAnswers: (questionId: string) => Promise<void>;
  clearWrongAnswers: () => Promise<void>;
  fetchQuizzes: () => Promise<void>;
  fetchWrongAnswers: () => Promise<void>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

interface QuizProviderProps {
  children: ReactNode;
}

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch quizzes from Supabase
  const fetchQuizzes = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching quizzes:', error);
        return;
      }

      const mappedQuizzes: Quiz[] = data.map(quiz => ({
        id: quiz.id,
        name: quiz.name,
        orderName: quiz.order_name,
        studentName: quiz.student_name,
        course: quiz.course,
        questions: quiz.questions,
        totalQuestions: quiz.total_questions,
        totalScore: quiz.total_score,
        createdBy: quiz.created_by,
        assignedTo: quiz.assigned_to,
        isCompleted: quiz.is_completed,
        studentScore: quiz.student_score,
        isFavorite: quiz.is_favorite,
        createdAt: new Date(quiz.created_at),
        completedAt: quiz.completed_at ? new Date(quiz.completed_at) : undefined
      }));

      setQuizzes(mappedQuizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch wrong answers from Supabase
  const fetchWrongAnswers = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('wrong_answers')
        .select(`
          *,
          quizzes (name, course)
        `)
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching wrong answers:', error);
        return;
      }

      const mappedWrongAnswers: WrongAnswer[] = data.map(item => ({
        id: item.id,
        userId: item.student_id,
        questionId: item.question_id,
        quizId: item.quiz_id,
        quizName: item.quizzes?.name || '',
        subject: item.quizzes?.course || '',
        question: {
          id: item.question_id,
          title: item.question_title,
          correctAnswer: item.correct_answer
        },
        studentAnswer: item.student_answer || '',
        addedAt: new Date(item.created_at)
      }));

      setWrongAnswers(mappedWrongAnswers);
    } catch (error) {
      console.error('Error fetching wrong answers:', error);
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      fetchQuizzes();
      fetchWrongAnswers();
    } else {
      setQuizzes([]);
      setWrongAnswers([]);
    }
  }, [user]);

  const saveQuiz = async (quizData: Omit<Quiz, 'id' | 'createdAt' | 'isCompleted'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('quizzes')
        .insert({
          name: quizData.name,
          order_name: quizData.orderName,
          student_name: quizData.studentName,
          course: quizData.course,
          questions: quizData.questions,
          total_questions: quizData.totalQuestions,
          total_score: quizData.totalScore,
          created_by: user.id,
          assigned_to: quizData.assignedTo,
          is_completed: false,
          student_score: quizData.studentScore,
          is_favorite: quizData.isFavorite || false
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving quiz:', error);
        return;
      }

      // Refresh quizzes
      await fetchQuizzes();
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };

  const getQuizzesByTeacher = (teacherId: string) => {
    return quizzes.filter(quiz => quiz.createdBy === teacherId);
  };

  const getQuizzesByStudent = (studentId: string) => {
    return quizzes.filter(quiz => quiz.assignedTo === studentId);
  };

  const getFavoriteQuizzes = (userId: string) => {
    return quizzes.filter(quiz => quiz.isFavorite && (quiz.createdBy === userId || quiz.assignedTo === userId));
  };

  const completeQuiz = async (quizId: string, score: number) => {
    try {
      const { error } = await supabase
        .from('quizzes')
        .update({
          is_completed: true,
          student_score: score,
          completed_at: new Date().toISOString()
        })
        .eq('id', quizId);

      if (error) {
        console.error('Error completing quiz:', error);
        return;
      }

      // Refresh quizzes
      await fetchQuizzes();
    } catch (error) {
      console.error('Error completing quiz:', error);
    }
  };

  const deleteQuiz = async (quizId: string) => {
    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', quizId);

      if (error) {
        console.error('Error deleting quiz:', error);
        return;
      }

      // Refresh quizzes
      await fetchQuizzes();
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  const toggleFavorite = async (quizId: string) => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return;

    try {
      const { error } = await supabase
        .from('quizzes')
        .update({
          is_favorite: !quiz.isFavorite
        })
        .eq('id', quizId);

      if (error) {
        console.error('Error toggling favorite:', error);
        return;
      }

      // Refresh quizzes
      await fetchQuizzes();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const duplicateQuizToOrder = async (quizId: string, order: any) => {
    const originalQuiz = quizzes.find(q => q.id === quizId);
    if (!originalQuiz || !user) return;

    try {
      const { error } = await supabase
        .from('quizzes')
        .insert({
          name: originalQuiz.name,
          order_name: order.name,
          student_name: order.student,
          course: order.course,
          questions: originalQuiz.questions,
          total_questions: originalQuiz.totalQuestions,
          total_score: originalQuiz.totalScore,
          created_by: user.id,
          assigned_to: originalQuiz.assignedTo,
          is_completed: false,
          student_score: null,
          is_favorite: false
        });

      if (error) {
        console.error('Error duplicating quiz:', error);
        return;
      }

      // Refresh quizzes
      await fetchQuizzes();
    } catch (error) {
      console.error('Error duplicating quiz:', error);
    }
  };

  const addToWrongAnswers = async (questionId: string, quizId: string) => {
    const quiz = quizzes.find(q => q.id === quizId);
    const question = quiz?.questions.find(q => q.id === questionId);
    if (!quiz || !question || !user) return;

    try {
      const { error } = await supabase
        .from('wrong_answers')
        .insert({
          student_id: user.id,
          quiz_id: quizId,
          question_id: questionId,
          question_title: question.title,
          student_answer: question.studentAnswer || '',
          correct_answer: question.correctAnswer || question.answer
        });

      if (error) {
        console.error('Error adding to wrong answers:', error);
        return;
      }

      // Refresh wrong answers
      await fetchWrongAnswers();
    } catch (error) {
      console.error('Error adding to wrong answers:', error);
    }
  };

  const removeFromWrongAnswers = async (questionId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wrong_answers')
        .delete()
        .eq('question_id', questionId)
        .eq('student_id', user.id);

      if (error) {
        console.error('Error removing from wrong answers:', error);
        return;
      }

      // Refresh wrong answers
      await fetchWrongAnswers();
    } catch (error) {
      console.error('Error removing from wrong answers:', error);
    }
  };

  const clearWrongAnswers = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wrong_answers')
        .delete()
        .eq('student_id', user.id);

      if (error) {
        console.error('Error clearing wrong answers:', error);
        return;
      }

      // Refresh wrong answers
      await fetchWrongAnswers();
    } catch (error) {
      console.error('Error clearing wrong answers:', error);
    }
  };

  const value = {
    quizzes,
    wrongAnswers,
    loading,
    saveQuiz,
    getQuizzesByTeacher,
    getQuizzesByStudent,
    getFavoriteQuizzes,
    completeQuiz,
    deleteQuiz,
    toggleFavorite,
    duplicateQuizToOrder,
    addToWrongAnswers,
    removeFromWrongAnswers,
    clearWrongAnswers,
    fetchQuizzes,
    fetchWrongAnswers,
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};