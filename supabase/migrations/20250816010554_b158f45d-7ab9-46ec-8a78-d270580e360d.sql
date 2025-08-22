
-- First, let's fix the existing trigger that's causing the confirmation error
-- The error suggests there's an issue with the ON CONFLICT specification

-- Drop the existing problematic trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_signup();

-- Create a new, corrected function for handling user email confirmation
CREATE OR REPLACE FUNCTION public.handle_user_email_confirmation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  user_metadata jsonb;
  agent_id_generated text;
BEGIN
  -- Only proceed if email_confirmed_at was just set (not updated from one value to another)
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    
    -- Get user metadata
    user_metadata := NEW.raw_user_meta_data;
    
    -- Use the agent_id from metadata if it exists, otherwise generate one
    IF user_metadata ? 'agent_id' THEN
      agent_id_generated := user_metadata->>'agent_id';
    ELSE
      agent_id_generated := 'agent_' || replace(NEW.id::text, '-', '_');
    END IF;
    
    -- Create user profile if it doesn't exist
    INSERT INTO public.user_profiles (
      user_id,
      name,
      work_email,
      company_name,
      website,
      has_permission
    )
    VALUES (
      NEW.id,
      COALESCE(user_metadata->>'name', 'User'),
      NEW.email,
      COALESCE(user_metadata->>'company', 'My Company'),
      COALESCE(user_metadata->>'website', ''),
      COALESCE((user_metadata->>'hasPermission')::boolean, false)
    )
    ON CONFLICT (user_id) DO UPDATE SET
      name = EXCLUDED.name,
      work_email = EXCLUDED.work_email,
      company_name = EXCLUDED.company_name,
      website = EXCLUDED.website,
      has_permission = EXCLUDED.has_permission;
    
    -- Create the first agent if it doesn't exist
    INSERT INTO public.agents (
      user_id,
      agent_id,
      name,
      goal,
      tone,
      instructions,
      embed_code,
      status
    )
    VALUES (
      NEW.id,
      agent_id_generated,
      COALESCE(user_metadata->>'company', 'My Company') || ' AI Agent',
      'Help customers find information and answer questions about our products and services',
      'friendly',
      'You are a helpful AI assistant for ' || COALESCE(user_metadata->>'company', 'this company') || '. Be professional, friendly, and provide accurate information about our company and services.',
      '<iframe src="https://ebfbe489-fc0d-489d-b25f-794d5e30a856.lovableproject.com/agent/' || agent_id_generated || '" width="100%" height="600" frameborder="0"></iframe>',
      'active'
    )
    ON CONFLICT (agent_id) DO NOTHING;
    
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create the trigger for email confirmation
CREATE TRIGGER on_user_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_email_confirmation();
