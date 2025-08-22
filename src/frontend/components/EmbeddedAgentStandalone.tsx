import { useState, useRef, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import { Card, CardContent } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { 
  Search, 
  Send, 
  Bot, 
  User, 
  X, 
  Sparkles,
  MessageSquare,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface EmbeddedAgentStandaloneProps {
  agentUrl: string;
  agentName?: string;
  className?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'light' | 'dark';
}

const EmbeddedAgentStandalone = ({ 
  agentUrl, 
  agentName = "AI Assistant", 
  className,
  position = 'bottom-right',
  theme = 'light'
}: EmbeddedAgentStandaloneProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive - optimized
  useEffect(() => {
    if (scrollAreaRef.current) {
      requestAnimationFrame(() => {
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
        }
      });
    }
  }, [messages]);

  // Focus input when expanded - optimized
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [isExpanded]);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);
    setIsLoading(true);

    try {
      // Call your agent API
      const response = await fetch(agentUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          timestamp: new Date().toISOString()
        })
      });

      // Removed artificial delay for better performance

      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thank you for your message! I'm here to help you with any questions or assistance you need.",
        sender: 'agent',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, agentMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  }, [inputMessage, isTyping, agentUrl]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    // Prevent space key from triggering page navigation
    if (e.key === ' ') {
      e.stopPropagation();
    }
    
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleExpand = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const handleCollapse = useCallback(() => {
    setIsExpanded(false);
    setMessages([]);
  }, []);

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  };

  const themeClasses = {
    light: {
      card: 'bg-white/95 backdrop-blur-sm border-gray-200/50',
      header: 'bg-gradient-to-r from-blue-500 to-purple-600',
      input: 'border-gray-200 focus:border-blue-500',
      message: {
        user: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
        agent: 'bg-gray-100 text-gray-900'
      }
    },
    dark: {
      card: 'bg-gray-900/95 backdrop-blur-sm border-gray-700/50',
      header: 'bg-gradient-to-r from-gray-800 to-gray-900',
      input: 'border-gray-600 focus:border-blue-400 bg-gray-800 text-white',
      message: {
        user: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
        agent: 'bg-gray-800 text-gray-100'
      }
    }
  };

  return (
    <div className={cn(
      "fixed z-50",
      positionClasses[position],
      className
    )}>
      <AnimatePresence>
        {!isExpanded ? (
          // Collapsed State - Floating Chat Button
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative"
          >
            <Button
              onClick={handleExpand}
              size="lg"
              className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
            >
              <MessageSquare className="w-6 h-6" />
            </Button>
            
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="absolute -top-2 -right-2"
            >
              <Badge className="bg-green-500 text-white border-0 px-2 py-0.5 text-xs font-medium">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-1" />
                AI
              </Badge>
            </motion.div>
          </motion.div>
        ) : (
          // Expanded State - Full Chat Interface
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="relative"
          >
            <Card className={cn(
              "w-80 h-96 border-2 shadow-2xl overflow-hidden",
              themeClasses[theme].card
            )}>
              {/* Header */}
              <div className={cn("p-4 text-white", themeClasses[theme].header)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{agentName}</h3>
                      <p className="text-sm text-blue-100">AI Assistant</p>
                    </div>
                  </div>
                  <Button
                    onClick={handleCollapse}
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 rounded-full w-8 h-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="h-64">
                <ScrollArea ref={scrollAreaRef} className="h-full p-4">
                  <div className="space-y-3">
                    {messages.length === 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center py-6"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-2">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1 text-sm">Welcome!</h3>
                        <p className="text-xs text-gray-500">How can I help you today?</p>
                      </motion.div>
                    )}

                    <AnimatePresence>
                      {messages.map((message, index) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className={cn(
                            "flex gap-2",
                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                          )}
                        >
                          {message.sender === 'agent' && (
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                              <Bot className="w-3 h-3 text-white" />
                            </div>
                          )}
                          
                          <div
                            className={cn(
                              "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                              message.sender === 'user'
                                ? themeClasses[theme].message.user + " ml-auto"
                                : themeClasses[theme].message.agent + " mr-auto"
                            )}
                          >
                            {message.sender === 'agent' && (
                              <div className="text-black font-medium text-xs mb-1">Milna</div>
                            )}
                            <p className="leading-relaxed">{message.content}</p>
                            <p className={cn(
                              "text-xs mt-1",
                              message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                            )}>
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                          
                          {message.sender === 'user' && (
                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                              <User className="w-3 h-3 text-gray-600" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* Typing indicator */}
                    {isTyping && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-2 justify-start"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                        <div className={cn("rounded-2xl px-3 py-2", themeClasses[theme].message.agent)}>
                          <div className="text-black font-medium text-xs mb-1">Milna</div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>typing</span>
                            <div className="flex space-x-1">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </ScrollArea>
              </div>

              {/* Input */}
              <div className="border-t bg-gray-50/50 p-3">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className={cn("flex-1 text-sm", themeClasses[theme].input)}
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full px-3 py-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isTyping ? (
                      <div className="flex items-center gap-1 text-xs">
                        <span>Milna typing</span>
                        <div className="flex items-center">
                          {[1, 2, 3].map((dot) => (
                            <div
                              key={dot}
                              className="w-1 h-1 bg-white rounded-full mx-0.5 animate-pulse"
                              style={{
                                animationDelay: `${dot * 0.15}s`,
                                animationDuration: '1.2s'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmbeddedAgentStandalone;
