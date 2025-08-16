-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('teacher', 'student')),
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Create quizzes table
CREATE TABLE public.quizzes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  order_name TEXT NOT NULL,
  student_name TEXT NOT NULL,
  course TEXT NOT NULL,
  questions JSONB NOT NULL,
  total_questions INTEGER NOT NULL,
  total_score INTEGER NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  assigned_to UUID REFERENCES auth.users ON DELETE SET NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  student_score INTEGER,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on quizzes
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- Create policies for quizzes
CREATE POLICY "Teachers can view their own quizzes" 
ON public.quizzes FOR SELECT 
USING (
  created_by = auth.uid() OR 
  assigned_to = auth.uid()
);

CREATE POLICY "Teachers can create quizzes" 
ON public.quizzes FOR INSERT 
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Teachers can update their own quizzes" 
ON public.quizzes FOR UPDATE 
USING (created_by = auth.uid());

CREATE POLICY "Teachers can delete their own quizzes" 
ON public.quizzes FOR DELETE 
USING (created_by = auth.uid());

-- Create wrong_answers table
CREATE TABLE public.wrong_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  quiz_id UUID NOT NULL REFERENCES public.quizzes ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  question_title TEXT NOT NULL,
  student_answer TEXT,
  correct_answer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on wrong_answers
ALTER TABLE public.wrong_answers ENABLE ROW LEVEL SECURITY;

-- Create policies for wrong_answers
CREATE POLICY "Students can view their own wrong answers" 
ON public.wrong_answers FOR SELECT 
USING (student_id = auth.uid());

CREATE POLICY "Students can insert their own wrong answers" 
ON public.wrong_answers FOR INSERT 
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can delete their own wrong answers" 
ON public.wrong_answers FOR DELETE 
USING (student_id = auth.uid());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quizzes_updated_at
BEFORE UPDATE ON public.quizzes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, role, display_name)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'student'),
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', 'User')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();