import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, Send, X, Bot, User, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/frontend/components/ui/button';
import { Input } from '@/frontend/components/ui/input';
import { 
  generateVisitorId, 
  generateSessionId, 
  createOrFindConversation, 
  storeMessage 
} from '@/frontend/utils/chatTracking';
import analytics from '@/frontend/utils/analytics';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export function MilnaChatBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dynamic placeholder prompts that cycle through
  const placeholderPrompts = [
    "Ask Milna anything...",
    "How can I convert more visitors?",
    "What's your pricing structure?",
    "Show me a demo of your features",
    "How does the AI agent work?",
    "What makes you different from competitors?",
    "Can you help me with customer support?",
    "How do I integrate this into my website?",
    "What's your refund policy?",
    "Tell me about your success stories"
  ];

  // Milna AI configuration
  const agentConfig = {
    agentId: '2cfea522-a5ba-4df6-ae73-26809b25e0aa',
    agentUuid: '2cfea522-a5ba-4df6-ae73-26809b25e0aa',
    agentName: 'Milna',
    agentGoal: 'converting website visitors into booked demos, and help them find any answers',
    agentTone: 'friendly, subtle humour and confident',
    agentInstructions: 'make sure to keep collecting emails whenevr appropriate - when the questions are too complex , offer to book a demo so they can see it in action',
    agentCreatedAt: '2025-08-18T03:06:44.28221+00:00',
    supabaseUrl: 'https://fapojywavurprfbmeznj.supabase.co',
    webhookProxyUrl: 'https://fapojywavurprfbmeznj.supabase.co/functions/v1/webhook-proxy'
  };

  // Initialize visitor and session IDs, and conversation tracking
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState(0);

  // Rotate placeholder text with smooth transitions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholderIndex((prev) => (prev + 1) % placeholderPrompts.length);
    }, 4000); // Change every 4 seconds for better readability

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const initializeTracking = async () => {
      const visitorId = generateVisitorId();
      const sessionId = generateSessionId();
      
      // Create or find conversation for tracking
      const convId = await createOrFindConversation(
        visitorId,
        sessionId,
        agentConfig.agentId
      );
      
      if (convId) {
        setConversationId(convId);
        console.log('✅ Conversation tracking initialized:', convId);
      }
    };

    initializeTracking();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const cleanResponse = (response: string): string => {
    if (!response) return "Thank you for your message! I'm here to help you.";
    
    try {
      const parsed = JSON.parse(response);
      
      // Handle array format: [{"output": "message"}]
      if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].output) {
        return parsed[0].output;
      }
      
      // Handle object formats
      if (parsed.output) return parsed.output;
      if (parsed.response) return parsed.response;
      if (parsed.message) return parsed.message;
      if (parsed.reply) return parsed.reply;
      if (parsed.text) return parsed.text;
      
      // If it's a string, return it
      if (typeof parsed === 'string') return parsed;
      
    } catch (e) {
      // If JSON parsing fails, treat as plain text
    }
    
    // Remove extra quotes at start and end if it's a string
    response = response.replace(/^"|"$/g, '');
    
    return response.trim() || "Thank you for your message! I'm here to help you.";
  };

  const sendMessageToBackend = async (message: string): Promise<string> => {
    const visitorId = generateVisitorId();
    const sessionId = generateSessionId();
    
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
      session_id: sessionId,
      conversation_id: conversationId,
      embed_type: 'hero_search_bar',
      agent_status: 'active'
    };

    try {
      console.log('📨 Sending message to backend:', message);
      
      const response = await fetch(agentConfig.webhookProxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhcG9qeXdhdnVycHJmYm1lem5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTY2OTIsImV4cCI6MjA3MDUzMjY5Mn0.t970PnmFpE_-JwpLzCCqly-Buj6o2KaK9dtzXtABXf0'
        },
        body: JSON.stringify(webhookPayload)
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status}`);
      }

      const data = await response.text();
      console.log('✅ Message sent successfully');
      
      // Parse response with the same logic as the embed code
      let agentResponse = "Thank you for your message! I'm here to help you with any questions or assistance you need.";
      
      if (data) {
        try {
          const jsonData = JSON.parse(data);
          
          // Handle array format: [{"output": "message"}]
          if (Array.isArray(jsonData) && jsonData.length > 0 && jsonData[0].output) {
            agentResponse = jsonData[0].output;
          }
          // Handle single object format: {"output": "message"}
          else if (jsonData.output && typeof jsonData.output === 'string') {
            agentResponse = jsonData.output;
          }
          // Handle other common response formats
          else if (jsonData.response && typeof jsonData.response === 'string') {
            agentResponse = jsonData.response;
          } else if (jsonData.message && typeof jsonData.message === 'string') {
            agentResponse = jsonData.message;
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
      
      return cleanResponse(agentResponse);
    } catch (error) {
      console.error('❌ Error sending message:', error);
      
      // Fallback to direct n8n webhook
      try {
        const directResponse = await fetch('https://abhixchawla.app.n8n.cloud/webhook/49ccefa1-44e4-4117-9cac-00e147f79cc9/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookPayload)
        });
        
        if (directResponse.ok) {
          const directData = await directResponse.text();
          return cleanResponse(directData) || "Thank you for your message! I'm here to help you.";
        }
      } catch (fallbackError) {
        console.error('❌ Fallback webhook also failed:', fallbackError);
      }
      
      return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsExpanded(true);
    setIsLoading(true);

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      content: userMessage,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);

    // Store user message in database for tracking
    if (conversationId) {
      await storeMessage(conversationId, 'user', userMessage);
      setMessageCount(prev => prev + 1);
      console.log('📊 User message stored in database. Total messages:', messageCount + 1);
      
      // Track analytics
      analytics.track('chat_message_sent', {
        agent_id: agentConfig.agentId,
        conversation_id: conversationId,
        message_length: userMessage.length,
        total_messages: messageCount + 1
      });
    }

    try {
      // Simulate typing delay
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsTyping(false);

      // Send message to backend
      const response = await sendMessageToBackend(userMessage);

      // Add agent response
      const agentMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, agentMsg]);

      // Store agent response in database for tracking
      if (conversationId) {
        await storeMessage(conversationId, 'agent', response);
        setMessageCount(prev => prev + 1);
        console.log('📊 Agent message stored in database. Total messages:', messageCount + 2);
        
        // Track analytics
        analytics.track('chat_response_received', {
          agent_id: agentConfig.agentId,
          conversation_id: conversationId,
          response_length: response.length,
          total_messages: messageCount + 2
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    if (messages.length > 0) {
      setIsExpanded(true);
    }
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const clearConversation = () => {
    setMessages([]);
    setIsExpanded(false);
    setInputValue('');
    setIsLoading(false);
    setIsTyping(false);
    
    // Track conversation clear
    analytics.track('conversation_cleared', {
      agent_id: agentConfig.agentId,
      conversation_id: conversationId,
      total_messages: messageCount
    });
  };

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Chat Messages - Positioned above the search bar with fixed height and scroll */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="mb-8 rounded-3xl overflow-hidden relative"
            style={{
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.1)',
              maxHeight: '400px'
            }}
          >
            {/* Glow effect for chat container */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-pink-400/10 blur-2xl -z-10" />
            
            {/* Pulsing glow effect */}
            <motion.div 
              className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-pink-400/5 blur-xl -z-10"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Chat Header with Clear Button */}
            <div className="flex justify-between items-center p-4 pb-2 border-b border-white/10">
              <div className="flex items-center gap-3">
                {/* Girl Avatar Animation */}
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center shadow-lg">
                    <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    </div>
                  </div>
                  {/* Animated sparkles */}
                  <div className="absolute -top-1 -right-1">
                    <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">Chat with {agentConfig.agentName}</span>
                  <span className="text-xs text-white/70">Messages: {messageCount}</span>
                </div>
              </div>
              <Button
                onClick={clearConversation}
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>

            {/* Scrollable Chat Container */}
            <div 
              className="p-6 max-h-[350px] overflow-y-auto"
              style={{
                scrollBehavior: 'smooth',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(59, 130, 246, 0.3) transparent'
              }}
            >
              <div className="space-y-6">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-6 py-4 ${
                        message.isUser
                          ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 text-white shadow-xl'
                          : 'bg-white/90 text-gray-800 backdrop-blur-sm shadow-lg'
                      }`}
                      style={{
                        boxShadow: message.isUser 
                          ? '0 8px 25px rgba(59, 130, 246, 0.3)' 
                          : '0 4px 15px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {message.isUser ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <div className="relative">
                            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                              <div className="w-2 h-2 bg-white rounded-full flex items-center justify-center">
                                <div className="w-1 h-1 bg-pink-500 rounded-full"></div>
                              </div>
                            </div>
                            <div className="absolute -top-0.5 -right-0.5">
                              <Sparkles className="w-2 h-2 text-yellow-400 animate-pulse" />
                            </div>
                          </div>
                        )}
                        <span className="text-xs font-semibold text-white/90">
                          {message.isUser ? 'You' : agentConfig.agentName}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-white/90 text-gray-800 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="relative">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full flex items-center justify-center">
                              <div className="w-1 h-1 bg-purple-500 rounded-full"></div>
                            </div>
                          </div>
                          <div className="absolute -top-0.5 -right-0.5">
                            <Sparkles className="w-2 h-2 text-yellow-400 animate-pulse" />
                          </div>
                        </div>
                        <span className="text-xs font-semibold opacity-90">{agentConfig.agentName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce shadow-sm" />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce shadow-sm" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Bar */}
      <motion.form
        onSubmit={handleSubmit}
        className="relative flex gap-3 items-center z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative flex-1">
          {/* Enhanced glow effect - always active */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 blur-xl"
            style={{
              filter: 'blur(20px)',
              zIndex: -1
            }}
          />
          
          {/* Additional glow effect for the search bar */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/5 via-purple-400/5 to-pink-400/5 blur-lg -z-10" />
          
          <Input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={placeholderPrompts[currentPlaceholderIndex]}
            key={currentPlaceholderIndex} // Force re-render for smooth transition
            className="h-16 pl-12 pr-20 text-lg rounded-full backdrop-blur-2xl text-white placeholder:text-white placeholder:font-medium transition-all duration-500 cursor-text border-2 border-white/80 bg-white/25 shadow-2xl ring-4 ring-white/20"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 20px 40px rgba(255, 255, 255, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2)',
              '--tw-placeholder-opacity': '1',
              '--tw-text-opacity': '1'
            }}
          />
          {/* Search icon on the left */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Search className="w-5 h-5 transition-all duration-300 text-white scale-110" />
          </div>
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center gap-3">
            {isLoading && (
              <div className="w-6 h-6 border-2 border-blue-400/30 border-t-blue-500 rounded-full animate-spin" />
            )}
            <Button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className={`h-10 w-10 p-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 hover:from-blue-600 hover:via-purple-600 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 transform relative ${
                !inputValue.trim() ? 'animate-pulse' : ''
              }`}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #3b82f6)',
                boxShadow: inputValue.trim() 
                  ? '0 4px 15px rgba(59, 130, 246, 0.4)' 
                  : '0 4px 15px rgba(59, 130, 246, 0.2)'
              }}
            >
              {/* Glow effect for send button */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 blur-md -z-10" />
              <Send className="h-5 w-5 relative z-10" />
            </Button>
          </div>
        </div>
      </motion.form>

      {/* Powered by Milna AI */}
      <div className="flex justify-end mt-4">
        <span className="text-xs text-white/90 flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg" />
          Powered by Milna.io
        </span>
      </div>
    </div>
  );
}
