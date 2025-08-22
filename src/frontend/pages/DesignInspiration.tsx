
import { useState } from "react";
import { ArrowLeft, Copy, ExternalLink, MessageCircle, Send, Bot, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/frontend/components/ui/button";
import { useToast } from "@/frontend/hooks/use-toast";
import Footer from "@/frontend/components/layout/Footer";

const DesignInspiration = () => {
  const { toast } = useToast();
  const [selectedDemo, setSelectedDemo] = useState<string | null>(null);

  const copyCode = (code: string, name: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied!",
      description: `${name} code copied to clipboard`,
    });
  };

  const designs = [
    {
      id: "minimal-bottom",
      name: "Minimal Bottom Bar",
      description: "Clean, unobtrusive chat bar that sits at the bottom of your website",
      preview: (
        <div className="relative bg-gray-50 rounded-lg overflow-hidden">
          <div className="h-40 bg-white p-6">
            <h3 className="text-lg font-semibold mb-2">Your Website Content</h3>
            <p className="text-gray-600">This is where your main content would be...</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <div className="flex items-center gap-3 max-w-4xl mx-auto">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Bot className="w-4 h-4" />
                <span>How can I help you?</span>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <input 
                  type="text" 
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button size="sm" className="rounded-full w-8 h-8 p-0">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      ),
      code: `<!-- Minimal Bottom Chat Bar -->
<div style="position: fixed; bottom: 0; left: 0; right: 0; background: white; border-top: 1px solid #e5e7eb; padding: 16px; z-index: 1000;">
  <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 12px;">
    <div style="display: flex; align-items: center; gap: 8px; color: #6b7280; font-size: 14px;">
      <span>🤖</span>
      <span>How can I help you?</span>
    </div>
    <div style="flex: 1; display: flex; align-items: center; gap: 8px;">
      <input 
        type="text" 
        placeholder="Type your message..."
        style="flex: 1; padding: 8px 16px; border: 1px solid #d1d5db; border-radius: 9999px; font-size: 14px; outline: none;"
        onfocus="this.style.borderColor='#3b82f6'; this.style.boxShadow='0 0 0 2px rgb(59 130 246 / 0.2)'"
        onblur="this.style.borderColor='#d1d5db'; this.style.boxShadow='none'"
      />
      <button 
        style="width: 32px; height: 32px; background: #3b82f6; color: white; border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer;"
        onmouseover="this.style.background='#2563eb'"
        onmouseout="this.style.background='#3b82f6'"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
        </svg>
      </button>
    </div>
  </div>
</div>`
    },
    {
      id: "sidebar-chat",
      name: "Sidebar Chat Panel",
      description: "Integrated sidebar that slides out with chat functionality",
      preview: (
        <div className="relative bg-gray-50 rounded-lg overflow-hidden flex">
          <div className="flex-1 bg-white p-6">
            <h3 className="text-lg font-semibold mb-2">Main Content</h3>
            <p className="text-gray-600">Your website content goes here...</p>
          </div>
          <div className="w-80 bg-gray-50 border-l border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
              <Bot className="w-5 h-5 text-blue-600" />
              <span className="font-medium">Chat Assistant</span>
            </div>
            <div className="space-y-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg text-sm">
                <div className="flex items-start gap-2">
                  <Bot className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span>Hello! How can I help you today?</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Type here..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button size="sm" className="px-3">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ),
      code: `<!-- Sidebar Chat Panel -->
<div style="position: fixed; right: 0; top: 0; bottom: 0; width: 320px; background: #f9fafb; border-left: 1px solid #e5e7eb; display: flex; flex-direction: column; z-index: 1000;">
  <div style="padding: 16px; border-bottom: 1px solid #e5e7eb;">
    <div style="display: flex; align-items: center; gap: 8px;">
      <span>🤖</span>
      <span style="font-weight: 500;">Chat Assistant</span>
    </div>
  </div>
  <div style="flex: 1; padding: 16px; overflow-y: auto;">
    <div style="background: #dbeafe; padding: 12px; border-radius: 8px; margin-bottom: 12px;">
      <div style="display: flex; align-items: start; gap: 8px; font-size: 14px;">
        <span>🤖</span>
        <span>Hello! How can I help you today?</span>
      </div>
    </div>
  </div>
  <div style="padding: 16px; border-top: 1px solid #e5e7eb;">
    <div style="display: flex; gap: 8px;">
      <input 
        type="text" 
        placeholder="Type here..."
        style="flex: 1; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; outline: none;"
      />
      <button style="padding: 8px 12px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer;">
        Send
      </button>
    </div>
  </div>
</div>`
    },
    {
      id: "floating-bubble",
      name: "Elegant Floating Chat",
      description: "Sophisticated floating chat bubble with smooth interactions",
      preview: (
        <div className="relative bg-white rounded-lg overflow-hidden h-48">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">Website Content</h3>
            <p className="text-gray-600">This is your main website content...</p>
          </div>
          <div className="absolute bottom-6 right-6">
            <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg max-w-xs">
              <div className="flex items-start gap-3">
                <Bot className="w-5 h-5 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm mb-3">Hi! I'm here to help. What can I do for you?</p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Ask me anything..."
                      className="flex-1 px-3 py-1.5 bg-white/20 text-white placeholder-white/70 rounded-lg text-sm border border-white/30 focus:outline-none focus:bg-white/30"
                    />
                    <button className="bg-white/20 border border-white/30 rounded-lg px-2 py-1.5 hover:bg-white/30 transition-colors">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      code: `<!-- Elegant Floating Chat -->
<div style="position: fixed; bottom: 24px; right: 24px; z-index: 1000;">
  <div style="background: #2563eb; color: white; padding: 16px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.15); max-width: 300px;">
    <div style="display: flex; align-items: start; gap: 12px;">
      <span style="font-size: 20px;">🤖</span>
      <div style="flex: 1;">
        <p style="font-size: 14px; margin-bottom: 12px;">Hi! I'm here to help. What can I do for you?</p>
        <div style="display: flex; gap: 8px;">
          <input 
            type="text" 
            placeholder="Ask me anything..."
            style="flex: 1; padding: 6px 12px; background: rgba(255,255,255,0.2); color: white; border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; font-size: 14px; outline: none;"
          />
          <button style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; padding: 6px 8px; color: white; cursor: pointer;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</div>`
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border px-4 py-6">
        <div className="container mx-auto">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="h-4 w-px bg-border" />
            <h1 className="text-2xl font-bold">Design Inspiration</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Chat Interface Design Examples</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get inspired by these beautifully integrated chat interfaces that feel like a natural part of your website, 
              not an intrusive popup.
            </p>
          </div>

          <div className="grid gap-12">
            {designs.map((design, index) => (
              <div key={design.id} className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-6 border-b border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{design.name}</h3>
                      <p className="text-muted-foreground">{design.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyCode(design.code, design.name)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Code
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">Live Preview</h4>
                    {design.preview}
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">HTML Code</h4>
                    <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{design.code}</code>
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-card rounded-xl border border-border p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to implement your chat?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              These are just starting points. You can customize colors, fonts, positioning, and behavior to match your brand perfectly.
            </p>
            <Link to="/dashboard">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Create Your AI Agent
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DesignInspiration;
