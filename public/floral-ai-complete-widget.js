// Floral AI Complete Widget - Self-Contained Embed Solution
// Users just need to add: <script src="https://yourdomain.com/floral-ai-complete-widget.js"></script>

(function() {
  'use strict';
  
  // 🚀 COMPLETE BACKEND CONFIGURATION
  const FLORAL_CONFIG = {
    // Backend URLs - PRE-CONFIGURED WITH YOUR SYSTEM
    supabaseUrl: 'https://fapojywavurprfbmeznj.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhcG9qeXdhdnVycHJmYm1lem5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5NTY2OTIsImV4cCI6MjA3MDUzMjY5Mn0.t970PnmFpE_-JwpLzCCqly-Buj6o2KaK9dtzXtABXf0',
    
    // Agent Configuration - PRE-CONFIGURED WITH YOUR AGENT
    agentId: 'agent_aa1f9f83_ef1d_4ada_bb7f_b5c9e517e36c',
    agentUuid: null, // Will be auto-populated from backend
    agentName: 'PaperKites AI',
    
    // Widget Configuration
    position: 'bottom-right', // bottom-right, bottom-left, top-right, top-left
    theme: 'light', // light, dark
    primaryColor: '#3b82f6',
    secondaryColor: '#8b5cf6',
    
    // Webhook Configuration - PRE-CONFIGURED WITH YOUR BACKEND
    webhookProxyUrl: 'https://fapojywavurprfbmeznj.supabase.co/functions/v1/webhook-proxy',
    chatWebhookUrl: 'https://abhixchawla.app.n8n.cloud/webhook/49ccefa1-44e4-4117-9cac-00e147f79cc9/chat'
  };

  // 🔧 USER SESSION MANAGEMENT - AUTOMATIC
  let currentUser = null;
  let sessionToken = null;
  let visitorId = null;

  // Initialize user session automatically
  function initializeSession() {
    console.log('🚀 Floral AI Widget: Initializing session...');
    
    // Generate or retrieve visitor ID
    visitorId = localStorage.getItem('floral_visitor_id');
    if (!visitorId) {
      visitorId = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('floral_visitor_id', visitorId);
      console.log('✨ Generated new visitor ID:', visitorId);
    } else {
      console.log('🔍 Retrieved existing visitor ID:', visitorId);
    }

    // Check for existing session
    sessionToken = localStorage.getItem('floral_session_token');
    if (sessionToken) {
      console.log('🔑 Found existing session token');
    }
    
    console.log('✅ Session initialized successfully');
  }

  // 🔗 SUPABASE CLIENT - COMPLETE INTEGRATION
  function createSupabaseClient() {
    return {
      auth: {
        getSession: async () => {
          return {
            data: {
              session: sessionToken ? { access_token: sessionToken } : null
            }
          };
        }
      },
      functions: {
        invoke: async (functionName, options) => {
          try {
            console.log(`📡 Calling Supabase function: ${functionName}`);
            console.log('📤 Payload:', JSON.stringify(options.body, null, 2));
            
            const response = await fetch(`${FLORAL_CONFIG.supabaseUrl}/functions/v1/${functionName}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionToken || FLORAL_CONFIG.supabaseAnonKey}`,
                ...options.headers
              },
              body: JSON.stringify(options.body)
            });
            
            const responseText = await response.text();
            console.log(`📥 Response from ${functionName}:`, responseText);
            
            let data;
            try {
              data = responseText ? JSON.parse(responseText) : null;
            } catch (e) {
              data = { message: responseText };
            }
            
            if (!response.ok) {
              throw new Error(data?.error || `Function call failed with status ${response.status}`);
            }
            
            return { data, error: null };
          } catch (error) {
            console.error(`❌ Error calling ${functionName}:`, error);
            return { data: null, error };
          }
        }
      }
    };
  }

  // 📨 MESSAGE SENDING - COMPLETE BACKEND INTEGRATION
  async function sendMessage(message) {
    console.log('📨 Sending message to backend:', message);
    
    const supabase = createSupabaseClient();
    
    // Prepare complete webhook payload
    const webhookPayload = {
      agent_id: FLORAL_CONFIG.agentId,
      agent_uuid: FLORAL_CONFIG.agentUuid || 'auto-generated-uuid',
      user_id: currentUser?.id || visitorId,
      message: message,
      agent_name: FLORAL_CONFIG.agentName,
      timestamp: new Date().toISOString(),
      source: 'embedded_widget',
      visitor_id: visitorId
    };

    try {
      console.log('🔄 Sending via Supabase webhook-proxy for message tracking...');
      
      // Send via Supabase webhook-proxy for complete backend integration
      const { data, error } = await supabase.functions.invoke('webhook-proxy', {
        body: webhookPayload,
        headers: {
          'Authorization': `Bearer ${sessionToken || FLORAL_CONFIG.supabaseAnonKey}`
        }
      });

      if (error) {
        console.error('❌ Webhook proxy error:', error);
        throw error;
      }

      console.log('✅ Message sent successfully via webhook-proxy');
      
      // Parse response from n8n
      let agentResponse = "Thank you for your message! I'm here to help you with any questions or assistance you need.";
      
      if (data) {
        // Handle various response formats from n8n
        if (data.response && typeof data.response === 'string') {
          agentResponse = data.response;
        } else if (data.message && typeof data.message === 'string') {
          agentResponse = data.message;
        } else if (data.output && typeof data.output === 'string') {
          agentResponse = data.output;
        } else if (data.reply && typeof data.reply === 'string') {
          agentResponse = data.reply;
        } else if (data.text && typeof data.text === 'string') {
          agentResponse = data.text;
        } else if (typeof data === 'string') {
          agentResponse = data;
        }
      }
      
      return agentResponse;
      
    } catch (error) {
      console.error('❌ Message send failed:', error);
      
      // Fallback: Try direct webhook call
      try {
        console.log('🔄 Trying direct webhook as fallback...');
        
        const directResponse = await fetch(FLORAL_CONFIG.chatWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload)
        });
        
        if (directResponse.ok) {
          const directData = await directResponse.text();
          console.log('✅ Direct webhook successful');
          return directData || "Thank you for your message! I'm here to help you.";
        }
      } catch (fallbackError) {
        console.error('❌ Fallback webhook also failed:', fallbackError);
      }
      
      return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.";
    }
  }

  // 🎨 COMPLETE WIDGET STYLES
  function createStyles() {
    const styles = `
      .floral-ai-widget {
        position: fixed;
        z-index: 999999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }
      
      .floral-ai-widget.bottom-right { bottom: 20px; right: 20px; }
      .floral-ai-widget.bottom-left { bottom: 20px; left: 20px; }
      .floral-ai-widget.top-right { top: 20px; right: 20px; }
      .floral-ai-widget.top-left { top: 20px; left: 20px; }
      
      .floral-ai-button {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background: linear-gradient(135deg, ${FLORAL_CONFIG.primaryColor}, ${FLORAL_CONFIG.secondaryColor});
        border: none;
        color: white;
        cursor: pointer;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        position: relative;
      }
      
      .floral-ai-button:hover {
        transform: scale(1.1);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
      }
      
      .floral-ai-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #10b981;
        color: white;
        border-radius: 12px;
        padding: 2px 6px;
        font-size: 10px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 4px;
      }
      
      .floral-ai-badge-dot {
        width: 6px;
        height: 6px;
        background: white;
        border-radius: 50%;
        animation: pulse 2s infinite;
      }
      
      .floral-ai-chat {
        width: 320px;
        height: 400px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        border: 1px solid rgba(0, 0, 0, 0.1);
        overflow: hidden;
        display: none;
        margin-bottom: 20px;
      }
      
      .floral-ai-chat.active {
        display: block;
      }
      
      .floral-ai-header {
        background: linear-gradient(135deg, ${FLORAL_CONFIG.primaryColor}, ${FLORAL_CONFIG.secondaryColor});
        color: white;
        padding: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .floral-ai-header-left {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .floral-ai-avatar {
        width: 32px;
        height: 32px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      }
      
      .floral-ai-header-info h3 {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
      }
      
      .floral-ai-header-info p {
        margin: 0;
        font-size: 12px;
        opacity: 0.8;
      }
      
      .floral-ai-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 4px;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s ease;
      }
      
      .floral-ai-close:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      
      .floral-ai-messages {
        height: 280px;
        padding: 16px;
        overflow-y: auto;
        background: #f8fafc;
      }
      
      .floral-ai-message {
        margin-bottom: 12px;
        display: flex;
        gap: 8px;
        align-items: flex-start;
      }
      
      .floral-ai-message.user {
        justify-content: flex-end;
      }
      
      .floral-ai-message-content {
        max-width: 75%;
        padding: 8px 12px;
        border-radius: 16px;
        font-size: 13px;
        line-height: 1.4;
        word-wrap: break-word;
      }
      
      .floral-ai-message.agent .floral-ai-message-content {
        background: white;
        color: #1f2937;
        border: 1px solid #e5e7eb;
      }
      
      .floral-ai-message.user .floral-ai-message-content {
        background: linear-gradient(135deg, ${FLORAL_CONFIG.primaryColor}, ${FLORAL_CONFIG.secondaryColor});
        color: white;
      }
      
      .floral-ai-input-area {
        padding: 16px;
        border-top: 1px solid #e5e7eb;
        background: #f8fafc;
      }
      
      .floral-ai-input-container {
        display: flex;
        gap: 8px;
      }
      
      .floral-ai-input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #d1d5db;
        border-radius: 20px;
        font-size: 13px;
        outline: none;
        transition: border-color 0.2s ease;
        font-family: inherit;
      }
      
      .floral-ai-input:focus {
        border-color: ${FLORAL_CONFIG.primaryColor};
      }
      
      .floral-ai-send {
        background: linear-gradient(135deg, ${FLORAL_CONFIG.primaryColor}, ${FLORAL_CONFIG.secondaryColor});
        color: white;
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease;
        font-size: 14px;
      }
      
      .floral-ai-send:hover {
        transform: scale(1.05);
      }
      
      .floral-ai-send:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
      }
      
      .floral-ai-welcome {
        text-align: center;
        padding: 32px 16px;
        color: #6b7280;
      }
      
      .floral-ai-welcome-icon {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, ${FLORAL_CONFIG.primaryColor}, ${FLORAL_CONFIG.secondaryColor});
        border-radius: 50%;
        margin: 0 auto 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 20px;
      }
      
      .floral-ai-welcome h3 {
        margin: 0 0 4px 0;
        font-size: 14px;
        color: #374151;
        font-weight: 600;
      }
      
      .floral-ai-welcome p {
        margin: 0;
        font-size: 12px;
      }
      
      .floral-ai-typing {
        display: flex;
        gap: 4px;
        padding: 8px 12px;
        background: white;
        border-radius: 16px;
        border: 1px solid #e5e7eb;
        width: fit-content;
      }
      
      .floral-ai-typing-dot {
        width: 6px;
        height: 6px;
        background: #9ca3af;
        border-radius: 50%;
        animation: bounce 1.4s infinite ease-in-out;
      }
      
      .floral-ai-typing-dot:nth-child(1) { animation-delay: -0.32s; }
      .floral-ai-typing-dot:nth-child(2) { animation-delay: -0.16s; }
      
      .floral-ai-status {
        padding: 8px 16px;
        background: #f0f9ff;
        border-top: 1px solid #e0f2fe;
        font-size: 11px;
        color: #0369a1;
        text-align: center;
      }
      
      @keyframes bounce {
        0%, 80%, 100% { transform: scale(0); }
        40% { transform: scale(1); }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      @media (max-width: 480px) {
        .floral-ai-chat {
          width: calc(100vw - 40px);
          height: calc(100vh - 120px);
          max-height: 500px;
        }
        
        .floral-ai-widget.bottom-right,
        .floral-ai-widget.bottom-left {
          bottom: 10px;
        }
        
        .floral-ai-widget.bottom-right { right: 10px; }
        .floral-ai-widget.bottom-left { left: 10px; }
      }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  // 🏗️ CREATE WIDGET HTML
  function createWidget() {
    const widget = document.createElement('div');
    widget.className = `floral-ai-widget ${FLORAL_CONFIG.position}`;
    widget.innerHTML = `
      <div class="floral-ai-button" id="floral-ai-button">
        💬
        <div class="floral-ai-badge">
          <div class="floral-ai-badge-dot"></div>
          AI
        </div>
      </div>
      
      <div class="floral-ai-chat" id="floral-ai-chat">
        <div class="floral-ai-header">
          <div class="floral-ai-header-left">
            <div class="floral-ai-avatar">🤖</div>
            <div class="floral-ai-header-info">
              <h3>${FLORAL_CONFIG.agentName}</h3>
              <p>AI Assistant</p>
            </div>
          </div>
          <button class="floral-ai-close" id="floral-ai-close">✕</button>
        </div>
        
        <div class="floral-ai-messages" id="floral-ai-messages">
          <div class="floral-ai-welcome">
            <div class="floral-ai-welcome-icon">✨</div>
            <h3>Welcome!</h3>
            <p>How can I help you today?</p>
          </div>
        </div>
        
        <div class="floral-ai-input-area">
          <div class="floral-ai-input-container">
            <input type="text" class="floral-ai-input" id="floral-ai-input" placeholder="Type your message..." autocomplete="off">
            <button class="floral-ai-send" id="floral-ai-send">➤</button>
          </div>
        </div>
        
        <div class="floral-ai-status" id="floral-ai-status">
          Powered by Floral AI • Connected to backend
        </div>
      </div>
    `;
    
    return widget;
  }

  // 🤖 COMPLETE WIDGET FUNCTIONALITY
  class FloralAIWidget {
    constructor() {
      this.isOpen = false;
      this.messages = [];
      this.isTyping = false;
      this.init();
    }

    init() {
      console.log('🚀 Initializing Floral AI Widget...');
      
      // Initialize session first
      initializeSession();
      
      // Add styles
      createStyles();

      // Create and add widget
      this.widget = createWidget();
      document.body.appendChild(this.widget);

      // Bind events
      this.bindEvents();
      
      console.log('✅ Floral AI Widget initialized successfully!');
      console.log('📊 Configuration:', {
        agentId: FLORAL_CONFIG.agentId,
        agentName: FLORAL_CONFIG.agentName,
        visitorId: visitorId,
        hasSession: !!sessionToken
      });
    }

    bindEvents() {
      const button = document.getElementById('floral-ai-button');
      const closeBtn = document.getElementById('floral-ai-close');
      const input = document.getElementById('floral-ai-input');
      const sendBtn = document.getElementById('floral-ai-send');

      button.addEventListener('click', () => this.toggle());
      closeBtn.addEventListener('click', () => this.close());
      
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
      
      sendBtn.addEventListener('click', () => this.sendMessage());
      
      // Clear welcome message on first input
      input.addEventListener('focus', () => {
        const welcome = document.querySelector('.floral-ai-welcome');
        if (welcome && this.messages.length === 0) {
          welcome.style.display = 'none';
        }
      });
    }

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    open() {
      this.isOpen = true;
      document.getElementById('floral-ai-chat').classList.add('active');
      
      // Focus input after animation
      setTimeout(() => {
        document.getElementById('floral-ai-input').focus();
      }, 100);
    }

    close() {
      this.isOpen = false;
      document.getElementById('floral-ai-chat').classList.remove('active');
    }

    addMessage(content, isUser = false) {
      const messagesContainer = document.getElementById('floral-ai-messages');
      const messageDiv = document.createElement('div');
      messageDiv.className = `floral-ai-message ${isUser ? 'user' : 'agent'}`;
      
      if (!isUser) {
        messageDiv.innerHTML = '<div class="floral-ai-avatar">🤖</div>';
      }
      
      const contentDiv = document.createElement('div');
      contentDiv.className = 'floral-ai-message-content';
      contentDiv.textContent = content;
      
      messageDiv.appendChild(contentDiv);
      
      if (isUser) {
        messageDiv.innerHTML += '<div class="floral-ai-avatar">👤</div>';
      }
      
      messagesContainer.appendChild(messageDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
      
      // Store message
      this.messages.push({ content, isUser, timestamp: new Date() });
    }

    showTyping() {
      const messagesContainer = document.getElementById('floral-ai-messages');
      const typingDiv = document.createElement('div');
      typingDiv.className = 'floral-ai-message agent';
      typingDiv.id = 'floral-ai-typing';
      typingDiv.innerHTML = `
        <div class="floral-ai-avatar">🤖</div>
        <div class="floral-ai-typing">
          <div class="floral-ai-typing-dot"></div>
          <div class="floral-ai-typing-dot"></div>
          <div class="floral-ai-typing-dot"></div>
        </div>
      `;
      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
      const typingDiv = document.getElementById('floral-ai-typing');
      if (typingDiv) {
        typingDiv.remove();
      }
    }

    updateStatus(message) {
      const statusDiv = document.getElementById('floral-ai-status');
      if (statusDiv) {
        statusDiv.textContent = message;
      }
    }

    async sendMessage() {
      const input = document.getElementById('floral-ai-input');
      const sendBtn = document.getElementById('floral-ai-send');
      const message = input.value.trim();
      
      if (!message || this.isTyping) return;
      
      console.log('📨 User message:', message);
      
      // Clear input and disable
      input.value = '';
      sendBtn.disabled = true;
      this.isTyping = true;
      
      // Hide welcome message
      const welcome = document.querySelector('.floral-ai-welcome');
      if (welcome) {
        welcome.style.display = 'none';
      }
      
      // Add user message
      this.addMessage(message, true);
      
      // Show typing indicator
      this.showTyping();
      this.updateStatus('Sending message to AI...');
      
      try {
        // Send message to backend with complete integration
        console.log('🔄 Sending to backend...');
        const response = await sendMessage(message);
        
        console.log('📥 Received response:', response);
        
        // Hide typing and add response
        this.hideTyping();
        this.addMessage(response);
        this.updateStatus('Powered by Floral AI • Connected to backend');
        
      } catch (error) {
        console.error('❌ Error sending message:', error);
        this.hideTyping();
        this.addMessage("I apologize, but I'm having trouble processing your request right now. Please try again in a moment.");
        this.updateStatus('Connection error • Please try again');
      } finally {
        this.isTyping = false;
        sendBtn.disabled = false;
        input.focus();
      }
    }
  }

  // 🚀 INITIALIZE WIDGET WHEN DOM IS READY
  function initWidget() {
    console.log('🎯 DOM ready, initializing Floral AI Widget...');
    new FloralAIWidget();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

  console.log('🎉 Floral AI Complete Widget loaded successfully!');
})();
