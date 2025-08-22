
-- Add columns to agents table for configuration
ALTER TABLE agents 
ADD COLUMN agent_id TEXT UNIQUE,
ADD COLUMN goal TEXT,
ADD COLUMN tone TEXT DEFAULT 'friendly',
ADD COLUMN instructions TEXT,
ADD COLUMN knowledge_urls TEXT[] DEFAULT '{}';

-- Create a table for agent knowledge/documents
CREATE TABLE IF NOT EXISTS agent_knowledge (
  id BIGSERIAL PRIMARY KEY,
  agent_id TEXT NOT NULL,
  source_type TEXT NOT NULL, -- 'url', 'document', 'text'
  source_id TEXT,
  url TEXT,
  title TEXT,
  author TEXT,
  content TEXT NOT NULL,
  content_html TEXT,
  content_tokens INTEGER,
  mime_type TEXT,
  language TEXT,
  checksum TEXT,
  chunk_index INTEGER DEFAULT 0,
  embedding VECTOR(1536),
  metadata JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add RLS policies for agent_knowledge
ALTER TABLE agent_knowledge ENABLE ROW LEVEL SECURITY;

-- Users can only access knowledge for their own agents
CREATE POLICY "Users can manage knowledge for their agents" 
  ON agent_knowledge 
  USING (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.agent_id = agent_knowledge.agent_id 
      AND agents.user_id = auth.uid()
    )
  );

-- Add index for better performance
CREATE INDEX IF NOT EXISTS idx_agent_knowledge_agent_id ON agent_knowledge(agent_id);
CREATE INDEX IF NOT EXISTS idx_agents_agent_id ON agents(agent_id);
