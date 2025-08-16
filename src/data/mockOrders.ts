export interface Order {
  id: string;
  name: string;
  student: string;
  knowledgePoints: string[];
  course: string;
  createTime: string;
  status: 'active' | 'completed' | 'pending';
}

export const mockOrders: Order[] = [
  {
    id: '1',
    name: '数学基础强化训练班',
    student: '李明',
    knowledgePoints: ['微积分', '线性代数', '概率论'],
    course: '高等数学',
    createTime: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    name: '英语口语提升课程',
    student: '王小雨',
    knowledgePoints: ['日常对话', '商务英语', '语音语调'],
    course: '英语',
    createTime: '2024-01-16',
    status: 'active'
  },
  {
    id: '3',
    name: '计算机编程入门',
    student: '张华',
    knowledgePoints: ['Python基础', '算法设计', '数据结构'],
    course: '计算机科学',
    createTime: '2024-01-17',
    status: 'pending'
  },
  {
    id: '4',
    name: '物理实验专项训练',
    student: '刘芳',
    knowledgePoints: ['力学实验', '电磁学', '光学'],
    course: '物理学',
    createTime: '2024-01-18',
    status: 'active'
  },
  {
    id: '5',
    name: '化学分析方法学习',
    student: '陈杰',
    knowledgePoints: ['定量分析', '定性分析', '仪器分析'],
    course: '化学',
    createTime: '2024-01-19',
    status: 'completed'
  },
  {
    id: '6',
    name: '文学作品阅读与写作',
    student: '赵敏',
    knowledgePoints: ['古典文学', '现代文学', '写作技巧'],
    course: '语文',
    createTime: '2024-01-20',
    status: 'active'
  },
  {
    id: '7',
    name: '历史文化深度学习',
    student: '孙伟',
    knowledgePoints: ['中国古代史', '世界史', '文化史'],
    course: '历史',
    createTime: '2024-01-21',
    status: 'pending'
  },
  {
    id: '8',
    name: '生物实验与理论结合',
    student: '周琳',
    knowledgePoints: ['细胞生物学', '遗传学', '生态学'],
    course: '生物学',
    createTime: '2024-01-22',
    status: 'active'
  }
];