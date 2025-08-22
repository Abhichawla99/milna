
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/frontend/components/ui/dialog";
import { Button } from "@/frontend/components/ui/button";
import { useToast } from "@/frontend/hooks/use-toast";
import { Copy, ExternalLink } from "lucide-react";

interface Agent {
  id: string;
  agent_id?: string;
  name: string;
  status: string;
  embed_code: string;
  created_at: string;
  goal?: string;
  tone?: string;
  instructions?: string;
}

interface AgentEmbedModalProps {
  agent: Agent;
  isOpen: boolean;
  onClose: () => void;
}

const AgentEmbedModal = ({ agent, isOpen, onClose }: AgentEmbedModalProps) => {
  const { toast } = useToast();

  // Generate unique embed code for this specific agent with all agent data
  const generateUniqueEmbedCode = () => {
    const agentId = agent.agent_id || agent.id;
    const agentIdClean = agentId.replace(/-/g, '_');
    const agentName = agent.name;
    const agentGoal = agent.goal || '';
    const agentTone = agent.tone || '';
    const agentInstructions = agent.instructions || '';
    
    return `<!-- ${agentName} - Complete AI Search Bar with Full Agent Data -->
<!-- Agent ID: ${agentId} | Created: ${agent.created_at} -->
<div id="ai-search-${agentId}" style="
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 720px;
  margin: 0 auto;
">
  <form 
    id="ai-search-form-${agentId}" 
    style="position: relative; display: flex; gap: 8px; align-items: center;"
    onsubmit="return handleAISearch_${agentIdClean}(event)"
  >
    <input
      id="ai-search-input-${agentId}"
      type="text"
      placeholder="Ask ${agentName} anything..."
      style="
        flex: 1;
        height: 48px;
        border: 1px solid #e5e7eb;
        border-radius: 9999px;
        padding: 0 16px;
        font-size: 16px;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;
        background: white;
      "
      onfocus="this.style.boxShadow='0 0 0 4px rgba(79,70,229,0.1)'; this.style.borderColor='#6366f1';"
      onblur="this.style.boxShadow='none'; this.style.borderColor='#e5e7eb';"
    />
    <button
      type="submit"
      id="ai-search-submit-${agentId}"
      style="
        height: 48px;
        border: none;
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        color: #fff;
        border-radius: 9999px;
        padding: 0 18px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      "
      onmouseover="this.style.transform='scale(1.02)'"
      onmouseout="this.style.transform='scale(1)'"
    >
      Ask ${agentName}
    </button>
  </form>

  <div style="display: flex; justify-content: flex-end; margin-top: 6px;">
    <span style="
      font-size: 12px;
      color: #6b7280;
      display: flex;
      align-items: center;
      gap: 4px;
    ">
      <span style="width: 6px; height: 6px; background: #10b981; border-radius: 50%; animation: pulse 2s infinite;"></span>
      Powered by Milna.io
    </span>
  </div>

  <div 
    id="ai-search-results-${agentId}" 
    style="
      margin-top: 16px;
      display: none;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 16px;
      background: white;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      max-height: 400px;
      overflow-y: auto;
    "
  >
    <div 
      id="ai-search-status-${agentId}" 
      style="font-size: 14px; color: #6b7280; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;"
    >
      <div style="width: 16px; height: 16px; border: 2px solid #e5e7eb; border-top: 2px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      Thinking...
    </div>
    <div 
      id="ai-search-list-${agentId}" 
      style="display: flex; flex-direction: column; gap: 12px;"
    ></div>
  </div>

  <style>
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    #ai-search-input-${agentId}.fade {
      opacity: 0.6;
      transition: opacity 0.3s ease;
    }
    
    #ai-search-${agentId} * {
      box-sizing: border-box;
    }
  </style>

  <script>
    (function() {
      // Agent Configuration - Unique to ${agentName}
      var agentConfig = {
        agentId: '${agentId}',
        agentUuid: '${agentId}',
        agentName: '${agentName}',
        agentGoal: '${agentGoal.replace(/'/g, "\\'")}',
        agentTone: '${agentTone.replace(/'/g, "\\'")}',
        agentInstructions: '${agentInstructions.replace(/'/g, "\\'")}',
        agentCreatedAt: '${agent.created_at}',
        supabaseUrl: 'https://fapojywavurprfbmeznj.supabase.co',
        webhookProxyUrl: 'https://fapojywavurprfbmeznj.supabase.co/functions/v1/webhook-proxy'
      };
      
      var agentIdClean = '${agentIdClean}';
      
      // Initialize unique visitor ID for this agent
      var visitorId = localStorage.getItem('milna_visitor_id_${agentId}');
      if (!visitorId) {
        visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('milna_visitor_id_${agentId}', visitorId);
      }
      
      var sessionToken = localStorage.getItem('milna_session_token');
      
      var input = document.getElementById('ai-search-input-${agentId}');
      var results = document.getElementById('ai-search-results-${agentId}');
      var status = document.getElementById('ai-search-status-${agentId}');
      var list = document.getElementById('ai-search-list-${agentId}');

      // Agent-specific placeholders
      var placeholders = [
        "Ask ${agentName} anything...",
        "Get instant answers from ${agentName}...",
        "Chat with ${agentName}...",
        "How can ${agentName} help you today?"
      ];
      var placeholderIndex = 0;
      
      function rotatePlaceholder() {
        if (document.activeElement !== input) {
          input.classList.add('fade');
          setTimeout(function() {
            placeholderIndex = (placeholderIndex + 1) % placeholders.length;
            input.placeholder = placeholders[placeholderIndex];
            input.classList.remove('fade');
          }, 300);
        }
      }
      
      setTimeout(function() {
        rotatePlaceholder();
        setInterval(rotatePlaceholder, 4000);
      }, 3000);

      // Send message to backend with complete agent data
      async function sendMessage(message) {
        const webhookPayload = {
          agent_id: agentConfig.agentId,
          agent_uuid: agentConfig.agentUuid,
          agent_name: agentConfig.agentName,
          agent_goal: agentConfig.agentGoal,
          agent_tone: agentConfig.agentTone,
          agent_instructions: agentConfig.agentInstructions,
          agent_created_at: agentConfig.agentCreatedAt,
          user_id: visitorId,
          message: message,
          timestamp: new Date().toISOString(),
          source: 'embedded_search_bar',
          visitor_id: visitorId,
          embed_type: 'hero_search_bar',
          agent_status: '${agent.status}'
        };

        try {
          console.log('📨 Sending message to ${agentName}:', message);
          console.log('🔧 Agent config:', agentConfig);
          
          // Send via Supabase webhook-proxy for complete backend integration
          const response = await fetch(agentConfig.webhookProxyUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': sessionToken ? `Bearer ${sessionToken}` : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhcG9qeXdhdnVycHJmYm1lem5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTY2OTIsImV4cCI6MjA3MDUzMjY5Mn0.t970PnmFpE_-JwpLzCCqly-Buj6o2KaK9dtzXtABXf0'
            },
            body: JSON.stringify(webhookPayload)
          });

          if (!response.ok) {
            throw new Error(`Webhook failed: ${response.status}`);
          }

          const data = await response.text();
          console.log('✅ Message sent successfully to ${agentName}');
          
          // Parse response
          let agentResponse = "Thank you for your message! I'm here to help you with any questions or assistance you need.";
          
          if (data) {
            try {
              const jsonData = JSON.parse(data);
              if (jsonData.response && typeof jsonData.response === 'string') {
                agentResponse = jsonData.response;
              } else if (jsonData.message && typeof jsonData.message === 'string') {
                agentResponse = jsonData.message;
              } else if (jsonData.output && typeof jsonData.output === 'string') {
                agentResponse = jsonData.output;
              } else if (jsonData.reply && typeof jsonData.reply === 'string') {
                agentResponse = jsonData.reply;
              } else if (jsonData.text && typeof jsonData.text === 'string') {
                agentResponse = jsonData.text;
              } else if (typeof jsonData === 'string') {
                agentResponse = jsonData;
              }
            } catch (e) {
              agentResponse = data;
            }
          }
          
          return agentResponse;
          
        } catch (error) {
          console.error('❌ Message send failed for ${agentName}:', error);
          
          // Fallback: Try direct webhook
          try {
            const directResponse = await fetch('https://abhixchawla.app.n8n.cloud/webhook/49ccefa1-44e4-4117-9cac-00e147f79cc9/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(webhookPayload)
            });
            
            if (directResponse.ok) {
              const directData = await directResponse.text();
              return directData || "Thank you for your message! I'm here to help you.";
            }
          } catch (fallbackError) {
            console.error('❌ Fallback webhook also failed for ${agentName}:', fallbackError);
          }
          
          return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.";
        }
      }

      // Handle search submission for this specific agent
      window['handleAISearch_' + agentIdClean] = async function(event) {
        event.preventDefault();
        var query = input.value.trim();
        if (!query) return;

        // Show results container
        results.style.display = 'block';
        status.style.display = 'flex';
        status.innerHTML = '<div style="width: 16px; height: 16px; border: 2px solid #e5e7eb; border-top: 2px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>Thinking...';
        
        // Add user query to results
        var userItem = document.createElement('div');
        userItem.style.cssText = 'background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; font-size: 14px; color: #374151;';
        userItem.innerHTML = '<strong>You:</strong> ' + query;
        list.appendChild(userItem);
        
        // Clear input
        input.value = '';
        
        try {
          // Send message to backend
          const response = await sendMessage(query);
          
          // Hide loading
          status.style.display = 'none';
          
          // Add AI response
          var agentResponse = document.createElement('div');
          agentResponse.style.cssText = 'background: #eef2ff; border: 1px solid #e0e7ff; border-radius: 8px; padding: 12px; font-size: 14px; color: #1f2937;';
          agentResponse.innerHTML = '<strong>${agentName}:</strong> ' + response;
          list.appendChild(agentResponse);
          
          // Scroll to show the new response
          results.scrollTop = results.scrollHeight;
          
        } catch (error) {
          console.error('❌ Error for ${agentName}:', error);
          status.style.display = 'none';
          
          var errorItem = document.createElement('div');
          errorItem.style.cssText = 'background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px; font-size: 14px; color: #991b1b;';
          errorItem.innerHTML = '<strong>Error:</strong> I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.';
          list.appendChild(errorItem);
        }
      };

      console.log('🚀 AI Search Bar initialized for ${agentName} (${agentId})');
      console.log('📊 Agent Configuration:', {
        agentId: agentConfig.agentId,
        agentName: agentConfig.agentName,
        agentGoal: agentConfig.agentGoal,
        agentTone: agentConfig.agentTone,
        visitorId: visitorId,
        hasSession: !!sessionToken
      });
    })();
  </script>
</div>`;
  };

  const searchBarEmbedCode = generateUniqueEmbedCode();

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(searchBarEmbedCode);
    toast({
      title: "Copied!",
      description: `Complete AI search bar embed code for ${agent.name} copied to clipboard`,
    });
  };

  const previewUrl = `data:text/html;base64,${btoa(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Search Bar Preview - ${agent.name}</title>
    <style>
        body { 
            margin: 0; 
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .hero-section {
            max-width: 900px;
            margin: 0 auto;
            padding: 60px 20px;
            text-align: center;
            color: white;
        }
        .hero-title {
            font-size: 48px;
            font-weight: 700;
            margin-bottom: 16px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .hero-subtitle {
            font-size: 20px;
            margin-bottom: 40px;
            opacity: 0.9;
            font-weight: 300;
        }
        .search-container {
            background: rgba(255,255,255,0.95);
            border-radius: 16px;
            padding: 32px;
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }
    </style>
</head>
<body>
    <div class="hero-section">
        <h1 class="hero-title">Welcome to Our Website</h1>
        <p class="hero-subtitle">Get instant answers with ${agent.name}</p>
        
        <div class="search-container">
            ${searchBarEmbedCode}
        </div>
        
        <p style="margin-top: 24px; font-size: 14px; opacity: 0.8;">
            Try typing a question to see how ${agent.name} responds!
        </p>
    </div>
</body>
</html>`)}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Embed {agent.name} - Complete AI Search Bar</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex gap-2">
            <Button onClick={copyEmbedCode} className="flex-1">
              <Copy className="w-4 h-4 mr-2" />
              Copy {agent.name}'s Embed Code
            </Button>
            <Button variant="outline" asChild>
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Preview
              </a>
            </Button>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">
              {agent.name}'s Complete AI Search Bar Code:
            </label>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-96 font-mono">
                {searchBarEmbedCode}
              </pre>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              This embed code is unique to {agent.name} and includes all agent data. Paste it wherever you want the AI search bar to appear on your website.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Agent-Specific Features:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• ✅ Unique Agent ID: {agent.agent_id || agent.id}</li>
              <li>• ✅ Agent Name: {agent.name}</li>
              <li>• ✅ Agent Goal: {agent.goal || 'Not set'}</li>
              <li>• ✅ Agent Tone: {agent.tone || 'Not set'}</li>
              <li>• ✅ Agent Instructions: {agent.instructions ? 'Configured' : 'Not set'}</li>
              <li>• ✅ Created: {new Date(agent.created_at).toLocaleDateString()}</li>
              <li>• ✅ Status: {agent.status}</li>
              <li>• ✅ Complete backend integration with your webhook</li>
              <li>• ✅ Unique visitor tracking per agent</li>
              <li>• ✅ Professional design with smooth animations</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentEmbedModal;
