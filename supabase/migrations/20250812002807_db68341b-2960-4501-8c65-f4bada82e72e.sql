
-- Create a trigger function that automatically creates an agent when a user profile is created
CREATE OR REPLACE FUNCTION public.create_user_agent()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.agents (user_id, name, embed_code)
  VALUES (
    NEW.user_id, 
    NEW.company_name || ' AI Agent',
    '<div id="ai-chat-widget-' || NEW.id || '"></div><script src="https://your-domain.com/chat-widget.js" data-agent-id="' || NEW.id || '"></script>'
  );
  RETURN NEW;
END;
$function$;

-- Create the trigger that fires after a user profile is inserted
CREATE TRIGGER on_user_profile_created
  AFTER INSERT ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_agent();
