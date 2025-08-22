
-- Create user profiles table
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  work_email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  website TEXT NOT NULL,
  has_permission BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create agents table
CREATE TABLE public.agents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL DEFAULT 'AI Sales Agent',
  status TEXT NOT NULL DEFAULT 'active',
  embed_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat sessions table for analytics
CREATE TABLE public.chat_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES public.agents NOT NULL,
  visitor_id TEXT,
  messages_count INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_profiles
CREATE POLICY "Users can view their own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for agents
CREATE POLICY "Users can view their own agents" 
  ON public.agents 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own agents" 
  ON public.agents 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agents" 
  ON public.agents 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for chat_sessions
CREATE POLICY "Users can view chat sessions for their agents" 
  ON public.chat_sessions 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.agents 
    WHERE agents.id = chat_sessions.agent_id 
    AND agents.user_id = auth.uid()
  ));

-- Create trigger to automatically create agent when profile is created
CREATE OR REPLACE FUNCTION public.create_user_agent()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.agents (user_id, name, embed_code)
  VALUES (
    NEW.user_id, 
    NEW.company_name || ' AI Agent',
    '<div id="ai-chat-widget-' || NEW.id || '"></div><script>/* Embed code for ' || NEW.company_name || ' */</script>'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.create_user_agent();
