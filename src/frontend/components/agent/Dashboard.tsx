import { useState, useEffect } from "react";
import { Plus, Copy, LogOut, User, Home, Book, CreditCard, Database, RefreshCw, Crown, AlertTriangle } from "lucide-react";
import { toast } from "@/frontend/hooks/use-toast";

import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/frontend/components/ui/dialog";
import { Textarea } from "@/frontend/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/frontend/components/ui/table";
import { Badge } from "@/frontend/components/ui/badge";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/frontend/components/ui/tabs";
import { useToast } from "@/frontend/hooks/use-toast";
import { useUser } from "@/frontend/hooks/use-user";
import { useSubscription } from "@/frontend/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import AgentConfigModal from "@/frontend/components/agent/AgentConfigModal";
import UserProfile from "@/frontend/components/agent/UserProfile";
import AgentCreationFallback from "@/frontend/components/agent/AgentCreationFallback";
import IntegrationGuide from "@/frontend/components/agent/IntegrationGuide";
import ContextManager from "@/frontend/components/agent/ContextManager";
import { Link } from "react-router-dom";
import BillingSection from "@/frontend/components/marketing/BillingSection";
import { PricingWidget } from "@/frontend/components/upgrade/PricingWidget";

interface Agent {
  id: string;
  name: string;
  status: string;
  embed_code: string;
  created_at: string;
  goal?: string;
  tone?: string;
  instructions?: string;
}

