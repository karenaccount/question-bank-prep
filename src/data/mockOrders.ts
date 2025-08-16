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
    name: '订单1',
    student: '学生1',
    knowledgePoints: ['知识点1-1', '知识点1-2', '知识点1-3'],
    course: '课程1',
    createTime: '2024-01-15',
    status: 'active'
  },
  {
    id: '2',
    name: '订单2',
    student: '学生2',
    knowledgePoints: ['知识点2-1', '知识点2-2', '知识点2-3'],
    course: '课程2',
    createTime: '2024-01-16',
    status: 'active'
  }
];