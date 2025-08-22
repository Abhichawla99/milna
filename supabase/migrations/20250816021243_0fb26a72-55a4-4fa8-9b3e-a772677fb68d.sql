
-- 1) Remove duplicate agent-creation triggers on user_profiles
DROP TRIGGER IF EXISTS on_profile_created ON public.user_profiles;
DROP TRIGGER IF EXISTS on_user_profile_created ON public.user_profiles;

-- 2) Remove the helper function (no longer used)
DROP FUNCTION IF EXISTS public.create_user_agent();

-- 3) Ensure only the email-confirmation path is active for agent creation
-- (drop any residual "on_auth_user_created" trigger that could also create agents)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 4) Ensure ON CONFLICT (agent_id) can work by enforcing uniqueness on agents.agent_id
-- (Note: multiple NULLs are allowed in a unique index in Postgres, which is fine)
CREATE UNIQUE INDEX IF NOT EXISTS agents_agent_id_uidx
  ON public.agents(agent_id);

-- 5) Cleanup legacy duplicate agents created by the profile triggers
-- These rows have NULL agent_id and duplicate the email-confirmation agent row.
DELETE FROM public.agents
WHERE agent_id IS NULL;
