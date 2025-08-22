
-- Add user_id to agents table if not already present (for proper linking)
-- Add agent-level integration settings
ALTER TABLE agents 
ADD COLUMN IF NOT EXISTS integrations JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS api_keys JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS analytics_data JSONB DEFAULT '{}';

-- Create agent_integrations table for more structured storage
CREATE TABLE IF NOT EXISTS agent_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  integration_type TEXT NOT NULL, -- 'google_calendar', 'gmail', 'salesforce', etc.
  integration_config JSONB NOT NULL DEFAULT '{}',
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on agent_integrations
ALTER TABLE agent_integrations ENABLE ROW LEVEL SECURITY;

-- RLS policies for agent_integrations
CREATE POLICY "Users can manage integrations for their agents" 
  ON agent_integrations 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM agents 
      WHERE agents.id = agent_integrations.agent_id 
      AND agents.user_id = auth.uid()
    )
  );

-- Add trigger for updated_at
CREATE OR REPLACE TRIGGER agent_integrations_updated_at
  BEFORE UPDATE ON agent_integrations
  FOR EACH ROW
  EXECUTE FUNCTION touch_updated_at();
