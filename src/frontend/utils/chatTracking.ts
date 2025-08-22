import { supabase } from "@/integrations/supabase/client";
import { ensureUrlProtocol } from "@/frontend/utils/urlHelpers";

// Generate unique visitor ID
export const generateVisitorId = (): string => {
  let visitorId = localStorage.getItem('chat_visitor_id');
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem('chat_visitor_id', visitorId);
  }
  return visitorId;
};

// Generate session ID
export const generateSessionId = (): string => {
  let sessionId = sessionStorage.getItem('chat_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem('chat_session_id', sessionId);
  }
  return sessionId;
};

// Create or find conversation
export const createOrFindConversation = async (
  visitorId: string,
  sessionId: string,
  agentId: string
): Promise<string | null> => {
  try {
    // First, try to find existing conversation for this session
    const { data: existingConversation, error: findError } = await supabase
      .from('conversations')
      .select('id')
      .eq('visitor_id', visitorId)
      .eq('session_id', sessionId)
      .eq('agent_id', agentId)
      .eq('is_active', true)
      .single();

    if (existingConversation) {
      return existingConversation.id;
    }

    // Create new conversation if not found
    const { data: newConversation, error: createError } = await supabase
      .from('conversations')
      .insert({
        visitor_id: visitorId,
        session_id: sessionId,
        agent_id: agentId,
        started_at: new Date().toISOString(),
        last_message_at: new Date().toISOString(),
        is_active: true,
        message_count: 0,
        visitor_info: {}
      })
      .select('id')
      .single();

    if (createError) {
      console.error('Error creating conversation:', createError);
      return null;
    }

    // Send webhook for new conversation with only the 5 specified fields
    if (newConversation?.id) {
      await sendNewConversationWebhook(agentId, visitorId, sessionId, newConversation.id);
    }

    return newConversation?.id || null;
  } catch (error) {
    console.error('Error in createOrFindConversation:', error);
    return null;
  }
};

// Store message in database
export const storeMessage = async (
  conversationId: string,
  messageType: 'user' | 'agent',
  content: string
): Promise<void> => {
  try {
    // Insert message
    const { error: messageError } = await supabase
      .from('conversation_messages')
      .insert({
        conversation_id: conversationId,
        message_type: messageType,
        content: content,
        timestamp: new Date().toISOString()
      });

    if (messageError) {
      console.error('Error storing message:', messageError);
      return;
    }

    // Get current conversation to increment message count
    const { data: conversation, error: fetchError } = await supabase
      .from('conversations')
      .select('message_count')
      .eq('id', conversationId)
      .single();

    if (fetchError) {
      console.error('Error fetching conversation:', fetchError);
      return;
    }

    // Update conversation message count and last message time
    const { error: updateError } = await supabase
      .from('conversations')
      .update({
        message_count: (conversation?.message_count || 0) + 1,
        last_message_at: new Date().toISOString()
      })
      .eq('id', conversationId);

    if (updateError) {
      console.error('Error updating conversation:', updateError);
    }
  } catch (error) {
    console.error('Error in storeMessage:', error);
  }
};

// Send webhook when new conversation is started - ONLY 5 fields
export const sendNewConversationWebhook = async (
  agentId: string,
  visitorId: string,
  sessionId: string,
  conversationId: string
): Promise<void> => {
  try {
    const webhookPayload = {
      session_id: sessionId,
      visitor_id: visitorId,
      agent_id: agentId,
      agent_uuid: agentId, // Add this field for n8n compatibility
      conversation_id: conversationId,
      timestamp: new Date().toISOString()
    };

    console.log('Sending new conversation webhook:', webhookPayload);

    const webhookUrl = ensureUrlProtocol('abhixchawla.app.n8n.cloud/webhook/49ccefa1-44e4-4117-9cac-00e147f79cc9/chat');

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload)
    });

    if (!response.ok) {
      console.error('New conversation webhook request failed:', response.status, response.statusText);
    } else {
      console.log('New conversation webhook sent successfully');
    }
  } catch (error) {
    console.error('Error sending new conversation webhook:', error);
  }
};

// Send webhook with essential data for regular chat messages
export const sendChatWebhook = async (
  agentId: string,
  userMessage: string,
  visitorId: string,
  sessionId: string,
  conversationId: string
): Promise<void> => {
  try {
    const webhookPayload = {
      agent_id: agentId,
      agent_uuid: agentId, // Add this field for n8n compatibility
      user_message: userMessage,
      visitor_id: visitorId,
      session_id: sessionId,
      conversation_id: conversationId,
      timestamp: new Date().toISOString()
    };

    console.log('Sending chat webhook:', webhookPayload);

    const webhookUrl = ensureUrlProtocol('abhixchawla.app.n8n.cloud/webhook/49ccefa1-44e4-4117-9cac-00e147f79cc9/chat');

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload)
    });

    if (!response.ok) {
      console.error('Chat webhook request failed:', response.status, response.statusText);
    } else {
      console.log('Chat webhook sent successfully');
    }
  } catch (error) {
    console.error('Error sending chat webhook:', error);
  }
};

// Add message limit check function
export const checkMessageLimit = async (userId: string): Promise<{ canSend: boolean; messageCount: number; hasProAccess: boolean }> => {
  try {
    // Get user profile to check message count and subscription status
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('message_count, subscription_status, appsumo_redeemed')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error checking message limit:', error);
      return { canSend: true, messageCount: 0, hasProAccess: false }; // Default to allow on error
    }

    const messageCount = profile?.message_count || 0;
    const hasProAccess = profile?.subscription_status === 'active' || profile?.appsumo_redeemed === true;
    const canSend = hasProAccess || messageCount < 100; // Updated to 100 messages

    return { canSend, messageCount, hasProAccess };
  } catch (error) {
    console.error('Error in checkMessageLimit:', error);
    return { canSend: true, messageCount: 0, hasProAccess: false }; // Default to allow on error
  }
};

// Update message count function
export const incrementMessageCount = async (userId: string): Promise<void> => {
  try {
    // Get current count
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('message_count')
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching message count:', fetchError);
      return;
    }

    const currentCount = profile?.message_count || 0;

    // Increment count
    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        message_count: currentCount + 1,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating message count:', updateError);
    }
  } catch (error) {
    console.error('Error in incrementMessageCount:', error);
  }
};
