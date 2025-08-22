
-- Create AppSumo codes table
CREATE TABLE public.appsumo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  is_redeemed BOOLEAN NOT NULL DEFAULT false,
  redeemed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);

-- Add RLS policies
ALTER TABLE public.appsumo_codes ENABLE ROW LEVEL SECURITY;

-- Policy for edge functions to manage codes (using service role)
CREATE POLICY "service_role_manage_codes" ON public.appsumo_codes
FOR ALL
USING (true)
WITH CHECK (true);

-- Add subscription fields to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_tier TEXT,
ADD COLUMN IF NOT EXISTS subscription_end TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS appsumo_redeemed BOOLEAN DEFAULT false;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_appsumo_codes_code ON public.appsumo_codes(code);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription ON public.user_profiles(subscription_status);
