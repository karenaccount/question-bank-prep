import React, { createContext, useContext, useState, ReactNode } from 'react';
import { testQuizzes } from '@/data/testQuizzes';

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
  saveQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt' | 'isCompleted'>) => void;
  getQuizzesByTeacher: (teacherId: string) => Quiz[];
  getQuizzesByStudent: (studentId: string) => Quiz[];
  getFavoriteQuizzes: (userId: string) => Quiz[];
  completeQuiz: (quizId: string, score: number) => void;
  deleteQuiz: (quizId: string) => void;
  toggleFavorite: (quizId: string) => void;
  duplicateQuizToOrder: (quizId: string, order: any) => void;
  addToWrongAnswers: (questionId: string, quizId: string) => void;
  removeFromWrongAnswers: (questionId: string) => void;
  clearWrongAnswers: () => void;
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
  const [quizzes, setQuizzes] = useState<Quiz[]>(testQuizzes);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);

  const saveQuiz = (quizData: Omit<Quiz, 'id' | 'createdAt' | 'isCompleted'>) => {
    const newQuiz: Quiz = {
      ...quizData,
      id: Date.now().toString(),
      createdAt: new Date(),
      isCompleted: false,
    };
    setQuizzes(prev => [newQuiz, ...prev]);
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

  const completeQuiz = (quizId: string, score: number) => {
    setQuizzes(prev => 
      prev.map(quiz => 
        quiz.id === quizId 
          ? { ...quiz, isCompleted: true, studentScore: score, completedAt: new Date() }
          : quiz
      )
    );
  };

  const deleteQuiz = (quizId: string) => {
    setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
    // Also remove related wrong answers
    setWrongAnswers(prev => prev.filter(wa => wa.quizId !== quizId));
  };

  const toggleFavorite = (quizId: string) => {
    setQuizzes(prev =>
      prev.map(quiz =>
        quiz.id === quizId
          ? { ...quiz, isFavorite: !quiz.isFavorite }
          : quiz
      )
    );
  };

  const duplicateQuizToOrder = (quizId: string, order: any) => {
    const originalQuiz = quizzes.find(q => q.id === quizId);
    if (!originalQuiz) return;

    const newQuiz: Quiz = {
      ...originalQuiz,
      id: Date.now().toString(),
      createdAt: new Date(),
      orderName: order.name,
      studentName: order.student,
      course: order.course,
      assignedTo: 'student-1', // Mock student ID
      isCompleted: false,
      studentScore: undefined,
      completedAt: undefined,
      isFavorite: false,
    };
    setQuizzes(prev => [newQuiz, ...prev]);
  };

  const addToWrongAnswers = (questionId: string, quizId: string) => {
    const quiz = quizzes.find(q => q.id === quizId);
    const question = quiz?.questions.find(q => q.id === questionId);
    if (!quiz || !question) return;

    const wrongAnswer: WrongAnswer = {
      id: Date.now().toString(),
      userId: quiz.assignedTo,
      questionId,
      quizId,
      quizName: quiz.name,
      subject: quiz.course,
      question,
      studentAnswer: question.studentAnswer || '',
      addedAt: new Date(),
    };

    setWrongAnswers(prev => [wrongAnswer, ...prev]);
  };

  const removeFromWrongAnswers = (questionId: string) => {
    setWrongAnswers(prev => prev.filter(wa => wa.questionId !== questionId));
  };

  const clearWrongAnswers = () => {
    setWrongAnswers([]);
  };

  const value = {
    quizzes,
    wrongAnswers,
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
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};