-- Migration: Create Pro Users Table and Enhanced Subscription Management
-- This migration creates a dedicated table for pro users with unlimited access

-- Create pro_users table for unlimited access management
CREATE TABLE public.pro_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  subscription_type TEXT NOT NULL DEFAULT 'pro', -- 'pro', 'enterprise', 'custom'
  subscription_status TEXT NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'suspended', 'expired'
  subscription_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  subscription_end TIMESTAMPTZ,
  billing_cycle TEXT DEFAULT 'monthly', -- 'monthly', 'yearly', 'lifetime'
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  payment_method_id TEXT,
  unlimited_agents BOOLEAN NOT NULL DEFAULT true,
  unlimited_messages BOOLEAN NOT NULL DEFAULT true,
  unlimited_integrations BOOLEAN NOT NULL DEFAULT true,
  unlimited_documents BOOLEAN NOT NULL DEFAULT true,
  custom_integrations BOOLEAN NOT NULL DEFAULT true,
  priority_support BOOLEAN NOT NULL DEFAULT true,
  advanced_analytics BOOLEAN NOT NULL DEFAULT true,
  white_label BOOLEAN NOT NULL DEFAULT false,
  api_access BOOLEAN NOT NULL DEFAULT true,
  team_members_limit INTEGER DEFAULT 10,
  custom_domain BOOLEAN NOT NULL DEFAULT false,
  sso_access BOOLEAN NOT NULL DEFAULT false,
  dedicated_support BOOLEAN NOT NULL DEFAULT false,
  features_enabled JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on pro_users table
ALTER TABLE public.pro_users ENABLE ROW LEVEL SECURITY;

-- RLS policies for pro_users
CREATE POLICY "Users can view their own pro subscription" 
  ON public.pro_users 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own pro subscription" 
  ON public.pro_users 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all pro subscriptions" 
  ON public.pro_users 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pro_users_user_id ON public.pro_users(user_id);
CREATE INDEX IF NOT EXISTS idx_pro_users_subscription_status ON public.pro_users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_pro_users_stripe_subscription_id ON public.pro_users(stripe_subscription_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER pro_users_updated_at
  BEFORE UPDATE ON public.pro_users
  FOR EACH ROW
  EXECUTE FUNCTION public.touch_updated_at();

-- Enhance existing user_profiles table with pro user references
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS is_pro_user BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS pro_user_id UUID REFERENCES public.pro_users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS message_limit INTEGER DEFAULT 100,
ADD COLUMN IF NOT EXISTS agent_limit INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS integration_limit INTEGER DEFAULT 2,
ADD COLUMN IF NOT EXISTS document_limit INTEGER DEFAULT 5;

-- Create function to check if user is pro
CREATE OR REPLACE FUNCTION public.is_pro_user(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.pro_users 
    WHERE user_id = user_uuid 
    AND subscription_status = 'active'
    AND (subscription_end IS NULL OR subscription_end > now())
  );
END;
$$;

-- Create function to get user's limits
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

-- Create function to check if user can create more agents
CREATE OR REPLACE FUNCTION public.can_create_agent(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_limits RECORD;
BEGIN
  SELECT * INTO user_limits FROM public.get_user_limits(user_uuid);
  
  -- If pro user with unlimited agents, always allow
  IF user_limits.is_pro_user AND user_limits.agent_limit = -1 THEN
    RETURN true;
  END IF;
  
  -- Check if user has reached their agent limit
  RETURN (
    SELECT COUNT(*) < user_limits.agent_limit
    FROM public.agents
    WHERE user_id = user_uuid
  );
END;
$$;

-- Create function to check if user can send more messages
CREATE OR REPLACE FUNCTION public.can_send_message(user_uuid UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_limits RECORD;
BEGIN
  SELECT * INTO user_limits FROM public.get_user_limits(user_uuid);
  
  -- If pro user with unlimited messages, always allow
  IF user_limits.is_pro_user AND user_limits.message_limit = -1 THEN
    RETURN true;
  END IF;
  
  -- Check if user has reached their message limit
  RETURN (
    SELECT COALESCE(message_count, 0) < user_limits.message_limit
    FROM public.user_profiles
    WHERE user_id = user_uuid
  );
END;
$$;

-- Create function to upgrade user to pro
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
    true,
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
    unlimited_agents = false,
    unlimited_messages = true,
    unlimited_integrations = true,
    unlimited_documents = true,
    custom_integrations = true,
    priority_support = true,
    advanced_analytics = true,
    api_access = true,
    updated_at = now()
  RETURNING id INTO pro_user_record_id;
  
  -- Update user profile to mark as pro user
  UPDATE public.user_profiles 
  SET 
    is_pro_user = true,
    pro_user_id = pro_user_record_id,
    subscription_status = 'pro',
    subscription_tier = subscription_type,
    updated_at = now()
  WHERE user_id = user_uuid;
  
  RETURN pro_user_record_id;
END;
$$;

-- Create function to downgrade user from pro
CREATE OR REPLACE FUNCTION public.downgrade_from_pro(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update pro user status to cancelled
  UPDATE public.pro_users 
  SET 
    subscription_status = 'cancelled',
    updated_at = now()
  WHERE user_id = user_uuid;
  
  -- Update user profile to remove pro status
  UPDATE public.user_profiles 
  SET 
    is_pro_user = false,
    pro_user_id = NULL,
    subscription_status = 'free',
    subscription_tier = NULL,
    message_limit = 100,
    agent_limit = 3,
    integration_limit = 2,
    document_limit = 5,
    updated_at = now()
  WHERE user_id = user_uuid;
  
  RETURN true;
END;
$$;

-- Create view for easy pro user queries
CREATE OR REPLACE VIEW public.pro_users_view AS
SELECT 
  pu.id as pro_user_id,
  pu.user_id,
  up.name,
  up.work_email,
  up.company_name,
  pu.subscription_type,
  pu.subscription_status,
  pu.subscription_start,
  pu.subscription_end,
  pu.billing_cycle,
  pu.unlimited_agents,
  pu.unlimited_messages,
  pu.unlimited_integrations,
  pu.unlimited_documents,
  pu.custom_integrations,
  pu.priority_support,
  pu.advanced_analytics,
  pu.white_label,
  pu.api_access,
  pu.team_members_limit,
  pu.custom_domain,
  pu.sso_access,
  pu.dedicated_support,
  pu.features_enabled,
  pu.created_at,
  pu.updated_at
FROM public.pro_users pu
JOIN public.user_profiles up ON pu.user_id = up.user_id;

-- Grant necessary permissions
GRANT SELECT ON public.pro_users TO authenticated;
GRANT SELECT ON public.pro_users_view TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_pro_user(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_limits(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_create_agent(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_send_message(UUID) TO authenticated;

-- Grant service role permissions
GRANT ALL ON public.pro_users TO service_role;
GRANT ALL ON public.pro_users_view TO service_role;
GRANT EXECUTE ON FUNCTION public.upgrade_to_pro(UUID, TEXT, TEXT, TEXT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.downgrade_from_pro(UUID) TO service_role;
