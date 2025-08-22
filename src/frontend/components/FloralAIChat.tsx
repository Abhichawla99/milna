"use client";

import { useEffect, useRef, useCallback, useTransition } from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
    ImageIcon,
    FileUp,
    Figma,
    MonitorIcon,
    CircleUserRound,
    ArrowUpIcon,
    Paperclip,
    PlusIcon,
    SendIcon,
    XIcon,
    LoaderIcon,
    Sparkles,
    Command,
    Bot,
    User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as React from "react";

interface UseAutoResizeTextareaProps {
    minHeight: number;
    maxHeight?: number;
}

function useAutoResizeTextarea({
    minHeight,
    maxHeight,
}: UseAutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const adjustHeight = useCallback(
        (reset?: boolean) => {
            const textarea = textareaRef.current;
            if (!textarea) return;

            if (reset) {
                textarea.style.height = `${minHeight}px`;
                return;
            }

            // Use requestAnimationFrame for better performance
            requestAnimationFrame(() => {
                if (!textarea) return;
                
                textarea.style.height = `${minHeight}px`;
                const newHeight = Math.max(
                    minHeight,
                    Math.min(
                        textarea.scrollHeight,
                        maxHeight ?? Number.POSITIVE_INFINITY
                    )
                );

                textarea.style.height = `${newHeight}px`;
            });
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    // Debounced resize handler for better performance
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => adjustHeight(), 100);
        };
        
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            clearTimeout(timeoutId);
        };
    }, [adjustHeight]);

    return { textareaRef, adjustHeight };
}

