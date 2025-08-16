import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

interface QuizContextType {
  quizzes: Quiz[];
  saveQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt' | 'isCompleted'>) => void;
  getQuizzesByTeacher: (teacherId: string) => Quiz[];
  getQuizzesByStudent: (studentId: string) => Quiz[];
  completeQuiz: (quizId: string, score: number) => void;
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
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

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

  const completeQuiz = (quizId: string, score: number) => {
    setQuizzes(prev => 
      prev.map(quiz => 
        quiz.id === quizId 
          ? { ...quiz, isCompleted: true, studentScore: score, completedAt: new Date() }
          : quiz
      )
    );
  };

  const value = {
    quizzes,
    saveQuiz,
    getQuizzesByTeacher,
    getQuizzesByStudent,
    completeQuiz,
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};