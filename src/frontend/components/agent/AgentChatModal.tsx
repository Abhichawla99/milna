import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/frontend/components/ui/dialog";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import { Send, Bot, User, AlertTriangle } from "lucide-react";
import { 
  generateVisitorId, 
  generateSessionId, 
  createOrFindConversation, 
  storeMessage,
  sendChatWebhook
} from "@/frontend/utils/chatTracking";
import { ensureUrlProtocol } from "@/frontend/utils/urlHelpers";
import responseListener from "@/frontend/utils/responseListener";
import { useSubscription } from "@/frontend/hooks/useSubscription";
import { toast } from "@/frontend/hooks/use-toast";

interface Agent {
  id: string;
  name: string;
  status: string;
  embed_code: string;
  created_at: string;
}

interface AgentChatModalProps {
  agent: Agent;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

const AgentChatModal = ({ agent, isOpen, onClose }: AgentChatModalProps) => {
  const {
    messageCount,
    messageLimit,
    messagesRemaining,
    isLimitReached,
    subscribed,
    appsumoAccess
  } = useSubscription();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello! I'm ${agent.name}. How can I help you today?`,
      sender: 'agent',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [visitorId] = useState(() => generateVisitorId());
  const [sessionId] = useState(() => generateSessionId());
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const hasProAccess = subscribed || appsumoAccess;

  // Initialize conversation when modal opens
  useEffect(() => {
    if (isOpen && !conversationId) {
      const initializeConversation = async () => {
        const convId = await createOrFindConversation(visitorId, sessionId, agent.id);
        if (convId) {
          setConversationId(convId);
          // Store the initial agent message
          await storeMessage(convId, 'agent', `Hello! I'm ${agent.name}. How can I help you today?`);
        }
      };
      initializeConversation();
    }
  }, [isOpen, conversationId, visitorId, sessionId, agent.id, agent.name]);

  // Cleanup response listener when modal closes
  useEffect(() => {
    if (!isOpen) {
      responseListener.stopPolling();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Check message limit before sending
    if (isLimitReached && !hasProAccess) {
      toast({
        title: "Message Limit Reached",
        description: `You've used all ${messageLimit} free messages. Upgrade to Pro for unlimited messaging.`,
        variant: "destructive",
      });
      return;
    }

    // Show warning when approaching limit
    if (messagesRemaining <= 10 && !hasProAccess) {
      toast({
        title: "Message Limit Warning",
        description: `You have ${messagesRemaining} messages remaining. Consider upgrading to Pro for unlimited messaging.`,
        variant: "default",
      });
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
      // Store user message in database
      if (conversationId) {
        await storeMessage(conversationId, 'user', messageContent);
      }

      // Generate visitor and session IDs if not exists
      const visitorId = localStorage.getItem('chat_visitor_id') || crypto.randomUUID();
      localStorage.setItem('chat_visitor_id', visitorId);
      
      const sessionId = sessionStorage.getItem('chat_session_id') || `session_${Date.now()}_${Math.random().toString(36)}`;
      sessionStorage.setItem('chat_session_id', sessionId);

      console.log('Sending webhook:', {
        agent_id: agent.id,
        user_message: messageContent,
        visitor_id: visitorId,
        session_id: sessionId
      });

      // Send webhook to n8n and handle response
      const webhookUrl = ensureUrlProtocol('abhixchawla.app.n8n.cloud/webhook/49ccefa1-44e4-4117-9cac-00e147f79cc9/chat');
      
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: agent.agent_id || agent.id, // Use agent_id field if available, fallback to id
          agent_uuid: agent.id, // This is the UUID primary key
          user_message: messageContent.trim(),
          visitor_id: visitorId,
          session_id: sessionId,
          conversation_id: conversationId,
          timestamp: new Date().toISOString()
        })
      });

      console.log('Webhook sent, status:', webhookResponse.status);

      if (!webhookResponse.ok) {
        console.error('Webhook call failed:', webhookResponse.status);
        throw new Error(`Webhook failed with status ${webhookResponse.status}`);
      }

      // Try to get immediate response first
      const responseText = await webhookResponse.text();
      console.log('Immediate webhook response:', responseText);

      let agentResponse = responseText;

      // Try to parse as JSON if it looks like JSON
      if (responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
        try {
          const data = JSON.parse(responseText);
          console.log('Parsed JSON response:', data);
          
          // Use flexible field parsing for JSON responses
          agentResponse = data.response || data.output || data.message || data.reply || data.text || responseText;
          
          // Log the specific fields we found
          console.log('Response parsing results:');
          console.log('- data.response:', data.response);
          console.log('- data.output:', data.output);
          console.log('- data.message:', data.message);
          console.log('- data.success:', data.success);
          console.log('- Final agentResponse:', agentResponse);
          
          // Special handling for n8n response format
          if (data.response && data.success !== undefined) {
            console.log('✅ Detected n8n response format');
            agentResponse = data.response;
          }
        } catch (parseError) {
          console.log('Failed to parse as JSON, using text response:', parseError);
          agentResponse = responseText;
        }
      }

      // If we got a valid response immediately, use it
      if (agentResponse && agentResponse.trim() !== '') {
        console.log('Using immediate response:', agentResponse);
        
        // Show AI response
        const agentMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: agentResponse,
          sender: 'agent',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, agentMessage]);
        