interface CommandSuggestion {
    icon: React.ReactNode;
    label: string;
    description: string;
    prefix: string;
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  containerClassName?: string;
  showRing?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, showRing = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    
    return (
      <div className={cn(
        "relative",
        containerClassName
      )}>
        <textarea
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
            "transition-all duration-200 ease-in-out",
            "placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed disabled:opacity-50",
            showRing ? "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0" : "",
            className
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {showRing && isFocused && (
          <motion.span 
            className="absolute inset-0 rounded-md pointer-events-none ring-2 ring-offset-0 ring-violet-500/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}

        {props.onChange && (
          <div 
            className="absolute bottom-2 right-2 opacity-0 w-2 h-2 bg-violet-500 rounded-full"
            style={{
              animation: 'none',
            }}
            id="textarea-ripple"
          />
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

interface Message {
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

// Simple message component
const MessageBubble = memo(({ message }: { message: Message }) => (
    <div
        className={cn(
            "flex gap-3",
            message.sender === 'user' ? 'justify-end' : 'justify-start'
        )}
    >
        {message.sender === 'ai' && (
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                <Bot className="w-3 h-3 text-white" />
            </div>
        )}
        
        <div
            className={cn(
                "max-w-[80%] rounded-lg px-3 py-2",
                message.sender === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
            )}
        >
            {message.sender === 'ai' && (
                <div className="text-xs font-medium mb-1 text-gray-600">Milna</div>
            )}
            <p className="text-sm">{message.content}</p>
        </div>
        
        {message.sender === 'user' && (
            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 text-gray-600" />
            </div>
        )}
    </div>
));

MessageBubble.displayName = 'MessageBubble';

// Simple typing indicator
const TypingIndicator = memo(() => (
    <div className="flex gap-3 justify-start">
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
            <Bot className="w-3 h-3 text-white" />
        </div>
        <div className="bg-gray-100 rounded-lg px-3 py-2">
            <div className="text-xs font-medium mb-1 text-gray-600">Milna</div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
                <span>typing</span>
                <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.1}s` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    </div>
));

TypingIndicator.displayName = 'TypingIndicator';

export function MilnaAIChat() {
    const [value, setValue] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
    const [showCommandPalette, setShowCommandPalette] = useState(false);
    const [recentCommand, setRecentCommand] = useState<string | null>(null);
    const { textareaRef, adjustHeight } = useAutoResizeTextarea({
        minHeight: 60,
        maxHeight: 200,
    });
    const [inputFocused, setInputFocused] = useState(false);
    const commandPaletteRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Agent configuration - you can make this configurable
    const agentConfig = {
        agentId: 'demo-agent',
        agentName: 'Milna',
        supabaseUrl: 'https://fapojywavurprfbmeznj.supabase.co',
        webhookProxyUrl: 'https://fapojywavurprfbmeznj.supabase.co/functions/v1/webhook-proxy'
    };

    const commandSuggestions: CommandSuggestion[] = [
        { 
            icon: <Sparkles className="w-4 h-4" />, 
            label: "Create Agent", 
            description: "Create a new AI agent", 
            prefix: "/create" 
        },
        { 
            icon: <FileUp className="w-4 h-4" />, 
            label: "Upload Document", 
            description: "Add knowledge to your agent", 
            prefix: "/upload" 
        },
        { 
            icon: <MonitorIcon className="w-4 h-4" />, 
            label: "Embed Widget", 
            description: "Get embed code for your website", 
            prefix: "/embed" 
        },
        { 
            icon: <Bot className="w-4 h-4" />, 
            label: "Configure Agent", 
            description: "Set up agent goals and tone", 
            prefix: "/config" 
        },
        { 
            icon: <Figma className="w-4 h-4" />, 
            label: "Pricing", 
            description: "Learn about our pricing plans", 
            prefix: "/pricing" 
        },
        { 
            icon: <CircleUserRound className="w-4 h-4" />, 
            label: "Features", 
            description: "Explore Milna features", 
            prefix: "/features" 
        },
    ];

    // Scroll to bottom when new messages arrive - optimized
    const scrollToBottom = useCallback(() => {
        if (messagesEndRef.current) {
            const messagesContainer = messagesEndRef.current.closest('.overflow-y-auto');
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }
    }, []);

    useEffect(() => {
        // Use requestAnimationFrame to ensure DOM is updated before scrolling
        requestAnimationFrame(() => {
            scrollToBottom();
        });
    }, [messages, scrollToBottom]);

    useEffect(() => {
        if (value.startsWith('/') && !value.includes(' ')) {
            setShowCommandPalette(true);
            
            const matchingSuggestionIndex = commandSuggestions.findIndex(
                (cmd) => cmd.prefix.startsWith(value)
            );
            
            if (matchingSuggestionIndex >= 0) {
                setActiveSuggestion(matchingSuggestionIndex);
            } else {
                setActiveSuggestion(-1);
            }
        } else {
            setShowCommandPalette(false);
        }
    }, [value]);



    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const commandButton = document.querySelector('[data-command-button]');
            
            if (commandPaletteRef.current && 
                !commandPaletteRef.current.contains(target) && 
                !commandButton?.contains(target)) {
                setShowCommandPalette(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const sendMessageToBackend = async (message: string): Promise<string> => {
        // Initialize user session
        let visitorId = localStorage.getItem('floral_visitor_id');
        if (!visitorId) {
            visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('floral_visitor_id', visitorId);
        }
        
        const sessionToken = localStorage.getItem('floral_session_token');

        const webhookPayload = {
            agent_id: agentConfig.agentId,
            agent_uuid: agentConfig.agentId,
            user_id: visitorId,
            message: message,
            agent_name: agentConfig.agentName,
            timestamp: new Date().toISOString(),
            source: 'floral_ai_chat',
            visitor_id: visitorId
        };

        try {
            console.log('📨 Sending message to backend:', message);
            
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
            console.log('✅ Message sent successfully');
            
            // Parse response
            let agentResponse = "Thank you for your message! I'm here to help you with any questions about Milna.";
            
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
            console.error('❌ Message send failed:', error);
            
            // Fallback: Try direct webhook
            try {
                const directResponse = await fetch('https://abhixchawla.app.n8n.cloud/webhook/49ccefa1-44e4-4117-9cac-00e147f79cc9/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(webhookPayload)
                });
                
                if (directResponse.ok) {
                    const directData = await directResponse.text();
                    return directData || "Thank you for your message! I'm here to help you with Milna.";
                }
            } catch (fallbackError) {
                console.error('❌ Fallback webhook also failed:', fallbackError);
            }
            
            return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.";
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Prevent space key from triggering page navigation
        if (e.key === ' ') {
            e.stopPropagation();
        }
        
        if (showCommandPalette) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveSuggestion(prev => 
                    prev < commandSuggestions.length - 1 ? prev + 1 : 0
                );
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveSuggestion(prev => 
                    prev > 0 ? prev - 1 : commandSuggestions.length - 1
                );
            } else if (e.key === 'Tab' || e.key === 'Enter') {
                e.preventDefault();
                if (activeSuggestion >= 0) {
                    const selectedCommand = commandSuggestions[activeSuggestion];
                    setValue(selectedCommand.prefix + ' ');
                    setShowCommandPalette(false);
                    
                    setRecentCommand(selectedCommand.label);
                    setTimeout(() => setRecentCommand(null), 3500);
                }
            } else if (e.key === 'Escape') {
                e.preventDefault();
                setShowCommandPalette(false);
            }
        } else if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim()) {
                handleSendMessage();
            }
        }
    };

    const handleSendMessage = useCallback(async () => {
        if (!value.trim() || isTyping) return;
        
        const userMessage = value.trim();
        
        // Add user message immediately
        const userMsg: Message = {
            id: Date.now().toString(),
            content: userMessage,
            sender: 'user',
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMsg]);
        setValue("");
        adjustHeight(true);
        setIsTyping(true);

        try {
            // Send to backend and get response
            const aiResponse = await sendMessageToBackend(userMessage);
            
            // Add AI response
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                content: aiResponse,
                sender: 'ai',
                timestamp: new Date()
            };
            
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error('Error sending message:', error);
            
            // Add error message
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
                sender: 'ai',
                timestamp: new Date()
            };
            
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    }, [value, isTyping, adjustHeight]);

    const selectCommandSuggestion = (index: number) => {
        const selectedCommand = commandSuggestions[index];
        setValue(selectedCommand.prefix + ' ');
        setShowCommandPalette(false);
        
        setRecentCommand(selectedCommand.label);
        setTimeout(() => setRecentCommand(null), 2000);
    };

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-8">
            <div className="relative">
                {/* Simple background */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 rounded-2xl" />

                <div className="space-y-6">
                    <div className="text-center space-y-3">
                        <div className="inline-block">
                            <h2 className="text-2xl font-medium text-white pb-1">
                                Chat with Milna
                            </h2>
                            <div className="h-px bg-white/20" />
                        </div>
                        <p className="text-sm text-white/60">
                            Ask about Milna AI agents, embedding, or try our commands below
                        </p>
                    </div>

                    {/* Messages Area - Simplified */}
                    <div className="bg-white/10 rounded-lg border border-white/20 min-h-[400px] max-h-[600px] overflow-hidden">
                        {/* Messages */}
                        <div className="h-[500px] overflow-y-auto p-4">
                            {messages.length === 0 ? (
                                <div className="text-center py-12">
                                    <Bot className="w-8 h-8 text-white/60 mx-auto mb-4" />
                                    <p className="text-white/60 text-sm">Start a conversation with Milna</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {messages.map((message) => (
                                        <MessageBubble key={message.id} message={message} />
                                    ))}
                                    {isTyping && <TypingIndicator />}
                                </div>
                            )}
                            
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area - Simplified */}
                        <div className="border-t border-white/20 p-4">
                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    data-command-button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowCommandPalette(prev => !prev);
                                    }}
                                    className={cn(
                                        "p-2 text-white/60 hover:text-white rounded-lg transition-colors",
                                        showCommandPalette && "bg-white/10 text-white"
                                    )}
                                >
                                    <Command className="w-4 h-4" />
                                </button>

                                <div className="flex-1">
                                    <Textarea
                                        ref={textareaRef}
                                        value={value}
                                        onChange={(e) => {
                                            setValue(e.target.value);
                                            adjustHeight();
                                        }}
                                        onKeyDown={handleKeyDown}
                                        onFocus={() => setInputFocused(true)}
                                        onBlur={() => setInputFocused(false)}
                                        placeholder="Ask about Milna AI agents, embedding, pricing, or anything else..."
                                        containerClassName="w-full"
                                        className={cn(
                                            "w-full px-4 py-3",
                                            "resize-none",
                                            "bg-transparent",
                                            "border-none",
                                            "text-white/90 text-sm",
                                            "focus:outline-none",
                                            "placeholder:text-white/20",
                                            "min-h-[60px]"
                                        )}
                                        style={{
                                            overflow: "hidden",
                                        }}
                                        showRing={false}
                                    />
                                </div>
                                
                                <button
                                    type="button"
                                    onClick={handleSendMessage}
                                    disabled={isTyping || !value.trim()}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                        "flex items-center gap-2",
                                        value.trim()
                                            ? "bg-blue-500 text-white hover:bg-blue-600"
                                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    )}
                                >
                                    {isTyping ? (
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs">Milna typing</span>
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
                                        <>
                                            <SendIcon className="w-4 h-4" />
                                            <span>Send</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions - Simplified */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {commandSuggestions.map((suggestion, index) => (
                            <button
                                key={suggestion.prefix}
                                onClick={() => selectCommandSuggestion(index)}
                                className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm text-white/80 hover:text-white transition-colors"
                            >
                                {suggestion.icon}
                                <span>{suggestion.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}


