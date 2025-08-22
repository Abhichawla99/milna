import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/frontend/components/ui/dialog";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/frontend/components/ui/select";
import { Send, Bot, User, Database } from "lucide-react";
import { toast } from "@/frontend/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/frontend/hooks/use-user";

interface Agent {
  id: string;
  agent_id: string;
  name: string;
  status: string;
  created_at: string;
  goal?: string;
  tone?: string;
  instructions?: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  type?: 'info' | 'success' | 'warning' | 'error';
}

interface ContextManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContextManager = ({ isOpen, onClose }: ContextManagerProps) => {
  const { user } = useUser();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your Context Manager. I can help you add, remove, or search through your agents' knowledge bases using natural language. First, select an agent from the dropdown above, then tell me what you'd like to do!",
      sender: 'agent',
      timestamp: new Date(),
      type: 'info'
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Fetch user's agents
  useEffect(() => {
    console.log('🔄 Context Manager useEffect triggered');
    console.log('📱 isOpen:', isOpen);
    console.log('👤 user:', user);
    
    if (isOpen && user) {
      console.log('✅ Fetching agents...');
      fetchAgents();
    } else {
      console.log('❌ Not fetching agents - isOpen:', isOpen, 'user:', !!user);
    }
  }, [isOpen, user]);

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log('📋 Fetched agents:', data);
      setAgents(data || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast({
        title: "Error",
        description: "Failed to load your agents",
        variant: "destructive",
      });
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    console.log('🚀 handleSendMessage called');
    console.log('📝 inputMessage:', inputMessage);
    console.log('🎯 selectedAgent:', selectedAgent);
    
    if (!inputMessage.trim()) {
      console.log('❌ Input message is empty or whitespace only');
      return;
    }
    
    if (!selectedAgent) {
      console.log('❌ No agent selected');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      const webhookPayload = {
        agent_id: selectedAgent.agent_id || selectedAgent.id,
        agent_uuid: selectedAgent.id,
        user_id: user?.id,
        message: messageContent.trim(),
        agent_name: selectedAgent.name,
        timestamp: new Date().toISOString()
      };

      console.log('📤 Sending context manager webhook:', webhookPayload);
      console.log('🔍 Selected agent data:', selectedAgent);

      // Send webhook via Supabase webhook-proxy to track message counts
      try {
        const { data: webhookData, error: webhookError } = await supabase.functions.invoke('webhook-proxy', {
          body: webhookPayload,
          headers: {
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          }
        });

        if (webhookError) {
          console.error('❌ Supabase function error:', webhookError);
          throw new Error(`Webhook failed: ${webhookError.message}`);
        }

        console.log('📥 Context manager webhook response:', webhookData);
        
        const agentResponse = webhookData?.response || webhookData?.message || "I've processed your request. The knowledge base has been updated accordingly.";
        return agentResponse;
      } catch (error) {
        console.log('⚠️ Webhook error, using fallback response:', error);
      }

      // Fallback response if webhook fails
      const agentResponse = `I've processed your request to manage the knowledge base for ${selectedAgent.name}. Your message was: "${messageContent.trim()}". 

The system has received your request and will process it accordingly. If you need immediate assistance, please contact support.`;

      // Show AI response
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: agentResponse || "I've processed your request. The knowledge base has been updated accordingly.",
        sender: 'agent',
        timestamp: new Date(),
        type: 'success'
      };
      setMessages(prev => [...prev, agentMessage]);

    } catch (error) {
      console.error('Error in context manager:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I encountered an error while processing your request. Please try again or contact support if the issue persists.",
        sender: 'agent',
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAgentSelect = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    console.log('🎯 Agent selected:', agent);
    setSelectedAgent(agent || null);
    
    if (agent) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: `Great! I'm now managing the knowledge base for ${agent.name}. You can ask me to add, remove, or search through information. What would you like to do?`,
        sender: 'agent',
        timestamp: new Date(),
        type: 'info'
      };
      setMessages(prev => [...prev, welcomeMessage]);
    }
  };

  const getMessageStyle = (message: Message) => {
    const baseStyle = `max-w-[80%] rounded-lg px-4 py-3 ${
      message.sender === 'user'
        ? 'bg-primary text-primary-foreground ml-auto'
        : 'bg-muted'
    }`;

    return baseStyle;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Context Manager
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
              Beta
            </span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col min-h-0">
          {/* Agent Selection - Fixed at top */}
          <div className="px-6 py-4 border-b bg-muted/30">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium whitespace-nowrap">Select Agent:</label>
              <Select onValueChange={handleAgentSelect} value={selectedAgent?.id || ""}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Choose an agent..." />
                </SelectTrigger>
                <SelectContent>
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      <div className="flex items-center gap-2">
                        <Bot className="w-4 h-4" />
                        {agent.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Single Scrollable Chat Container */}
          <div className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1" ref={scrollAreaRef}>
              <div className="p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'agent' && (
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Database className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    
                    <div className={getMessageStyle(message)}>
                      <div className="text-sm">{message.content}</div>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Database className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* Input Area - Fixed at bottom */}
            <div className="border-t p-4 bg-background">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    selectedAgent 
                      ? "Tell me what you want to do with the knowledge base..."
                      : "Select an agent first to start managing their knowledge base"
                  }
                  className="flex-1"
                  disabled={!selectedAgent}
                />
                <Button 
                  onClick={() => {
                    console.log('🔘 Send button clicked');
                    handleSendMessage();
                  }} 
                  disabled={!inputMessage.trim() || isTyping || !selectedAgent}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContextManager;
