
-- Create a function to handle new user setup after email confirmation
CREATE OR REPLACE FUNCTION public.handle_user_email_confirmation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_metadata jsonb;
  agent_id_generated text;
BEGIN
  -- Only proceed if email_confirmed_at was just set (not updated from one value to another)
  IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
    
    -- Get user metadata
    user_metadata := NEW.raw_user_meta_data;
    
    -- Generate a unique agent ID
    agent_id_generated := 'agent_' || replace(NEW.id::text, '-', '_');
    
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
    ON CONFLICT (user_id) DO NOTHING;
    
    -- Create the first agent
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
      '<iframe src="' || current_setting('app.base_url', true) || '/agent/' || agent_id_generated || '" width="100%" height="600" frameborder="0"></iframe>',
      'active'
    );
    
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users table for email confirmation
DROP TRIGGER IF EXISTS on_user_email_confirmed ON auth.users;
CREATE TRIGGER on_user_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_email_confirmation();

-- Also create a function to handle immediate signups (in case email confirmation is disabled)
CREATE OR REPLACE FUNCTION public.handle_new_user_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  user_metadata jsonb;
  agent_id_generated text;
BEGIN
  -- Get user metadata
  user_metadata := NEW.raw_user_meta_data;
  
  -- Generate a unique agent ID
  agent_id_generated := 'agent_' || replace(NEW.id::text, '-', '_');
  
  -- Create user profile
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
  );
  
  -- Create the first agent
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
    '<iframe src="' || current_setting('app.base_url', true) || '/agent/' || agent_id_generated || '" width="100%" height="600" frameborder="0"></iframe>',
    'active'
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for immediate user creation (backup for when email confirmation is disabled)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (NEW.email_confirmed_at IS NOT NULL)
  EXECUTE FUNCTION public.handle_new_user_signup();
