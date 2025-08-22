
-- Create storage bucket for agent documents
INSERT INTO storage.buckets (id, name, public) VALUES ('agent-documents', 'agent-documents', false);

-- Create agent_documents table
CREATE TABLE public.agent_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id TEXT NOT NULL,
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  mime_type TEXT,
  file_size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.agent_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for agent_documents
CREATE POLICY "Users can manage documents for their agents" 
  ON public.agent_documents 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.id::text = agent_documents.agent_id 
      AND agents.user_id = auth.uid()
    )
  );

-- Create RLS policies for storage bucket
CREATE POLICY "Users can upload documents for their agents" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'agent-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view documents for their agents" 
  ON storage.objects 
  FOR SELECT 
  USING (
    bucket_id = 'agent-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete documents for their agents" 
  ON storage.objects 
  FOR DELETE 
  USING (
    bucket_id = 'agent-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