const Dashboard = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isContextManagerOpen, setIsContextManagerOpen] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const { 
    isProUser, 
    canCreateAgent, 
    agentCount, 
    userLimits,
    upgradeToPro 
  } = useSubscription();

  useEffect(() => {
    if (user) {
      fetchAgents();
    }
  }, [user]);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      if (!user) {
        console.warn("User not available. Ensure user is authenticated.");
        return;
      }
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      const agentsList = data || [];
      setAgents(agentsList);
      
      // Show fallback if no agents exist after a brief delay
      if (agentsList.length === 0) {
        setTimeout(() => {
          setShowFallback(true);
        }, 1000);
      } else {
        setShowFallback(false);
      }
    } catch (error: any) {
      console.error("Error fetching agents:", error);
      toast({
        title: "Error",
        description: "Failed to fetch agents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAgent = async () => {
    if (!newAgentName.trim()) {
      toast({
        title: "Warning",
        description: "Agent name cannot be empty",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create an agent",
        variant: "destructive",
      });
      return;
    }

    // Check if user can create more agents
    if (!canCreateAgent()) {
      const agentLimit = userLimits?.agent_limit || 3;
      toast({
        title: "Agent Limit Reached",
        description: `You've reached your limit of ${agentLimit} agents. Upgrade to Pro for up to 7 agents.`,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const agentId = crypto.randomUUID();
      
      // Generate the new embed code format
      const embedCode = generateNewEmbedCode(agentId, newAgentName);

      const { data, error } = await supabase.from("agents").insert([
        {
          id: agentId,
          agent_id: agentId,
          name: newAgentName,
          status: "active",
          embed_code: embedCode,
          user_id: user.id,
          goal: "",
          tone: "friendly",
          instructions: "",
          integrations: {},
          api_keys: {},
          analytics_data: {}
        },
      ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Agent created successfully",
      });

      fetchAgents();
      setIsModalOpen(false);
      setNewAgentName("");
    } catch (error: any) {
      console.error("Error creating agent:", error);
      toast({
        title: "Error",
        description: "Failed to create agent",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeToPro = async () => {
    setShowUpgradeModal(true);
  };

  // Function to generate the new embed code format
  const generateNewEmbedCode = (agentId: string, agentName: string, agentData?: Partial<Agent>) => {
    const agentIdClean = agentId.replace(/-/g, '_');
    const agentGoal = agentData?.goal || '';
    const agentTone = agentData?.tone || 'friendly';
    const agentInstructions = agentData?.instructions || '';
    const agentCreatedAt = agentData?.created_at || new Date().toISOString();
    const agentStatus = agentData?.status || 'active';
    
    return '<!-- ' + agentName + ' - Complete AI Search Bar with Full Agent Data -->\n' +
           '<!-- Agent ID: ' + agentId + ' | Created: ' + new Date().toISOString() + ' -->\n' +
           '<div id="ai-search-' + agentId + '" style="font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; max-width: 720px; margin: 0 auto; position: relative;">\n' +
           '  <form id="ai-search-form-' + agentId + '" style="position: relative; display: flex; gap: 8px; align-items: center; z-index: 10;" onsubmit="return handleAISearch_' + agentIdClean + '(event)">\n' +
           '    <input id="ai-search-input-' + agentId + '" type="text" placeholder="Ask ' + agentName + ' anything..." style="flex: 1; height: 48px; border: 1px solid rgba(255,255,255,0.2); border-radius: 9999px; padding: 0 16px; font-size: 16px; outline: none; transition: all 0.3s ease; background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); color: #1f2937; backdrop-filter: blur(10px);" onfocus="this.style.boxShadow=\'0 0 0 4px rgba(79,70,229,0.2)\'; this.style.borderColor=\'rgba(99,102,241,0.5)\'; this.style.background=\'rgba(255,255,255,0.15)\';" onblur="this.style.boxShadow=\'none\'; this.style.borderColor=\'rgba(255,255,255,0.2)\'; this.style.background=\'rgba(255,255,255,0.1)\';" />\n' +
           '    <button type="submit" id="ai-search-submit-' + agentId + '" style="height: 48px; border: none; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: #fff; border-radius: 9999px; padding: 0 18px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.3s ease; backdrop-filter: blur(10px);" onmouseover="this.style.transform=\'scale(1.05)\'; this.style.boxShadow=\'0 8px 25px rgba(59,130,246,0.3)\'" onmouseout="this.style.transform=\'scale(1)\'; this.style.boxShadow=\'none\'">Ask ' + agentName + '</button>\n' +
           '  </form>\n' +
           '  <div style="display: flex; justify-content: flex-end; margin-top: 6px;"><span style="font-size: 12px; color: rgba(107,114,128,0.8); display: flex; align-items: center; gap: 4px;"><span style="width: 6px; height: 6px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite;"></span>Powered by Milna.io</span></div>\n' +
           '  <div id="ai-search-results-' + agentId + '" style="margin-top: 16px; display: none; border: 1px solid rgba(255,255,255,0.2); border-radius: 16px; padding: 20px; background: rgba(255,255,255,0.1); backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(0,0,0,0.1); max-height: 400px; overflow-y: auto; transform: translateY(20px); opacity: 0; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); position: relative;">\n' +
           '    <div id="ai-search-status-' + agentId + '" style="font-size: 14px; color: rgba(107,114,128,0.8); margin-bottom: 12px; display: flex; align-items: center; gap: 8px;"><div style="width: 16px; height: 16px; border: 2px solid rgba(229,231,235,0.3); border-top: 2px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>Thinking...</div>\n' +
           '    <div id="ai-search-list-' + agentId + '" style="display: flex; flex-direction: column; gap: 16px;"></div>\n' +
           '  </div>\n' +
           '  <style>\n' +
           '    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }\n' +
           '    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }\n' +
           '    @keyframes slideInUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }\n' +
           '    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }\n' +
           '    #ai-search-input-' + agentId + '.fade { opacity: 0.6; transition: opacity 0.3s ease; }\n' +
           '    #ai-search-' + agentId + ' * { box-sizing: border-box; }\n' +
           '    #ai-search-results-' + agentId + '.show { transform: translateY(0); opacity: 1; }\n' +
           '    .message-item { animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1); }\n' +
           '    .typing-indicator { animation: fadeIn 0.3s ease; }\n' +
           '  </style>\n' +
           '  <script>\n' +
           '    (function() {\n' +
           '      var agentConfig = { agentId: \'' + agentId + '\', agentUuid: \'' + agentId + '\', agentName: \'' + agentName + '\', agentGoal: \'' + agentGoal.replace(/'/g, "\\'") + '\', agentTone: \'' + agentTone.replace(/'/g, "\\'") + '\', agentInstructions: \'' + agentInstructions.replace(/'/g, "\\'") + '\', agentCreatedAt: \'' + agentCreatedAt + '\', supabaseUrl: \'https://fapojywavurprfbmeznj.supabase.co\', webhookProxyUrl: \'https://fapojywavurprfbmeznj.supabase.co/functions/v1/webhook-proxy\' };\n' +
           '      var agentIdClean = \'' + agentIdClean + '\';\n' +
           '      var visitorId = localStorage.getItem(\'milna_visitor_id_' + agentId + '\');\n' +
           '      if (!visitorId) { visitorId = \'visitor_\' + Date.now() + \'_\' + Math.random().toString(36).substring(2, 15); localStorage.setItem(\'milna_visitor_id_' + agentId + '\', visitorId); }\n' +
           '      var sessionToken = localStorage.getItem(\'milna_session_token\');\n' +
           '      var input = document.getElementById(\'ai-search-input-' + agentId + '\');\n' +
           '      var results = document.getElementById(\'ai-search-results-' + agentId + '\');\n' +
           '      var status = document.getElementById(\'ai-search-status-' + agentId + '\');\n' +
           '      var list = document.getElementById(\'ai-search-list-' + agentId + '\');\n' +
           '      var placeholders = ["Ask ' + agentName + ' anything...", "Get instant answers from ' + agentName + '...", "Chat with ' + agentName + '...", "How can ' + agentName + ' help you today?"];\n' +
           '      var placeholderIndex = 0;\n' +
           '      function rotatePlaceholder() { if (document.activeElement !== input) { input.classList.add(\'fade\'); setTimeout(function() { placeholderIndex = (placeholderIndex + 1) % placeholders.length; input.placeholder = placeholders[placeholderIndex]; input.classList.remove(\'fade\'); }, 300); } }\n' +
           '      setTimeout(function() { rotatePlaceholder(); setInterval(rotatePlaceholder, 4000); }, 3000);\n' +
           '      function cleanResponse(response) {\n' +
           '        if (!response) return "Thank you for your message! I\\\'m here to help you.";\n' +
           '        try {\n' +
           '          const parsed = JSON.parse(response);\n' +
           '          if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].output) {\n' +
           '            return parsed[0].output;\n' +
           '          }\n' +
           '          if (parsed.output) return parsed.output;\n' +
           '          if (parsed.response) return parsed.response;\n' +
           '          if (parsed.message) return parsed.message;\n' +
           '          if (parsed.reply) return parsed.reply;\n' +
           '          if (parsed.text) return parsed.text;\n' +
           '          if (typeof parsed === \\\'string\\\') return parsed;\n' +
           '        } catch (e) {}\n' +
           '        response = response.replace(/^"|"$/g, \\\'\\\');\n' +
           '        return response.trim() || "Thank you for your message! I\\\'m here to help you.";\n' +
           '      }\n' +
           '      async function sendMessage(message) {\n' +
           '        const webhookPayload = { agent_id: agentConfig.agentId, agent_uuid: agentConfig.agentUuid, agent_name: agentConfig.agentName, agent_goal: agentConfig.agentGoal, agent_tone: agentConfig.agentTone, agent_instructions: agentConfig.agentInstructions, agent_created_at: agentConfig.agentCreatedAt, user_id: visitorId, message: message, timestamp: new Date().toISOString(), source: \'embedded_search_bar\', visitor_id: visitorId, embed_type: \'hero_search_bar\', agent_status: \'' + agentStatus + '\' };\n' +
           '        try {\n' +
           '          const response = await fetch(agentConfig.webhookProxyUrl, { method: \'POST\', headers: { \'Content-Type\': \'application/json\', \'Authorization\': sessionToken ? \'Bearer \' + sessionToken : \'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhcG9qeXdhdnVycHJmYm1lem5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTY2OTIsImV4cCI6MjA3MDUzMjY5Mn0.t970PnmFpE_-JwpLzCCqly-Buj6o2KaK9dtzXtABXf0\' }, body: JSON.stringify(webhookPayload) });\n' +
           '          if (!response.ok) { throw new Error(\'Webhook failed: \' + response.status);\n' +
           '          }\n' +
           '          const data = await response.text();\n' +
           '          let agentResponse = "Thank you for your message! I\\\'m here to help you with any questions or assistance you need.";\n' +
           '          if (data) { \n' +
           '            try { \n' +
           '              const jsonData = JSON.parse(data); \n' +
           '              \n' +
           '              // Handle array format: [{"output": "message"}]\n' +
           '              if (Array.isArray(jsonData) && jsonData.length > 0 && jsonData[0].output) {\n' +
           '                agentResponse = jsonData[0].output;\n' +
           '              }\n' +
           '              // Handle single object format: {"output": "message"}\n' +
           '              else if (jsonData.output && typeof jsonData.output === \'string\') {\n' +
           '                agentResponse = jsonData.output;\n' +
           '              }\n' +
           '              // Handle other common response formats\n' +
           '              else if (jsonData.response && typeof jsonData.response === \'string\') {\n' +
           '                agentResponse = jsonData.response;\n' +
           '              } else if (jsonData.message && typeof jsonData.message === \'string\') {\n' +
           '                agentResponse = jsonData.message;\n' +
           '              } else if (jsonData.reply && typeof jsonData.reply === \'string\') {\n' +
           '                agentResponse = jsonData.reply;\n' +
           '              } else if (jsonData.text && typeof jsonData.text === \'string\') {\n' +
           '                agentResponse = jsonData.text;\n' +
           '              } else if (typeof jsonData === \'string\') {\n' +
           '                agentResponse = jsonData;\n' +
           '              }\n' +
           '            } catch (e) { \n' +
           '              agentResponse = data; \n' +
           '            } \n' +
           '          }\n' +
           '          return cleanResponse(agentResponse);\n' +
           '        } catch (error) {\n' +
           '          try { const directResponse = await fetch(\'https://abhixchawla.app.n8n.cloud/webhook/49ccefa1-44e4-4117-9cac-00e147f79cc9/chat\', { method: \'POST\', headers: { \'Content-Type\': \'application/json\' }, body: JSON.stringify(webhookPayload) }); if (directResponse.ok) { const directData = await directResponse.text(); return cleanResponse(directData) || "Thank you for your message! I\'m here to help you."; } } catch (fallbackError) { }\n' +
           '          return "I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.";\n' +
           '        }\n' +
           '      }\n' +
           '      window[\'handleAISearch_\' + agentIdClean] = async function(event) {\n' +
           '        event.preventDefault(); var query = input.value.trim(); if (!query) return;\n' +
           '        results.style.display = \'block\'; results.classList.add(\'show\'); status.style.display = \'flex\'; status.innerHTML = \'<div style="width: 16px; height: 16px; border: 2px solid rgba(229,231,235,0.3); border-top: 2px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>Thinking...\';\n' +
           '        var userItem = document.createElement(\'div\'); userItem.className = \'message-item\'; userItem.style.cssText = \'background: rgba(249,250,251,0.8); border: 1px solid rgba(229,231,235,0.3); border-radius: 12px; padding: 16px; font-size: 14px; color: #374151; backdrop-filter: blur(10px); margin-bottom: 8px;\'; userItem.innerHTML = \'<strong>You:</strong> \' + query; list.appendChild(userItem); input.value = \'\';\n' +
           '        try { const response = await sendMessage(query); status.style.display = \'none\'; var agentResponse = document.createElement(\'div\'); agentResponse.className = \'message-item\'; agentResponse.style.cssText = \'background: rgba(238,242,255,0.8); border: 1px solid rgba(224,231,255,0.3); border-radius: 12px; padding: 16px; font-size: 14px; color: #1f2937; backdrop-filter: blur(10px); margin-bottom: 8px;\'; agentResponse.innerHTML = \'<strong>\' + agentConfig.agentName + \':</strong> \' + response; list.appendChild(agentResponse); results.scrollTop = results.scrollHeight; } catch (error) { status.style.display = \'none\'; var errorItem = document.createElement(\'div\'); errorItem.className = \'message-item\'; errorItem.style.cssText = \'background: rgba(254,242,242,0.8); border: 1px solid rgba(254,202,202,0.3); border-radius: 12px; padding: 16px; font-size: 14px; color: #991b1b; backdrop-filter: blur(10px); margin-bottom: 8px;\'; errorItem.innerHTML = \'<strong>Error:</strong> I apologize, but I\\\'m having trouble processing your request right now. Please try again in a moment.\'; list.appendChild(errorItem); }\n' +
           '      };\n' +
           '      console.log(\'🚀 AI Search Bar initialized for \' + agentConfig.agentName + \' (\' + agentConfig.agentId + \')\');\n' +
           '    })();\n' +
           '  </script>\n' +
           '</div>';
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out",
      });
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsConfigModalOpen(true);
  };

  const handleCopyToClipboard = (agent: Agent) => {
    // Generate the latest embed code with all current features
    const latestEmbedCode = generateNewEmbedCode(agent.id, agent.name, agent);
    
    navigator.clipboard
      .writeText(latestEmbedCode)
      .then(() => {
        toast({
          title: "Copied!",
          description: "Latest embed code copied to clipboard with all features.",
        });
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          title: "Error",
          description: "Failed to copy embed code.",
          variant: "destructive",
        });
      });
  };

  const handleDeleteAgent = (deletedAgentId: string) => {
    setAgents(agents.filter(agent => agent.id !== deletedAgentId));
  };

  const handleAgentCreated = () => {
    setShowFallback(false);
    fetchAgents();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (showFallback && agents.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-10">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Your Agents</h1>
              {user && (
                <p className="text-muted-foreground mt-2">Welcome back, {user.email}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Link to="/">
                <Button variant="outline">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
              <Button variant="outline" onClick={() => setIsContextManagerOpen(true)}>
                <Database className="mr-2 h-4 w-4" />
                Context Manager
              </Button>
              <Button variant="outline" onClick={() => setIsProfileOpen(true)}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
          <AgentCreationFallback onAgentCreated={handleAgentCreated} />
        </div>

        {/* User Profile Dialog */}
        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>User Profile</DialogTitle>
              <DialogDescription>
                Manage your profile, billing, and team settings.
              </DialogDescription>
            </DialogHeader>
            <UserProfile />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Agents</h1>
            {user && (
              <div className="flex items-center gap-4 mt-2">
                <p className="text-muted-foreground">Welcome back, {user.email}</p>
                {isProUser && (
                  <Badge variant="default" className="bg-gradient-to-r from-purple-600 to-blue-600">
                    <Crown className="mr-1 h-3 w-3" />
                    Pro User
                  </Badge>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Agents:</span>
                  <span className={`font-medium ${!canCreateAgent() ? 'text-red-600' : 'text-green-600'}`}>
                    {agentCount} / {userLimits?.agent_limit === -1 ? '∞' : userLimits?.agent_limit || 3}
                  </span>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Link to="/">
              <Button variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
            <Button variant="outline" onClick={() => setIsContextManagerOpen(true)}>
              <Database className="mr-2 h-4 w-4" />
              Context Manager
            </Button>
            <Button variant="outline" onClick={() => setIsProfileOpen(true)}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
            <Button 
              onClick={() => setIsModalOpen(true)}
              disabled={!canCreateAgent()}
              className={!canCreateAgent() ? 'opacity-50 cursor-not-allowed' : ''}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Agent
            </Button>
          </div>
        </div>

        {/* Agent Limit Warning */}
        {!canCreateAgent() && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h4 className="font-semibold text-red-900">Agent Limit Reached</h4>
            </div>
            <p className="text-sm text-red-700 mb-3">
              You've reached your limit of {userLimits?.agent_limit || 3} agents. Upgrade to Pro for up to 7 agents.
            </p>
            <Button onClick={handleUpgradeToPro} className="bg-red-600 hover:bg-red-700">
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </Button>
          </div>
        )}

        <Tabs defaultValue="agents" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="agents">My Agents</TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="integration">
              <Book className="mr-2 h-4 w-4" />
              Integration Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="agents">
            <ScrollArea>
              <Table>
                <TableCaption>
                  A list of your AI agents. Click on an agent to configure it.
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.map((agent) => (
                    <TableRow key={agent.id} onClick={() => handleAgentClick(agent)}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{agent.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(agent.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyToClipboard(agent);
                          }}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          Copy Latest Embed Code
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="billing">
            <BillingSection />
          </TabsContent>

          <TabsContent value="integration">
            <IntegrationGuide agents={agents} />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isModalOpen} onOpenChange={() => setIsModalOpen(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Agent</DialogTitle>
            <DialogDescription>
              Give your agent a name to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newAgentName}
                onChange={(e) => setNewAgentName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleCreateAgent} disabled={loading}>
            {loading ? "Creating..." : "Create Agent"}
          </Button>
        </DialogContent>
      </Dialog>
      
      {selectedAgent && (
        <AgentConfigModal
          agent={selectedAgent}
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          onUpdate={fetchAgents}
          onDelete={handleDeleteAgent}
        />
      )}

      {/* Context Manager Dialog */}
      <ContextManager
        isOpen={isContextManagerOpen}
        onClose={() => setIsContextManagerOpen(false)}
      />

      {/* User Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>
              Manage your profile, billing, and team settings.
            </DialogDescription>
          </DialogHeader>
          <UserProfile />
        </DialogContent>
      </Dialog>

      {/* Pricing Modal */}
      <PricingWidget 
        starterMonth={199}
        starterAnnual={79.67} // $956/12 months
        proMonth={199}
        proAnnual={79.67} // $956/12 months
        open={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
};

export default Dashboard;
