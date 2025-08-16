-- Insert sample data for testing
-- Note: These are temporary test accounts, in production you would use proper authentication

-- Insert sample quizzes (using hardcoded UUIDs for consistency)
INSERT INTO public.quizzes (
  id,
  name,
  order_name,
  student_name,
  course,
  questions,
  total_questions,
  total_score,
  created_by,
  assigned_to,
  is_completed,
  student_score,
  is_favorite
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  '数学基础测试',
  '李明 - 高中数学辅导',
  '李明',
  '高中数学',
  '[
    {
      "id": 1,
      "type": "single_choice",
      "title": "下列哪个选项正确描述了函数的定义？",
      "options": [
        "函数是一个包含变量的表达式",
        "函数是输入和输出之间的对应关系",
        "函数只能包含数字",
        "函数必须是线性的"
      ],
      "correctAnswer": 1,
      "explanation": "函数是定义在某个数集上的单值对应关系，即每个输入值对应唯一的输出值。",
      "score": 5,
      "knowledgePoint": "函数基本概念"
    },
    {
      "id": 2,
      "type": "calculation",
      "title": "计算题：求函数 f(x) = 2x + 3 在 x = 5 时的值。",
      "answer": "f(5) = 2×5 + 3 = 13",
      "explanation": "将 x = 5 代入函数表达式：f(5) = 2×5 + 3 = 10 + 3 = 13",
      "score": 8,
      "knowledgePoint": "函数求值"
    }
  ]',
  2,
  13,
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  false,
  null,
  false
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  '英语词汇测验',
  '张华 - 英语口语提升',
  '张华',
  '英语',
  '[
    {
      "id": 1,
      "type": "single_choice",
      "title": "What is the meaning of the word \"accomplish\"?",
      "options": [
        "To fail",
        "To achieve or complete",
        "To start",
        "To ignore"
      ],
      "correctAnswer": 1,
      "explanation": "Accomplish means to achieve or complete something successfully.",
      "score": 5,
      "knowledgePoint": "Vocabulary"
    }
  ]',
  1,
  5,
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  true,
  4,
  true
);

-- Note: The created_by and assigned_to use placeholder UUIDs. 
-- In real usage, these would be actual user IDs from auth.users table