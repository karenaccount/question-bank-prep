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
    name: '计算机科学基础训练',
    student: '张三',
    knowledgePoints: ['算法复杂度', '数据结构', '面向对象编程'],
    course: '计算机科学',
    createTime: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    name: '商业管理进阶课程',
    student: '李四',
    knowledgePoints: ['战略分析', 'SWOT分析', '投资回报率'],
    course: '商业管理',
    createTime: '2024-01-16',
    status: 'active'
  },
  {
    id: '3',
    name: '统计学专项练习',
    student: '王五',
    knowledgePoints: ['中心极限定理', '假设检验', '统计推断'],
    course: '统计学',
    createTime: '2024-01-17',
    status: 'pending'
  },
  {
    id: '4',
    name: '研究方法论深入学习',
    student: '赵六',
    knowledgePoints: ['定性研究', '定量研究', '文献综述'],
    course: '研究方法',
    createTime: '2024-01-18',
    status: 'active'
  },
  {
    id: '5',
    name: '跨学科综合训练',
    student: '孙七',
    knowledgePoints: ['综合分析', '跨领域应用', '创新思维'],
    course: '跨学科研究',
    createTime: '2024-01-19',
    status: 'completed'
  }
];