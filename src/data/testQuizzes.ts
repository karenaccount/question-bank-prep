import { Quiz } from '@/contexts/QuizContext';

// Mock user IDs for testing
export const MOCK_TEACHER_ID = 'teacher-1';
export const MOCK_STUDENT_ID = 'student-1';
export const MOCK_STUDENT_2_ID = 'student-2';

// Sample questions for different subjects
const mathQuestions = [
  {
    id: 'q1',
    question: '解方程：2x + 5 = 13',
    options: ['x = 4', 'x = 3', 'x = 5', 'x = 6'],
    correctAnswer: 'x = 4',
    explanation: '2x = 13 - 5 = 8，所以 x = 4',
    score: 10
  },
  {
    id: 'q2',
    question: '计算：3² + 4² = ?',
    options: ['25', '24', '26', '23'],
    correctAnswer: '25',
    explanation: '3² + 4² = 9 + 16 = 25',
    score: 10
  },
  {
    id: 'q3',
    question: '下列哪个是质数？',
    options: ['9', '15', '17', '21'],
    correctAnswer: '17',
    explanation: '17只能被1和17整除，是质数',
    score: 10
  }
];

const chineseQuestions = [
  {
    id: 'q4',
    question: '下列词语中，字音完全正确的是：',
    options: ['载(zǎi)重', '模(mó)样', '处(chǔ)理', '角(jiǎo)色'],
    correctAnswer: '角(jiǎo)色',
    explanation: '角色读作jiǎo sè',
    score: 8
  },
  {
    id: 'q5',
    question: '"春风又绿江南岸"中的"绿"字用得好，好在哪里？',
    options: ['写出了春天的颜色', '表现了春风的力量', '体现了诗人的想象', '以上都对'],
    correctAnswer: '以上都对',
    explanation: '"绿"字既写出春天的颜色，又表现春风的神奇力量',
    score: 12
  }
];

const englishQuestions = [
  {
    id: 'q6',
    question: 'Choose the correct form: I _____ to school every day.',
    options: ['go', 'goes', 'going', 'went'],
    correctAnswer: 'go',
    explanation: 'Use present simple tense with "I"',
    score: 5
  },
  {
    id: 'q7',
    question: 'What is the past tense of "write"?',
    options: ['wrote', 'written', 'writing', 'writes'],
    correctAnswer: 'wrote',
    explanation: 'The past tense of "write" is "wrote"',
    score: 5
  }
];

export const testQuizzes: Quiz[] = [
  // Teacher created quizzes - some completed, some not
  {
    id: 'quiz-1',
    name: '数学基础测试',
    orderName: '七年级数学摸底',
    studentName: '张小明',
    course: '数学',
    questions: mathQuestions,
    totalQuestions: 3,
    totalScore: 30,
    createdAt: new Date('2024-01-15'),
    createdBy: MOCK_TEACHER_ID,
    assignedTo: MOCK_STUDENT_ID,
    isCompleted: true,
    studentScore: 25,
    completedAt: new Date('2024-01-16'),
    isFavorite: false
  },
  {
    id: 'quiz-2',
    name: '语文阅读理解',
    orderName: '八年级语文练习',
    studentName: '李小红',
    course: '语文',
    questions: chineseQuestions,
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
    name: '英语语法练习',
    orderName: '初一英语基础',
    studentName: '张小明',
    course: '英语',
    questions: englishQuestions,
    totalQuestions: 2,
    totalScore: 10,
    createdAt: new Date('2024-01-25'),
    createdBy: MOCK_TEACHER_ID,
    assignedTo: MOCK_STUDENT_ID,
    isCompleted: true,
    studentScore: 8,
    completedAt: new Date('2024-01-26'),
    isFavorite: true
  },
  {
    id: 'quiz-4',
    name: '数学进阶练习',
    orderName: '七年级数学提高',
    studentName: '李小红',
    course: '数学',
    questions: [
      {
        id: 'q8',
        question: '一元二次方程 x² - 5x + 6 = 0 的解是：',
        options: ['x = 2 或 x = 3', 'x = 1 或 x = 6', 'x = -2 或 x = -3', 'x = 0 或 x = 5'],
        correctAnswer: 'x = 2 或 x = 3',
        explanation: '因式分解：(x-2)(x-3) = 0',
        score: 15
      },
      {
        id: 'q9',
        question: '函数 y = 2x + 1 的图像经过点：',
        options: ['(0, 1)', '(1, 0)', '(0, 2)', '(1, 1)'],
        correctAnswer: '(0, 1)',
        explanation: '当x=0时，y=2×0+1=1，所以经过(0,1)',
        score: 15
      }
    ],
    totalQuestions: 2,
    totalScore: 30,
    createdAt: new Date('2024-02-01'),
    createdBy: MOCK_TEACHER_ID,
    assignedTo: MOCK_STUDENT_2_ID,
    isCompleted: false,
    isFavorite: false
  },
  {
    id: 'quiz-5',
    name: '期中综合测试',
    orderName: '八年级期中考试',
    studentName: '张小明',
    course: '综合',
    questions: [...mathQuestions.slice(0, 2), ...chineseQuestions.slice(0, 1)],
    totalQuestions: 3,
    totalScore: 28,
    createdAt: new Date('2024-02-10'),
    createdBy: MOCK_TEACHER_ID,
    assignedTo: MOCK_STUDENT_ID,
    isCompleted: false,
    isFavorite: false
  }
];