        // Store agent response in database
        if (conversationId) {
          await storeMessage(conversationId, 'agent', agentMessage.content);
        }
        
        setIsTyping(false);
      } else {
        // No immediate response, start polling
        console.log('No immediate response, starting polling...');
        await responseListener.startPolling({
          agentId: agent.agent_id || agent.id,
          visitorId,
          sessionId,
          conversationId,
          onResponse: async (responseText) => {
            console.log('Received response from n8n polling:', responseText);
            
            // Show AI response
            const agentMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: responseText,
              sender: 'agent',
              timestamp: new Date()
            };
            setMessages(prev => [...prev, agentMessage]);
            
            // Store agent response in database
            if (conversationId) {
              await storeMessage(conversationId, 'agent', agentMessage.content);
            }
            
            setIsTyping(false);
          },
          onError: (error) => {
            console.error('Error from n8n:', error);
            const errorMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: `Sorry, I encountered an error: ${error}`,
              sender: 'agent',
              timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
            setIsTyping(false);
          },
          onTimeout: () => {
            console.log('Response timeout');
            const timeoutMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: "I'm taking longer than expected to respond. Please try again or check back later.",
              sender: 'agent',
              timestamp: new Date()
            };
            setMessages(prev => [...prev, timeoutMessage]);
            setIsTyping(false);
          },
          timeoutMs: 30000, // 30 seconds timeout
          pollIntervalMs: 2000 // Check every 2 seconds
        });
      }

    } catch (error) {
      console.error('Webhook error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble responding right now. Please try again.",
        sender: 'agent',
        timestamp: new Date()
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

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Chat with {agent.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
            <div className="space-y-4 py-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'agent' && (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  
                  {message.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-lg px-4 py-2">
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
          
          {/* Message Limit Warning */}
          {!hasProAccess && (isLimitReached || messagesRemaining <= 10) && (
            <div className="border-t border-red-200 bg-red-50 p-3">
              <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {isLimitReached 
                    ? `Message limit reached (${messageCount}/${messageLimit})`
                    : `${messagesRemaining} messages remaining`
                  }
                </span>
              </div>
              {isLimitReached && (
                <p className="text-xs text-red-600 mt-1">
                  Upgrade to Pro for unlimited messaging
                </p>
              )}
            </div>
          )}

          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isLimitReached && !hasProAccess 
                    ? "Message limit reached - upgrade to continue" 
                    : "Type your message..."
                }
                className="flex-1"
                disabled={isLimitReached && !hasProAccess}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputMessage.trim() || isTyping || (isLimitReached && !hasProAccess)}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {!hasProAccess && (
              <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                <span>Messages used: {messageCount}/{messageLimit}</span>
                <span>
                  {messagesRemaining > 0 ? `${messagesRemaining} remaining` : 'Limit reached'}
                </span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentChatModal;
