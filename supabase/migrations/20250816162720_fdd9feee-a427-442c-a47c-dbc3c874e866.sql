-- Add completed_at field to quizzes table
ALTER TABLE public.quizzes 
ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE;