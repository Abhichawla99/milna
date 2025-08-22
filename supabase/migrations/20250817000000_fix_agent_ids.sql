-- Fix existing agents that don't have agent_id populated
-- This migration ensures all agents have both id (UUID) and agent_id (string) fields populated

-- Update existing agents that have NULL agent_id
UPDATE agents 
SET agent_id = id::text 
WHERE agent_id IS NULL;

-- Ensure the agent_id field is NOT NULL going forward
ALTER TABLE agents 
ALTER COLUMN agent_id SET NOT NULL;

-- Add a comment to clarify the difference between id and agent_id
COMMENT ON COLUMN agents.id IS 'UUID primary key for the agent';
COMMENT ON COLUMN agents.agent_id IS 'String identifier for the agent, used for external integrations';
