
import { useState, useEffect } from "react";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Bot, Loader2 } from "lucide-react";
import { useToast } from "@/frontend/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/frontend/hooks/use-user";

interface AgentCreationFallbackProps {
  onAgentCreated: () => void;
}

const AgentCreationFallback = ({ onAgentCreated }: AgentCreationFallbackProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useUser();

  useEffect(() => {
    fetchUserProfile();
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error fetching user profile:", error);
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const createFirstAgent = async () => {
    if (!user || !userProfile) return;

    setIsCreating(true);
    try {
      const agentId = `agent_${user.id.replace(/-/g, '_')}`;
      const embedCode = `<iframe src="${window.location.origin}/agent/${agentId}" width="100%" height="600" frameborder="0"></iframe>`;

      const { data: newAgent, error } = await supabase.from("agents").insert([
        {
          user_id: user.id,
          agent_id: agentId,
          name: `${userProfile.company_name || 'My Company'} AI Agent`,
          status: "active",
          embed_code: embedCode,
          goal: "Help customers find information and answer questions about our products and services",
          tone: "friendly",
          instructions: `You are a helpful AI assistant for ${userProfile.company_name || 'this company'}. Be professional, friendly, and provide accurate information about our company and services.`,
          integrations: {},
          api_keys: {},
          analytics_data: {}
        },
      ])
      .select("id")
      .single();

      if (error) throw error;

      // Send the webhook now with the real agents.id (UUID)
      if (newAgent?.id) {
        console.log('Invoking signup-webhook from fallback with real agents.id (UUID):', newAgent.id);
        await supabase.functions.invoke('signup-webhook', {
          body: {
            user_id: user.id,
            name: userProfile.name || 'User',
            email: user.email!,
            company: userProfile.company_name || 'My Company',
            website: userProfile.website || '',
            hasPermission: userProfile.has_permission || false,
            agent_id: newAgent.id, // UUID from agents.id
          },
        });
      }

      toast({
        title: "Success! 🎉",
        description: "Your first AI agent has been created successfully.",
      });

      onAgentCreated();
    } catch (error: any) {
      console.error("Error creating fallback agent:", error);
      toast({
        title: "Error",
        description: "Failed to create your first agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome to Your Dashboard!</CardTitle>
          <CardDescription>
            It looks like you don't have any agents yet. Let's create your first one to get started.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center">
          <Button 
            onClick={createFirstAgent} 
            disabled={isCreating || !userProfile}
            className="w-full"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Your Agent...
              </>
            ) : (
              <>
                <Bot className="mr-2 h-4 w-4" />
                Create My First Agent
              </>
            )}
          </Button>
          
          {userProfile && (
            <p className="text-sm text-muted-foreground mt-4">
              Creating agent for: <strong>{userProfile.company_name}</strong>
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentCreationFallback;
