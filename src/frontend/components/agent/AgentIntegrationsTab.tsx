
import { useState, useEffect } from "react";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { toast } from "@/frontend/hooks/use-toast";
import { Zap, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/frontend/hooks/use-user";
import IntegrationCard from "@/frontend/components/integrations/IntegrationCard";
import NotifyDialog from "@/frontend/components/integrations/NotifyDialog";
import { AVAILABLE_INTEGRATIONS } from "@/frontend/components/integrations/integrationConfig";

interface Agent {
  id: string;
  name: string;
  integrations?: any;
  api_keys?: any;
}

interface Integration {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: any;
  isEnabled: boolean;
  config: any;
  expectedDate?: string;
  isAvailable?: boolean;
}

interface AgentIntegrationsTabProps {
  agent: Agent;
  onUpdate: () => void;
}

const AgentIntegrationsTab = ({ agent, onUpdate }: AgentIntegrationsTabProps) => {
  const { user } = useUser();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(false);
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadIntegrations();
    }
  }, [agent.id, user]);

  const loadIntegrations = async () => {
    setLoading(true);
    try {
      // Load user profile to get existing Cal.com API key
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) {
        console.error('Error loading profile:', error);
      }

      const integrationsWithData = AVAILABLE_INTEGRATIONS.map(available => ({
        id: crypto.randomUUID(),
        type: available.type,
        name: available.name,
        description: available.description,
        icon: available.icon,
        isEnabled: false,
        config: available.type === 'cal_com' && profile && (profile as any).cal_api_key 
          ? { ...available.defaultConfig, api_key: (profile as any).cal_api_key }
          : available.defaultConfig,
        expectedDate: available.expectedDate,
        isAvailable: available.isAvailable
      }));

      setIntegrations(integrationsWithData);
    } catch (error: any) {
      console.error('Error loading integrations:', error);
      toast({
        title: "Error",
        description: "Failed to load integrations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleIntegration = async (id: string, enabled: boolean) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, isEnabled: enabled }
          : integration
      )
    );
    onUpdate();
  };

  const handleConfigUpdate = async (id: string, config: any) => {
    const integration = integrations.find(i => i.id === id);
    
    if (integration?.type === 'cal_com' && config.api_key) {
      try {
        // Save Cal.com API key to user profile
        const { error } = await supabase
          .from('user_profiles')
          .update({ cal_api_key: config.api_key } as any)
          .eq('user_id', user?.id);

        if (error) {
          console.error('Error saving Cal.com API key:', error);
          toast({
            title: "Error",
            description: "Failed to save Cal.com API key",
            variant: "destructive",
          });
          return;
        }
      } catch (error) {
        console.error('Error saving Cal.com API key:', error);
        toast({
          title: "Error",
          description: "Failed to save Cal.com API key",
          variant: "destructive",
        });
        return;
      }
    }

    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === id 
          ? { ...integration, config }
          : integration
      )
    );
    
    toast({
      title: "Configuration Saved",
      description: `${integration?.name} configuration has been updated.`,
    });
    
    onUpdate();
  };

  if (loading) {
    return <div className="p-6">Loading integrations...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Zap className="w-5 h-5" />
        <h3 className="text-lg font-semibold">Agent Integrations</h3>
        <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
          🚀 Coming Soon
        </Badge>
      </div>
      
      {/* Coming Soon Banner */}
      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-center gap-3 mb-2">
          <Bell className="w-5 h-5 text-orange-600" />
          <h4 className="font-semibold text-orange-900">🚀 Integrations Coming Soon - Available with Pro Plan</h4>
        </div>
        <p className="text-sm text-orange-700 mb-3">
          Connect your favorite tools and automate workflows. Cal.com is now available! Other integrations will be available with our Pro plan starting Q1 2025.
        </p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsNotifyDialogOpen(true)}
          className="border-orange-300 text-orange-700 hover:bg-orange-100"
        >
          <Bell className="w-4 h-4 mr-2" />
          Notify me when ready
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Configure integrations for this agent. Each integration will be specific to this agent and won't affect your other agents.
      </p>

      {/* Integrations List */}
      <div className="space-y-4">
        {integrations.map(integration => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onToggle={handleToggleIntegration}
            onConfigUpdate={handleConfigUpdate}
          />
        ))}
      </div>

      <NotifyDialog 
        isOpen={isNotifyDialogOpen} 
        onClose={() => setIsNotifyDialogOpen(false)} 
      />
    </div>
  );
};

export default AgentIntegrationsTab;
