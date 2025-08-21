export interface LectureNote {
  id: string;
  name: string;
  type: 'pdf';
  knowledgePoints: string[];
}

export interface Order {
  id: string;
  name: string;
  student: string;
  knowledgePoints: string[];
  course: string;
  createTime: string;
  status: 'active' | 'completed' | 'pending';
  lectureNotes: LectureNote[];
}

export const mockOrders: Order[] = [
  {
    id: '1',
    name: '数学基础强化训练班',
    student: '李明',
    knowledgePoints: ['微积分', '线性代数', '概率论', '极限理论', '导数应用', '积分运算'],
    course: '高等数学',
    createTime: '2024-01-15',
    status: 'active',
    lectureNotes: [
      {
        id: 'ln1_1',
        name: 'lecture note 1',
        type: 'pdf',
        knowledgePoints: ['微积分', '极限理论']
      },
      {
        id: 'ln1_2',
        name: 'lecture note 2',
        type: 'pdf',
        knowledgePoints: ['线性代数', '导数应用']
      },
      {
        id: 'ln1_3',
        name: 'lecture note 3',
        type: 'pdf',
        knowledgePoints: ['概率论', '积分运算']
      }
    ]
  },
  {
    id: '2',
    name: '英语口语提升课程',
    student: '王小雨',
    knowledgePoints: ['日常对话', '商务英语', '语音语调', '听力技巧', '口语表达', '词汇积累'],
    course: '英语',
    createTime: '2024-01-16',
    status: 'active',
    lectureNotes: [
      {
        id: 'ln2_1',
        name: 'lecture note 1',
        type: 'pdf',
        knowledgePoints: ['日常对话', '听力技巧']
      },
      {
        id: 'ln2_2',
        name: 'lecture note 2',
        type: 'pdf',
        knowledgePoints: ['商务英语', '口语表达']
      },
      {
        id: 'ln2_3',
        name: 'lecture note 3',
        type: 'pdf',
        knowledgePoints: ['语音语调', '词汇积累']
      }
    ]
  },
  {
    id: '3',
    name: '计算机编程入门',
    student: '张华',
    knowledgePoints: ['Python基础', '算法设计', '数据结构', '面向对象', '函数编程', '错误处理'],
    course: '计算机科学',
    createTime: '2024-01-17',
    status: 'pending',
    lectureNotes: [
      {
        id: 'ln3_1',
        name: 'lecture note 1',
        type: 'pdf',
        knowledgePoints: ['Python基础', '面向对象']
      },
      {
        id: 'ln3_2',
        name: 'lecture note 2',
        type: 'pdf',
        knowledgePoints: ['算法设计', '函数编程']
      },
      {
        id: 'ln3_3',
        name: 'lecture note 3',
        type: 'pdf',
        knowledgePoints: ['数据结构', '错误处理']
      }
    ]
  },
  {
    id: '4',
    name: '物理实验专项训练',
    student: '刘芳',
    knowledgePoints: ['力学实验', '电磁学', '光学', '热学实验', '波动理论', '量子物理'],
    course: '物理学',
    createTime: '2024-01-18',
    status: 'active',
    lectureNotes: [
      {
        id: 'ln4_1',
        name: 'lecture note 1',
        type: 'pdf',
        knowledgePoints: ['力学实验', '热学实验']
      },
      {
        id: 'ln4_2',
        name: 'lecture note 2',
        type: 'pdf',
        knowledgePoints: ['电磁学', '波动理论']
      },
      {
        id: 'ln4_3',
        name: 'lecture note 3',
        type: 'pdf',
        knowledgePoints: ['光学', '量子物理']
      }
    ]
  },
  {
    id: '5',
    name: '化学分析方法学习',
    student: '陈杰',
    knowledgePoints: ['定量分析', '定性分析', '仪器分析', '有机化学', '无机化学', '物理化学'],
    course: '化学',
    createTime: '2024-01-19',
    status: 'completed',
    lectureNotes: [
      {
        id: 'ln5_1',
        name: 'lecture note 1',
        type: 'pdf',
        knowledgePoints: ['定量分析', '有机化学']
      },
      {
        id: 'ln5_2',
        name: 'lecture note 2',
        type: 'pdf',
        knowledgePoints: ['定性分析', '无机化学']
      },
      {
        id: 'ln5_3',
        name: 'lecture note 3',
        type: 'pdf',
        knowledgePoints: ['仪器分析', '物理化学']
      }
    ]
  },
  {
    id: '6',
    name: '文学作品阅读与写作',
    student: '赵敏',
    knowledgePoints: ['古典文学', '现代文学', '写作技巧', '诗歌赏析', '散文写作', '小说创作'],
    course: '语文',
    createTime: '2024-01-20',
    status: 'active',
    lectureNotes: [
      {
        id: 'ln6_1',
        name: 'lecture note 1',
        type: 'pdf',
        knowledgePoints: ['古典文学', '诗歌赏析']
      },
      {
        id: 'ln6_2',
        name: 'lecture note 2',
        type: 'pdf',
        knowledgePoints: ['现代文学', '散文写作']
      },
      {
        id: 'ln6_3',
        name: 'lecture note 3',
        type: 'pdf',
        knowledgePoints: ['写作技巧', '小说创作']
      }
    ]
  },
  {
    id: '7',
    name: '历史文化深度学习',
    student: '孙伟',
    knowledgePoints: ['中国古代史', '世界史', '文化史', '政治史', '经济史', '社会史'],
    course: '历史',
    createTime: '2024-01-21',
    status: 'pending',
    lectureNotes: [
      {
        id: 'ln7_1',
        name: 'lecture note 1',
        type: 'pdf',
        knowledgePoints: ['中国古代史', '政治史']
      },
      {
        id: 'ln7_2',
        name: 'lecture note 2',
        type: 'pdf',
        knowledgePoints: ['世界史', '经济史']
      },
      {
        id: 'ln7_3',
        name: 'lecture note 3',
        type: 'pdf',
        knowledgePoints: ['文化史', '社会史']
      }
    ]
  },
  {
    id: '8',
    name: '生物实验与理论结合',
    student: '周琳',
    knowledgePoints: ['细胞生物学', '遗传学', '生态学', '分子生物学', '进化论', '生物统计'],
    course: '生物学',
    createTime: '2024-01-22',
    status: 'active',
    lectureNotes: [
      {
        id: 'ln8_1',
        name: 'lecture note 1',
        type: 'pdf',
        knowledgePoints: ['细胞生物学', '分子生物学']
      },
      {
        id: 'ln8_2',
        name: 'lecture note 2',
        type: 'pdf',
        knowledgePoints: ['遗传学', '进化论']
      },
      {
        id: 'ln8_3',
        name: 'lecture note 3',
        type: 'pdf',
        knowledgePoints: ['生态学', '生物统计']
      }
    ]
  }
];