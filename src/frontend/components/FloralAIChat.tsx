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

            textarea.style.height = `${minHeight}px`;
            const newHeight = Math.max(
                minHeight,
                Math.min(
                    textarea.scrollHeight,
                    maxHeight ?? Number.POSITIVE_INFINITY
                )
            );

            textarea.style.height = `${newHeight}px`;
        },
        [minHeight, maxHeight]
    );

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = `${minHeight}px`;
        }
    }, [minHeight]);

    useEffect(() => {
        const handleResize = () => adjustHeight();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
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

export function MilnaAIChat() {
    const [value, setValue] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
    const [showCommandPalette, setShowCommandPalette] = useState(false);
    const [recentCommand, setRecentCommand] = useState<string | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
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

    // Scroll to bottom when new messages arrive
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

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

    const handleSendMessage = async () => {
        if (value.trim()) {
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
        }
    };

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
                {/* Background effects */}
                <div className="absolute inset-0 w-full h-full overflow-hidden rounded-2xl">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-normal filter blur-[128px] animate-pulse delay-700" />
                    <div className="absolute top-1/4 right-1/3 w-64 h-64 bg-fuchsia-500/10 rounded-full mix-blend-normal filter blur-[96px] animate-pulse delay-1000" />
                </div>

                <motion.div 
                    className="relative z-10 space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="text-center space-y-3">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="inline-block"
                        >
                            <h2 className="text-2xl font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white/90 to-white/40 pb-1">
                                Chat with Milna
                            </h2>
                            <motion.div 
                                className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: "100%", opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.8 }}
                            />
                        </motion.div>
                        <motion.p 
                            className="text-sm text-white/40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Ask about Milna AI agents, embedding, or try our commands below
                        </motion.p>
                    </div>

                    {/* Messages Area */}
                    <motion.div 
                        className="relative backdrop-blur-2xl bg-white/[0.02] rounded-2xl border border-white/[0.05] shadow-2xl min-h-[400px] max-h-[600px] overflow-hidden"
                        initial={{ scale: 0.98 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[500px]">
                            {messages.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/[0.05] flex items-center justify-center">
                                        <Bot className="w-8 h-8 text-white/60" />
                                    </div>
                                    <p className="text-white/40 text-sm">Start a conversation with Milna</p>
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        className={cn(
                                            "flex gap-3",
                                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                                        )}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {message.sender === 'ai' && (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                                                <Bot className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                        
                                        <div className={cn(
                                            "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                                            message.sender === 'user' 
                                                ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white ml-auto" 
                                                : "bg-white/[0.05] text-white/90 border border-white/[0.05] mr-auto"
                                        )}>
                                            {message.sender === 'ai' && (
                                                <div className="text-black font-medium text-xs mb-1">Milna</div>
                                            )}
                                            {message.content}
                                        </div>
                                        
                                        {message.sender === 'user' && (
                                            <div className="w-8 h-8 rounded-full bg-white/[0.1] flex items-center justify-center flex-shrink-0">
                                                <User className="w-4 h-4 text-white/60" />
                                            </div>
                                        )}
                                    </motion.div>
                                ))
                            )}
                            
                            {isTyping && (
                                <motion.div
                                    className="flex gap-3 justify-start"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-white/[0.05] rounded-2xl px-4 py-3 border border-white/[0.05]">
                                        <div className="text-black font-medium text-xs mb-1">Milna</div>
                                        <div className="flex items-center gap-2 text-sm text-white/70">
                                            <span>typing</span>
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
                                    </div>
                                </motion.div>
                            )}
                            
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="border-t border-white/[0.05] p-4">
                            <AnimatePresence>
                                {showCommandPalette && (
                                    <motion.div 
                                        ref={commandPaletteRef}
                                        className="absolute left-4 right-4 bottom-full mb-2 backdrop-blur-xl bg-black/90 rounded-lg z-50 shadow-lg border border-white/10 overflow-hidden"
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 5 }}
                                        transition={{ duration: 0.15 }}
                                    >
                                        <div className="py-1 bg-black/95">
                                            {commandSuggestions.map((suggestion, index) => (
                                                <motion.div
                                                    key={suggestion.prefix}
                                                    className={cn(
                                                        "flex items-center gap-2 px-3 py-2 text-xs transition-colors cursor-pointer",
                                                        activeSuggestion === index 
                                                            ? "bg-white/10 text-white" 
                                                            : "text-white/70 hover:bg-white/5"
                                                    )}
                                                    onClick={() => selectCommandSuggestion(index)}
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    transition={{ delay: index * 0.03 }}
                                                >
                                                    <div className="w-5 h-5 flex items-center justify-center text-white/60">
                                                        {suggestion.icon}
                                                    </div>
                                                    <div className="font-medium">{suggestion.label}</div>
                                                    <div className="text-white/40 text-xs ml-1">
                                                        {suggestion.prefix}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex items-center gap-3">
                                <motion.button
                                    type="button"
                                    data-command-button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowCommandPalette(prev => !prev);
                                    }}
                                    whileTap={{ scale: 0.94 }}
                                    className={cn(
                                        "p-2 text-white/40 hover:text-white/90 rounded-lg transition-colors relative group",
                                        showCommandPalette && "bg-white/10 text-white/90"
                                    )}
                                >
                                    <Command className="w-4 h-4" />
                                    <motion.span
                                        className="absolute inset-0 bg-white/[0.05] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        layoutId="button-highlight"
                                    />
                                </motion.button>

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
                                
                                <motion.button
                                    type="button"
                                    onClick={handleSendMessage}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={isTyping || !value.trim()}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                        "flex items-center gap-2",
                                        value.trim()
                                            ? "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-lg shadow-violet-500/25"
                                            : "bg-white/[0.05] text-white/40"
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
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {commandSuggestions.map((suggestion, index) => (
                            <motion.button
                                key={suggestion.prefix}
                                onClick={() => selectCommandSuggestion(index)}
                                className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] hover:bg-white/[0.05] rounded-lg text-sm text-white/60 hover:text-white/90 transition-all relative group"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                {suggestion.icon}
                                <span>{suggestion.label}</span>
                                <motion.div
                                    className="absolute inset-0 border border-white/[0.05] rounded-lg"
                                    initial={false}
                                    animate={{
                                        opacity: [0, 1],
                                        scale: [0.98, 1],
                                    }}
                                    transition={{
                                        duration: 0.3,
                                        ease: "easeOut",
                                    }}
                                />
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>

            {inputFocused && (
                <motion.div 
                    className="fixed w-[50rem] h-[50rem] rounded-full pointer-events-none z-0 opacity-[0.02] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 blur-[96px]"
                    animate={{
                        x: mousePosition.x - 400,
                        y: mousePosition.y - 400,
                    }}
                    transition={{
                        type: "spring",
                        damping: 25,
                        stiffness: 150,
                        mass: 0.5,
                    }}
                />
            )}
        </div>
    );
}

function TypingDots() {
    return (
        <div className="flex items-center ml-1">
            {[1, 2, 3].map((dot) => (
                <motion.div
                    key={dot}
                    className="w-1.5 h-1.5 bg-white/90 rounded-full mx-0.5"
                    initial={{ opacity: 0.3 }}
                    animate={{ 
                        opacity: [0.3, 0.9, 0.3],
                        scale: [0.85, 1.1, 0.85]
                    }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        delay: dot * 0.15,
                        ease: "easeInOut",
                    }}
                    style={{
                        boxShadow: "0 0 4px rgba(255, 255, 255, 0.3)"
                    }}
                />
            ))}
        </div>
    );
}
