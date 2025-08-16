export interface Order {
  id: string;
  orderNumber: string;
  studentName: string;
  subject: string;
  lectureFiles: string[];
  createTime: string;
  status: 'active' | 'completed' | 'pending';
}

export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD2024001',
    studentName: '张小明',
    subject: '数学基础课程',
    lectureFiles: ['第一章：代数基础.pdf', '第二章：几何入门.pdf', '第三章：函数概念.pdf'],
    createTime: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    orderNumber: 'ORD2024002',
    studentName: '李小红',
    subject: '英语语法专项',
    lectureFiles: ['语法基础.pdf', '时态讲解.pdf', '从句结构.pdf'],
    createTime: '2024-01-16',
    status: 'active'
  },
  {
    id: '3',
    orderNumber: 'ORD2024003',
    studentName: '王小华',
    subject: '物理力学',
    lectureFiles: ['牛顿定律.pdf', '动量守恒.pdf', '能量转换.pdf'],
    createTime: '2024-01-17',
    status: 'active'
  },
  {
    id: '4',
    orderNumber: 'ORD2024004',
    studentName: '赵小强',
    subject: '化学基础',
    lectureFiles: ['原子结构.pdf', '化学键.pdf', '化学反应.pdf'],
    createTime: '2024-01-18',
    status: 'pending'
  },
  {
    id: '5',
    orderNumber: 'ORD2024005',
    studentName: '陈小美',
    subject: '数学进阶课程',
    lectureFiles: ['微积分基础.pdf', '导数应用.pdf', '积分计算.pdf'],
    createTime: '2024-01-19',
    status: 'active'
  }
];