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
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

interface EmbeddedAgentProps {
  agentUrl: string;
  agentName?: string;
  className?: string;
}

// Memoized message component for better performance
const MessageBubble = memo(({ message }: { message: Message }) => (
  <div
    className={cn(
      "flex gap-3",
      message.sender === 'user' ? 'justify-end' : 'justify-start'
    )}
  >
    {message.sender === 'agent' && (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
    )}
    
    <div
      className={cn(
        "max-w-[80%] rounded-2xl px-4 py-3",
        message.sender === 'user'
          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white ml-auto'
          : 'bg-gray-100 text-gray-900 mr-auto'
      )}
    >
      {message.sender === 'agent' && (
        <div className="text-black font-medium text-xs mb-1">Milna</div>
      )}
      <p className="text-sm leading-relaxed">{message.content}</p>
      <p className={cn(
        "text-xs mt-2",
        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
      )}>
        {message.timestamp.toLocaleTimeString()}
      </p>
    </div>
    
    {message.sender === 'user' && (
      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
        <User className="w-4 h-4 text-gray-600" />
      </div>
    )}
  </div>
));

MessageBubble.displayName = 'MessageBubble';

// Memoized typing indicator
const TypingIndicator = memo(() => (
  <div className="flex gap-3 justify-start">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
      <Bot className="w-4 h-4 text-white" />
    </div>
    <div className="bg-gray-100 rounded-2xl px-4 py-3">
      <div className="text-black font-medium text-xs mb-1">Milna</div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>typing</span>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  </div>
));

TypingIndicator.displayName = 'TypingIndicator';

const EmbeddedAgent = ({ agentUrl, agentName = "AI Assistant", className }: EmbeddedAgentProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Optimized scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Focus input when expanded
  useEffect(() => {
    if (isExpanded && inputRef.current) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
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

    try {
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

      await new Promise(resolve => setTimeout(resolve, 1000));

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
    }
  }, [inputMessage, isTyping, agentUrl]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  }, []);

  const handleExpand = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const handleCollapse = useCallback(() => {
    setIsExpanded(false);
    setMessages([]);
  }, []);

  return (
    <div className={cn("w-full max-w-4xl mx-auto", className)}>
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          // Collapsed State - Simplified
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <Card className="border-2 border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/95 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 p-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder={`Ask ${agentName} anything...`}
                        className="border-0 bg-transparent text-lg placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
                        onFocus={handleExpand}
                        readOnly
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleExpand}
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full px-6 py-2 transition-all duration-200 hover:scale-105"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Start Chat
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="absolute -top-3 -right-3">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 px-3 py-1 text-xs font-medium">
                <MessageSquare className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
            </div>
          </motion.div>
        ) : (
          // Expanded State - Optimized
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <Card className="border-2 border-gray-200/50 shadow-2xl bg-white/95 backdrop-blur-sm overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
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
              <div className="h-96">
                <ScrollArea ref={scrollAreaRef} className="h-full p-4">
                  <div className="space-y-4">
                    {messages.length === 0 && (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-3">
                          <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1">Welcome to {agentName}!</h3>
                        <p className="text-sm text-gray-500">I'm here to help you with any questions or assistance you need.</p>
                      </div>
                    )}

                    {messages.map((message) => (
                      <MessageBubble key={message.id} message={message} />
                    ))}

                    {isTyping && <TypingIndicator />}
                  </div>
                </ScrollArea>
              </div>

              {/* Input */}
              <div className="border-t bg-gray-50/50 p-4">
                <div className="flex gap-3">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="flex-1 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isTyping}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full px-4 py-2 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isTyping ? (
                      <div className="flex items-center gap-1 text-xs">
                        <span>Milna typing</span>
                        <div className="flex items-center">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="w-1 h-1 bg-white rounded-full mx-0.5 animate-pulse"
                              style={{
                                animationDelay: `${i * 0.15}s`,
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

export default memo(EmbeddedAgent);
