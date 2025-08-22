-- Migration: Update Pro User Limits
-- This migration updates pro user limits to be more realistic

-- Update the upgrade_to_pro function to set agent_limit to 7 instead of unlimited
CREATE OR REPLACE FUNCTION public.upgrade_to_pro(
  user_uuid UUID,
  subscription_type TEXT DEFAULT 'pro',
  stripe_customer_id TEXT DEFAULT NULL,
  stripe_subscription_id TEXT DEFAULT NULL,
  billing_cycle TEXT DEFAULT 'monthly'
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  pro_user_record_id UUID;
BEGIN
  -- Insert or update pro user record
  INSERT INTO public.pro_users (
    user_id,
    subscription_type,
    subscription_status,
    stripe_customer_id,
    stripe_subscription_id,
    billing_cycle,
    unlimited_agents,
    unlimited_messages,
    unlimited_integrations,
    unlimited_documents,
    custom_integrations,
    priority_support,
    advanced_analytics,
    api_access
  )
  VALUES (
    user_uuid,
    subscription_type,
    'active',
    stripe_customer_id,
    stripe_subscription_id,
    billing_cycle,
    false, -- Changed from true to false - not unlimited agents
    true,
    true,
    true,
    true,
    true,
    true,
    true
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    subscription_type = EXCLUDED.subscription_type,
    subscription_status = 'active',
    stripe_customer_id = COALESCE(EXCLUDED.stripe_customer_id, pro_users.stripe_customer_id),
    stripe_subscription_id = COALESCE(EXCLUDED.stripe_subscription_id, pro_users.stripe_subscription_id),
    billing_cycle = EXCLUDED.billing_cycle,
    unlimited_agents = false, -- Changed from true to false
    unlimited_messages = true,
    unlimited_integrations = true,
    unlimited_documents = true,
    custom_integrations = true,
    priority_support = true,
    advanced_analytics = true,
    api_access = true,
    updated_at = now()
  RETURNING id INTO pro_user_record_id;
  
  -- Update user profile to mark as pro user with 7 agent limit
  UPDATE public.user_profiles 
  SET 
    is_pro_user = true,
    pro_user_id = pro_user_record_id,
    subscription_status = 'pro',
    subscription_tier = subscription_type,
    agent_limit = 7, -- Set agent limit to 7 for pro users
    updated_at = now()
  WHERE user_id = user_uuid;
  
  RETURN pro_user_record_id;
END;
$$;

-- Update the get_user_limits function to return 7 for pro users instead of -1
CREATE OR REPLACE FUNCTION public.get_user_limits(user_uuid UUID DEFAULT auth.uid())
RETURNS TABLE(
  message_limit INTEGER,
  agent_limit INTEGER,
  integration_limit INTEGER,
  document_limit INTEGER,
  is_pro_user BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN pu.user_id IS NOT NULL AND pu.subscription_status = 'active' AND (pu.subscription_end IS NULL OR pu.subscription_end > now()) THEN
        CASE WHEN pu.unlimited_messages THEN -1 ELSE up.message_limit END
      ELSE up.message_limit
    END as message_limit,
    CASE 
      WHEN pu.user_id IS NOT NULL AND pu.subscription_status = 'active' AND (pu.subscription_end IS NULL OR pu.subscription_end > now()) THEN
        CASE WHEN pu.unlimited_agents THEN -1 ELSE up.agent_limit END
      ELSE up.agent_limit
    END as agent_limit,
    CASE 
      WHEN pu.user_id IS NOT NULL AND pu.subscription_status = 'active' AND (pu.subscription_end IS NULL OR pu.subscription_end > now()) THEN
        CASE WHEN pu.unlimited_integrations THEN -1 ELSE up.integration_limit END
      ELSE up.integration_limit
    END as integration_limit,
    CASE 
      WHEN pu.user_id IS NOT NULL AND pu.subscription_status = 'active' AND (pu.subscription_end IS NULL OR pu.subscription_end > now()) THEN
        CASE WHEN pu.unlimited_documents THEN -1 ELSE up.document_limit END
      ELSE up.document_limit
    END as document_limit,
    CASE 
      WHEN pu.user_id IS NOT NULL AND pu.subscription_status = 'active' AND (pu.subscription_end IS NULL OR pu.subscription_end > now()) THEN true
      ELSE false
    END as is_pro_user
  FROM public.user_profiles up
  LEFT JOIN public.pro_users pu ON up.user_id = pu.user_id
  WHERE up.user_id = user_uuid;
END;
$$;

-- Update existing pro users to have 7 agent limit instead of unlimited
UPDATE public.user_profiles 
SET agent_limit = 7 
WHERE is_pro_user = true AND agent_limit = -1;

-- Update pro_users table to set unlimited_agents to false for existing records
UPDATE public.pro_users 
SET unlimited_agents = false 
WHERE unlimited_agents = true;
