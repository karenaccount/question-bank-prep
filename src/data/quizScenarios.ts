export interface QuizScenario {
  id: string;
  name: string;
  description: string;
  questionCount: {
    min: number;
    max: number;
  };
  features: string[];
}

export const quizScenarios: QuizScenario[] = [
  {
    id: 'pretest',
    name: 'Pretest',
    description: '摸底测试，了解学生基础水平',
    questionCount: { min: 5, max: 10 },
    features: ['基础概念理解', '先修知识掌握', '自动分析知识点', '单个问题形式']
  },
  {
    id: 'class_quiz',
    name: '随堂测验',
    description: '课堂即时检测学习效果',
    questionCount: { min: 3, max: 8 },
    features: ['可选择知识点', '大题小题均可', '多种题型']
  },
  {
    id: 'homework',
    name: '课后作业',
    description: '课后练习巩固知识',
    questionCount: { min: 8, max: 15 },
    features: ['可选择知识点', '大题小题均可', '多种题型']
  },
  {
    id: 'stage_test',
    name: '阶段小测',
    description: '阶段性学习成果检验',
    questionCount: { min: 15, max: 25 },
    features: ['可选择知识点', '可设置考查重点', '知识掌握/能力应用/综合分析']
  },
  {
    id: 'mock_exam',
    name: '模拟考试',
    description: '全面的考试模拟',
    questionCount: { min: 20, max: 50 },
    features: ['可选择知识点', '可设置考试时长', '题型分布配置', '分值配置']
  }
];