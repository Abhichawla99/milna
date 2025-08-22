
import { useState } from "react";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/frontend/components/ui/form";
import { Input } from "@/frontend/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/frontend/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Bot } from "lucide-react";
import { useUser } from "@/frontend/hooks/use-user";

const agentSchema = z.object({
  name: z.string().min(2, "Agent name must be at least 2 characters"),
});

type AgentData = z.infer<typeof agentSchema>;

interface CreateAgentFormProps {
  onAgentCreated: () => void;
}

const CreateAgentForm = ({ onAgentCreated }: CreateAgentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();

  const form = useForm<AgentData>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: AgentData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create an agent",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    console.log("Creating new agent:", data);

    try {
      // Generate a unique ID for the embed code
      const agentId = crypto.randomUUID();
      
      const { error } = await supabase
        .from('agents')
        .insert({
          id: agentId,
          agent_id: agentId, // Add this field
          user_id: user.id, // Properly link to authenticated user
          name: data.name,
          embed_code: `<div id="ai-chat-widget-${agentId}"></div><script src="https://your-domain.com/chat-widget.js" data-agent-id="${agentId}"></script>`,
          status: 'active',
          goal: '',
          tone: 'friendly',
          instructions: '',
          integrations: {},
          api_keys: {},
          analytics_data: {}
        });

      if (error) {
        console.error('Error creating agent:', error);
        throw error;
      }

      console.log('Agent created successfully');
      
      toast({
        title: "Agent Created! 🤖",
        description: "Your new AI agent is ready to help customers.",
      });

      onAgentCreated();
    } catch (error: any) {
      console.error('Error creating agent:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create agent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="relative">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bot className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-2xl text-center">Create New Agent</CardTitle>
        <CardDescription className="text-center">
          Give your AI agent a name to get started
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agent Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Customer Support Agent" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Agent"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateAgentForm;
