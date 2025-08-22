
-- Create conversation_messages table to store individual messages
CREATE TABLE public.conversation_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL CHECK (message_type IN ('user', 'agent')),
  content TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_conversation_messages_conversation_id ON public.conversation_messages(conversation_id);
CREATE INDEX idx_conversation_messages_timestamp ON public.conversation_messages(timestamp);

-- Enable RLS for conversation_messages
ALTER TABLE public.conversation_messages ENABLE ROW LEVEL SECURITY;

-- Create policy for conversation_messages (public access for now since conversations table has no RLS)
CREATE POLICY "Allow all operations on conversation_messages" 
  ON public.conversation_messages 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Update conversations table to ensure all necessary columns exist
ALTER TABLE public.conversations 
ADD COLUMN IF NOT EXISTS conversation_id UUID DEFAULT gen_random_uuid();

-- Make sure conversations table has proper structure
ALTER TABLE public.conversations ALTER COLUMN started_at TYPE TIMESTAMP WITH TIME ZONE USING started_at AT TIME ZONE 'UTC';
ALTER TABLE public.conversations ALTER COLUMN last_message_at TYPE TIMESTAMP WITH TIME ZONE USING last_message_at AT TIME ZONE 'UTC';
