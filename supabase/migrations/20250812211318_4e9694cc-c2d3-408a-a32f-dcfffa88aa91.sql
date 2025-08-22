
-- Add missing columns to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN first_name text,
ADD COLUMN last_name text,
ADD COLUMN company text,
ADD COLUMN phone text,
ADD COLUMN updated_at timestamp with time zone DEFAULT now();

-- Add RLS policies for the profiles table
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);
