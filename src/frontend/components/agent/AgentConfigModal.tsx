import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/frontend/components/ui/dialog";
import { Button } from "@/frontend/components/ui/button";
import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import { Textarea } from "@/frontend/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/frontend/components/ui/tabs";
import { ScrollArea } from "@/frontend/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import { toast } from "@/frontend/hooks/use-toast";
import { Upload, Trash2, Send, Bot, User, BarChart3, MessageCircle, Clock, TrendingUp, X, FileText, Settings } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/frontend/hooks/use-user";
import { useSubscription } from "@/frontend/hooks/useSubscription";
import AgentIntegrationsTab from "@/frontend/components/agent/AgentIntegrationsTab";
import AgentAnalyticsTab from "@/frontend/components/agent/AgentAnalyticsTab";
import responseListener from "@/frontend/utils/responseListener";

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

interface AgentConfigModalProps {
  agent: Agent;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onDelete: (agentId: string) => void;
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "agent";
  timestamp: Date;
}

interface AgentDocument {
  id: string;
  filename: string;
  file_size: number;
  mime_type: string;
  created_at: string;
  file_url: string;
  file_path: string;
}

const AgentConfigModal = ({ agent, isOpen, onClose, onUpdate, onDelete }: AgentConfigModalProps) => {
  const {
    messageCount,
    messageLimit,
    messagesRemaining,
    isLimitReached,
    subscribed,
    appsumoAccess
  } = useSubscription();

  const [formData, setFormData] = useState({
    name: agent.name,
    goal: agent.goal || "",
    tone: agent.tone || "friendly",
    instructions: agent.instructions || "",
  });

  const hasProAccess = subscribed || appsumoAccess;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `Hello! I'm ${agent.name}. How can I help you today?`,
      sender: "agent",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [documents, setDocuments] = useState<AgentDocument[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();

  useEffect(() => {
    if (isOpen) {
      fetchDocuments();
    }
  }, [isOpen, agent.id]);

  const fetchDocuments = async () => {
    setDocumentsLoading(true);
    try {
      const { data, error } = await supabase
        .from("agent_documents")
        .select("*")
        .eq("agent_id", agent.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      });
    } finally {
      setDocumentsLoading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    try {
      // First get the document info to delete from storage
      const documentToDelete = documents.find(doc => doc.id === documentId);
      
      if (documentToDelete && documentToDelete.file_path) {
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from("agent-documents")
          .remove([documentToDelete.file_path]);

        if (storageError) {
          console.error("Error deleting from storage:", storageError);
          // Continue anyway to clean up database record
        }
      }

      // Delete from database
      const { error } = await supabase
        .from("agent_documents")
        .delete()
        .eq("id", documentId);

      if (error) throw error;

      // Send deletion notification to webhook
      try {
        await fetch('https://abhixchawla.app.n8n.cloud/webhook/deletedoc', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            document_id: documentId,
            agent_id: agent.id,
          }),
        });
      } catch (webhookError) {
        console.error('Error calling deletion webhook:', webhookError);
        // Don't fail the deletion if webhook fails
      }

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });

      fetchDocuments();
    } catch (error: any) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("agents")
        .update({
          name: formData.name,
          goal: formData.goal,
          tone: formData.tone,
          instructions: formData.instructions,
          updated_at: new Date().toISOString(),
        })
        .eq("id", agent.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Agent updated successfully",
      });

      onUpdate();
    } catch (error: any) {
      console.error("Error updating agent:", error);
      toast({
        title: "Error",
        description: "Failed to update agent",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this agent? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("agents").delete().eq("id", agent.id);
      if (error) throw error;

      toast({
        title: "Success",
        description: "Agent deleted successfully",
      });

      onDelete(agent.id);
      onClose();
    } catch (error: any) {
      console.error("Error deleting agent:", error);
      toast({
        title: "Error",
        description: "Failed to delete agent",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const bucket = "agent-documents";
      const fileExt = file.name.split(".").pop();
      const path = `${user.id}/${agent.id}/${Date.now()}.${fileExt}`;

      console.log("Uploading file to storage...");
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: false });

      if (uploadError) throw uploadError;

      console.log("Creating signed URL...");
      const { data: signed, error: signedErr } = await supabase.storage
        .from(bucket)
        .createSignedUrl(uploadData.path, 60 * 60 * 24);
      if (signedErr) throw signedErr;

      console.log("Saving document record to database...");
      const { data: docData, error: docError } = await supabase
        .from("agent_documents")
        .insert({
          agent_id: agent.id,
          filename: file.name,
          file_path: uploadData.path,
          file_url: signed?.signedUrl || "",
          mime_type: file.type,
          file_size: file.size,
        })
        .select()
        .single();
      if (docError) throw docError;

      console.log("=== FRONTEND WEBHOOK DEBUG ===");
      console.log("Agent object:", agent);
      console.log("Agent.id:", agent.id);
      console.log("Agent.agent_id:", agent.agent_id);
      console.log("Agent.id type:", typeof agent.id);
      console.log("Agent.agent_id type:", typeof agent.agent_id);
      
      const payload = {
        idempotency_key: `doc:${docData.id}`,
        document_id: docData.id,
        agent_uuid: agent.id, // Send agent_uuid instead of agent_id
        user_id: user.id,
        bucket,
        file_path: uploadData.path,
        filename: file.name,
        mime_type: file.type,
        file_size: file.size,
        signed_url: signed?.signedUrl,
        name: formData.name,
        goal: formData.goal,
        tone: formData.tone,
        instructions: formData.instructions,
      };
      
      console.log("Webhook payload being sent:", JSON.stringify(payload, null, 2));
      console.log("Final agent_uuid value:", payload.agent_uuid);
      console.log("About to send webhook directly to n8n...");

      // Send webhook directly to n8n instead of using Supabase function
      const webhookResponse = await fetch('https://abhixchawla.app.n8n.cloud/webhook/agentconfigure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      console.log("Webhook response status:", webhookResponse.status);
      console.log("Webhook response ok:", webhookResponse.ok);

      if (!webhookResponse.ok) {
        console.error("Webhook error:", webhookResponse.status, webhookResponse.statusText);
        toast({
          title: "Partial Success",
          description: "Document uploaded successfully, but processing may be delayed.",
        });
      } else {
        const responseText = await webhookResponse.text();
        console.log("Webhook response text:", responseText);
        toast({
          title: "Success",
          description: "Document uploaded and processed successfully.",
        });
      }

      fetchDocuments();
    } catch (error: any) {
      console.error("Error uploading document:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

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
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageContent = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      // Generate visitor and session IDs
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
      const webhookResponse = await fetch('https://abhixchawla.app.n8n.cloud/webhook/49ccefa1-44e4-4117-9cac-00e147f79cc9/chat', {
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
          sender: "agent",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, agentMessage]);
        setIsTyping(false);
      } else {
        // No immediate response, start polling
        console.log('No immediate response, starting polling...');
        await responseListener.startPolling({
          agentId: agent.agent_id || agent.id,
          visitorId,
          sessionId,
          onResponse: (responseText) => {
            console.log('Received response from n8n polling:', responseText);
            
            // Show AI response
            const agentMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: responseText,
              sender: "agent",
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, agentMessage]);
            setIsTyping(false);
          },
          onError: (error) => {
            console.error('Error from n8n:', error);
            const errorMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: `Sorry, I encountered an error: ${error}`,
              sender: "agent",
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
            setIsTyping(false);
          },
          onTimeout: () => {
            console.log('Response timeout');
            const timeoutMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: "I'm taking longer than expected to respond. Please try again or check back later.",
              sender: "agent",
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, timeoutMessage]);
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
        sender: "agent",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center justify-between">
            <span>Configure Agent: {agent.name}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="ml-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="configure" className="h-full flex flex-col">
            <TabsList className="sticky top-0 z-10 bg-background border-b rounded-none px-6">
              <TabsTrigger value="configure">Configure</TabsTrigger>
              <TabsTrigger value="knowledge">Knowledge</TabsTrigger>
              <TabsTrigger value="integrations">Integrations</TabsTrigger>
              <TabsTrigger value="test">Test Chat</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* CONFIGURE */}
            <TabsContent value="configure" className="flex-1 p-6 overflow-auto">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="goal" className="text-right">
                    Goal
                  </Label>
                  <Textarea
                    id="goal"
                    value={formData.goal}
                    onChange={(e) => handleInputChange("goal", e.target.value)}
                    placeholder="What is this agent's primary goal?"
                    className="col-span-3"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tone" className="text-right">
                    Tone
                  </Label>
                  <Input
                    id="tone"
                    value={formData.tone}
                    onChange={(e) => handleInputChange("tone", e.target.value)}
                    placeholder="e.g., friendly, professional, casual"
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="instructions" className="text-right">
                    Instructions
                  </Label>
                  <Textarea
                    id="instructions"
                    value={formData.instructions}
                    onChange={(e) =>
                      handleInputChange("instructions", e.target.value)
                    }
                    placeholder="Detailed instructions for how the agent should behave..."
                    className="col-span-3"
                    rows={6}
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button onClick={handleDelete} variant="destructive" disabled={loading}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Agent
                  </Button>
                  <Button onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* KNOWLEDGE */}
            <TabsContent value="knowledge" className="flex-1 p-6 overflow-auto">
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Knowledge Base</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload documents to give your agent knowledge. Supported formats: PDF, DOC, DOCX, TXT, MD
                    </p>
                  </div>
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt,.md"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {uploading ? "Uploading..." : "Upload Document"}
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Uploaded Documents ({documents.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {documentsLoading ? (
                      <p>Loading documents...</p>
                    ) : documents.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No documents uploaded yet. Upload your first document to get started.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{doc.filename}</div>
                                <div className="text-sm text-muted-foreground">
                                  {formatFileSize(doc.file_size)} • {doc.mime_type} • {new Date(doc.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* INTEGRATIONS */}
            <TabsContent value="integrations" className="flex-1 p-6 overflow-auto">
              <AgentIntegrationsTab agent={agent} onUpdate={onUpdate} />
            </TabsContent>

            {/* TEST CHAT */}
            <TabsContent value="test" className="flex-1 overflow-hidden">
              <Card className="h-full flex flex-col rounded-none border-x-0">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Test Chat with {agent.name}
                  </CardTitle>
                  <CardDescription>
                    Test your agent's responses in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                  <ScrollArea className="flex-1 px-6 py-4" ref={scrollAreaRef}>
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${
                            message.sender === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          {message.sender === "agent" && (
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                              <Bot className="w-4 h-4 text-primary-foreground" />
                            </div>
                          )}

                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              message.sender === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>

                          {message.sender === "user" && (
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
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.1s" }}
                              ></div>
                              <div
                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isTyping}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* ANALYTICS */}
            <TabsContent value="analytics" className="flex-1 p-6 overflow-auto">
              <AgentAnalyticsTab agent={agent} />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgentConfigModal;
