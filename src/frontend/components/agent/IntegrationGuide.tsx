
import { useState } from "react";
import { Book, Code, Webhook, Copy, ExternalLink, ChevronRight, CheckCircle } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/frontend/components/ui/tabs";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import { useToast } from "@/frontend/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/frontend/components/ui/dialog";

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

interface IntegrationGuideProps {
  agents: Agent[];
}

const IntegrationGuide = ({ agents }: IntegrationGuideProps) => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(agents[0] || null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const { toast } = useToast();

  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${description} copied to clipboard`,
    });
  };

  const markStepComplete = (stepNumber: number) => {
    if (!completedSteps.includes(stepNumber)) {
      setCompletedSteps([...completedSteps, stepNumber]);
    }
  };

  const webhookCode = `// Custom chat integration example
const sendMessageToAgent = async (message, agentId) => {
  try {
    const response = await fetch('https://abhixchawla.app.n8n.cloud/webhook/49ccefa1-44e4-4117-9cac-00e147f79cc9/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agent_id: agentId,
        agent_uuid: agentId, // This is the UUID primary key
        user_message: message,
        visitor_id: generateVisitorId(),
        session_id: generateSessionId(),
        timestamp: new Date().toISOString()
      })
    });
    
    if (response.ok) {
      console.log('Message sent successfully');
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

// Generate unique visitor ID
function generateVisitorId() {
  let visitorId = localStorage.getItem('chat_visitor_id');
  if (!visitorId) {
    visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('chat_visitor_id', visitorId);
  }
  return visitorId;
}

// Generate unique session ID
function generateSessionId() {
  let sessionId = sessionStorage.getItem('chat_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('chat_session_id', sessionId);
  }
  return sessionId;
}`;

  const customChatExample = `<!-- Custom Chat Interface Example -->
<div id="custom-chat" style="
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
">
  <!-- Chat Header -->
  <div style="
    background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
    color: white;
    padding: 16px;
    border-radius: 12px 12px 0 0;
    font-weight: 600;
  ">
    ${selectedAgent?.name || 'Your Agent'}
  </div>
  
  <!-- Messages Container -->
  <div id="messages" style="
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
  ">
    <div style="
      background: #f3f4f6;
      padding: 12px;
      border-radius: 12px;
      max-width: 80%;
      align-self: flex-start;
    ">
      Hello! How can I help you today?
    </div>
  </div>
  
  <!-- Input Area -->
  <div style="
    padding: 16px;
    border-top: 1px solid #e5e7eb;
    display: flex;
    gap: 8px;
  ">
    <input 
      type="text" 
      id="message-input"
      placeholder="Type your message..."
      style="
        flex: 1;
        padding: 12px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        outline: none;
      "
    />
    <button 
      onclick="sendCustomMessage()"
      style="
        background: #4f46e5;
        color: white;
        border: none;
        border-radius: 8px;
        padding: 12px 16px;
        cursor: pointer;
      "
    >
      Send
    </button>
  </div>
</div>

<script>
async function sendCustomMessage() {
  const input = document.getElementById('message-input');
  const messagesContainer = document.getElementById('messages');
  
  if (!input.value.trim()) return;
  
  const userMessage = input.value.trim();
  
  // Add user message to chat
  const userMsg = document.createElement('div');
  userMsg.style.cssText = 'background: #4f46e5; color: white; padding: 12px; border-radius: 12px; max-width: 80%; align-self: flex-end; margin-left: auto;';
  userMsg.textContent = userMessage;
  messagesContainer.appendChild(userMsg);
  
  input.value = '';
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
  
  // Send to webhook
  await sendMessageToAgent(userMessage, '${selectedAgent?.id || 'your-agent-id'}');
  
  // Simulate agent response (replace with actual webhook response handling)
  setTimeout(() => {
    const agentMsg = document.createElement('div');
    agentMsg.style.cssText = 'background: #f3f4f6; color: #374151; padding: 12px; border-radius: 12px; max-width: 80%; align-self: flex-start;';
    agentMsg.textContent = 'Thank you for your message! This is a demo response.';
    messagesContainer.appendChild(agentMsg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 1000);
}

// Add the sendMessageToAgent function from above here
${webhookCode}
</script>`;

  const steps = [
    {
      title: "Choose Your Agent",
      description: "Select which agent you want to integrate into your website",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            First, select the agent you want to integrate. Each agent has its own unique ID and embed code.
          </p>
          {agents.length > 0 ? (
            <div className="space-y-2">
              {agents.map((agent) => (
                <Card 
                  key={agent.id} 
                  className={`cursor-pointer transition-colors ${selectedAgent?.id === agent.id ? 'bg-primary/5 border-primary' : 'hover:bg-muted/50'}`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{agent.name}</h4>
                        <p className="text-sm text-muted-foreground">ID: {agent.id}</p>
                      </div>
                      <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                        {agent.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No agents found. Create an agent first to continue.</p>
          )}
          <Button onClick={() => markStepComplete(1)} variant="outline" size="sm">
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark Complete
          </Button>
        </div>
      )
    },
    {
      title: "Get Your Embed Code",
      description: "Copy the ready-to-use embed code for your website",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Use this embed code to quickly add your agent to any website. Just paste it before the closing &lt;/body&gt; tag.
          </p>
          {selectedAgent && (
            <div className="space-y-4">
              <div className="relative">
                <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-40 font-mono">
                  {selectedAgent.embed_code}
                </pre>
                <Button 
                  size="sm" 
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(selectedAgent.embed_code, "Embed code")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Quick Setup:</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Copy the embed code above</li>
                  <li>Paste it in your website's HTML before &lt;/body&gt;</li>
                  <li>Save and publish your website</li>
                  <li>Your agent is now live!</li>
                </ol>
              </div>
            </div>
          )}
          <Button onClick={() => markStepComplete(2)} variant="outline" size="sm">
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark Complete
          </Button>
        </div>
      )
    },
    {
      title: "Test Your Integration",
      description: "Verify that your agent is working correctly on your website",
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground">
            After embedding the code, test your integration to ensure everything works properly.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-900 mb-2">Testing Checklist:</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>✓ Chat widget appears on your website</li>
              <li>✓ Agent responds to messages</li>
              <li>✓ Widget is mobile-responsive</li>
              <li>✓ Styling matches your website</li>
            </ul>
          </div>
          <Button onClick={() => markStepComplete(3)} variant="outline" size="sm">
            <CheckCircle className="w-4 h-4 mr-2" />
            Mark Complete
          </Button>
        </div>
      )
    }
  ];

  if (!agents.length) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            Integration Guide
          </CardTitle>
          <CardDescription>
            Create an agent first to access the integration guide.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Book className="w-5 h-5" />
          Integration Guide
        </CardTitle>
        <CardDescription>
          Learn how to integrate your AI agent into your website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="quick-start" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quick-start">Quick Start</TabsTrigger>
            <TabsTrigger value="custom-integration">Custom Integration</TabsTrigger>
            <TabsTrigger value="webhook-api">Webhook API</TabsTrigger>
          </TabsList>

          <TabsContent value="quick-start" className="space-y-6">
            <div className="space-y-6">
              {steps.map((step, index) => (
                <Card key={index} className={`border-border ${completedSteps.includes(index + 1) ? 'bg-green-50 border-green-200' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        completedSteps.includes(index + 1) 
                          ? 'bg-green-500 text-white' 
                          : 'bg-primary text-primary-foreground'
                      }`}>
                        {completedSteps.includes(index + 1) ? '✓' : index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <CardDescription>{step.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {step.content}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom-integration" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Build Your Own Chat Interface</h3>
                <p className="text-muted-foreground mb-4">
                  Create a custom chat interface that perfectly matches your website design.
                </p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Custom Chat Interface Example:</label>
                  <div className="relative">
                    <ScrollArea className="h-96">
                      <pre className="bg-muted p-4 rounded-lg text-xs font-mono">
                        {customChatExample}
                      </pre>
                    </ScrollArea>
                    <Button 
                      size="sm" 
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(customChatExample, "Custom chat code")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Preview Custom Chat
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Custom Chat Preview</DialogTitle>
                      <DialogDescription>
                        This is how your custom chat interface could look
                      </DialogDescription>
                    </DialogHeader>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
                          <h4 className="font-medium">{selectedAgent?.name || 'Your Agent'}</h4>
                        </div>
                        <div className="p-4 space-y-3 h-48 overflow-y-auto">
                          <div className="bg-gray-100 p-3 rounded-lg max-w-[80%]">
                            Hello! How can I help you today?
                          </div>
                          <div className="bg-blue-500 text-white p-3 rounded-lg max-w-[80%] ml-auto">
                            This looks great!
                          </div>
                        </div>
                        <div className="p-4 border-t flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Type your message..."
                            className="flex-1 p-2 border rounded"
                            disabled
                          />
                          <button className="bg-blue-500 text-white px-4 py-2 rounded">
                            Send
                          </button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="webhook-api" className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Webhook Integration</h3>
                <p className="text-muted-foreground mb-4">
                  Send messages directly to our webhook for custom integrations and data processing.
                </p>
              </div>
              
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Webhook className="w-4 h-4" />
                    Webhook Endpoint
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-3 rounded font-mono text-sm mb-4">
                    https://abhixchawla.app.n8n.cloud/webhook/49ccefa1-44e4-4117-9cac-00e147f79cc9/chat
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                                          onClick={() => copyToClipboard('https://abhixchawla.app.n8n.cloud/webhook/49ccefa1-44e4-4117-9cac-00e147f79cc9/chat', 'Webhook URL')}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy URL
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base">Required Payload</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg text-xs font-mono overflow-auto">
{`{
  "agent_id": "${selectedAgent?.id || 'your-agent-id'}",
  "user_message": "Hello, I need help with...",
  "visitor_id": "visitor_123456789_abc",
  "session_id": "session_123456789_def",
  "timestamp": "2024-01-01T12:00:00.000Z"
}`}
                    </pre>
                    <Button 
                      size="sm" 
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(`{
  "agent_id": "${selectedAgent?.id || 'your-agent-id'}",
  "user_message": "Hello, I need help with...",
  "visitor_id": "visitor_123456789_abc",
  "session_id": "session_123456789_def",
  "timestamp": "2024-01-01T12:00:00.000Z"
}`, "Payload example")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="text-base">JavaScript Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <ScrollArea className="h-64">
                      <pre className="bg-muted p-4 rounded-lg text-xs font-mono">
                        {webhookCode}
                      </pre>
                    </ScrollArea>
                    <Button 
                      size="sm" 
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(webhookCode, "JavaScript code")}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IntegrationGuide;
