import { Quiz } from '@/contexts/QuizContext';

// Mock user IDs for testing
export const MOCK_TEACHER_ID = 'teacher-1';
export const MOCK_STUDENT_ID = 'student-1';
export const MOCK_STUDENT_2_ID = 'student-2';

// Sample questions for different subjects suitable for university/graduate students
const computerScienceQuestions = [
  {
    id: 'q1',
    question: 'What is the time complexity of binary search algorithm?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctAnswer: 'O(log n)',
    explanation: 'Binary search divides the search space in half with each iteration',
    score: 10
  },
  {
    id: 'q2',
    question: 'Which data structure uses LIFO (Last In, First Out) principle?',
    options: ['Queue', 'Stack', 'Array', 'Linked List'],
    correctAnswer: 'Stack',
    explanation: 'Stack follows LIFO principle where the last element added is the first to be removed',
    score: 10
  },
  {
    id: 'q3',
    question: 'In object-oriented programming, what does polymorphism refer to?',
    options: ['Data hiding', 'Code reusability', 'Multiple forms of a method', 'Class inheritance'],
    correctAnswer: 'Multiple forms of a method',
    explanation: 'Polymorphism allows objects of different types to be treated as instances of the same type',
    score: 15
  }
];

const businessQuestions = [
  {
    id: 'q4',
    question: 'What does ROI stand for in business analysis?',
    options: ['Return on Investment', 'Rate of Interest', 'Revenue of Income', 'Risk of Investment'],
    correctAnswer: 'Return on Investment',
    explanation: 'ROI measures the efficiency of an investment',
    score: 8
  },
  {
    id: 'q5',
    question: 'In the SWOT analysis framework, what does the "T" represent?',
    options: ['Technology', 'Threats', 'Trends', 'Targets'],
    correctAnswer: 'Threats',
    explanation: 'SWOT stands for Strengths, Weaknesses, Opportunities, and Threats',
    score: 12
  }
];

const statisticsQuestions = [
  {
    id: 'q6',
    question: 'What is the central limit theorem?',
    options: ['Sample means approach normal distribution', 'All data is normally distributed', 'Variance equals mean', 'Standard deviation is constant'],
    correctAnswer: 'Sample means approach normal distribution',
    explanation: 'CLT states that sample means will be normally distributed regardless of population distribution',
    score: 15
  },
  {
    id: 'q7',
    question: 'What is a Type I error in hypothesis testing?',
    options: ['Accepting false null hypothesis', 'Rejecting true null hypothesis', 'Incorrect sample size', 'Wrong test statistic'],
    correctAnswer: 'Rejecting true null hypothesis',
    explanation: 'Type I error occurs when we reject a null hypothesis that is actually true',
    score: 12
  }
];

const researchMethodsQuestions = [
  {
    id: 'q8',
    question: 'What is the main difference between qualitative and quantitative research?',
    options: ['Sample size', 'Data type and analysis method', 'Research duration', 'Cost'],
    correctAnswer: 'Data type and analysis method',
    explanation: 'Qualitative focuses on non-numerical data while quantitative uses numerical data',
    score: 10
  }
];

export const testQuizzes: Quiz[] = [
  // Teacher created quizzes for university/graduate students
  {
    id: 'quiz-1',
    name: 'Computer Science Fundamentals',
    orderName: 'CS101 Midterm Review',
    studentName: 'Alex Johnson',
    course: 'Computer Science',
    questions: computerScienceQuestions,
    totalQuestions: 3,
    totalScore: 35,
    createdAt: new Date('2024-01-15'),
    createdBy: MOCK_TEACHER_ID,
    assignedTo: MOCK_STUDENT_ID,
    isCompleted: true,
    studentScore: 30,
    completedAt: new Date('2024-01-16'),
    isFavorite: false
  },
  {
    id: 'quiz-2',
    name: 'Business Administration Quiz',
    orderName: 'MBA Strategic Management',
    studentName: 'Maria Garcia',
    course: 'Business Administration',
    questions: businessQuestions,
    totalQuestions: 2,
    totalScore: 20,
    createdAt: new Date('2024-01-20'),
    createdBy: MOCK_TEACHER_ID,
    assignedTo: MOCK_STUDENT_2_ID,
    isCompleted: false,
    isFavorite: true
  },
  {
    id: 'quiz-3',
    name: 'Statistics & Data Analysis',
    orderName: 'STAT 501 Hypothesis Testing',
    studentName: 'Alex Johnson',
    course: 'Statistics',
    questions: statisticsQuestions,
    totalQuestions: 2,
    totalScore: 27,
    createdAt: new Date('2024-01-25'),
    createdBy: MOCK_TEACHER_ID,
    assignedTo: MOCK_STUDENT_ID,
    isCompleted: true,
    studentScore: 22,
    completedAt: new Date('2024-01-26'),
    isFavorite: true
  },
  {
    id: 'quiz-4',
    name: 'Research Methods Assessment',
    orderName: 'Graduate Research Methodology',
    studentName: 'Maria Garcia',
    course: 'Research Methods',
    questions: [
      ...researchMethodsQuestions,
      {
        id: 'q9',
        question: 'What is the purpose of a literature review in research?',
        options: ['To copy previous work', 'To identify research gaps', 'To avoid reading', 'To fill pages'],
        correctAnswer: 'To identify research gaps',
        explanation: 'Literature review helps identify what has been studied and what gaps exist',
        score: 15
      }
    ],
    totalQuestions: 2,
    totalScore: 25,
    createdAt: new Date('2024-02-01'),
    createdBy: MOCK_TEACHER_ID,
    assignedTo: MOCK_STUDENT_2_ID,
    isCompleted: false,
    isFavorite: false
  },
  {
    id: 'quiz-5',
    name: 'Comprehensive Assessment',
    orderName: 'Interdisciplinary Final Exam',
    studentName: 'Alex Johnson',
    course: 'Interdisciplinary Studies',
    questions: [...computerScienceQuestions.slice(0, 2), ...businessQuestions.slice(0, 1)],
    totalQuestions: 3,
    totalScore: 32,
    createdAt: new Date('2024-02-10'),
    createdBy: MOCK_TEACHER_ID,
    assignedTo: MOCK_STUDENT_ID,
    isCompleted: false,
    isFavorite: false
  }
];