// Floral AI Agent Embed Script
// Add this script to any website to embed your AI agent

(function() {
  'use strict';
  
  // Configuration
  const config = {
    agentUrl: 'https://ebfbe489-fc0d-489d-b25f-794d5e30a856.lovableproject.com/agent/agent_aa1f9f83_ef1d_4ada_bb7f_b5c9e517e36c',
    agentName: 'PaperKites AI',
    position: 'bottom-right', // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
    theme: 'light', // 'light', 'dark'
    primaryColor: '#3b82f6', // Blue
    secondaryColor: '#8b5cf6' // Purple
  };

  // Create styles
  const styles = `
    .floral-ai-widget {
      position: fixed;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .floral-ai-widget.bottom-right { bottom: 20px; right: 20px; }
    .floral-ai-widget.bottom-left { bottom: 20px; left: 20px; }
    .floral-ai-widget.top-right { top: 20px; right: 20px; }
    .floral-ai-widget.top-left { top: 20px; left: 20px; }
    
    .floral-ai-button {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor});
      border: none;
      color: white;
      cursor: pointer;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
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
      height: 384px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(0, 0, 0, 0.1);
      overflow: hidden;
      display: none;
    }
    
    .floral-ai-chat.active {
      display: block;
    }
    
    .floral-ai-header {
      background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor});
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
      height: 256px;
      padding: 16px;
      overflow-y: auto;
      background: #f8fafc;
    }
    
    .floral-ai-message {
      margin-bottom: 12px;
      display: flex;
      gap: 8px;
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
    }
    
    .floral-ai-message.agent .floral-ai-message-content {
      background: white;
      color: #1f2937;
      border: 1px solid #e5e7eb;
    }
    
    .floral-ai-message.user .floral-ai-message-content {
      background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor});
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
    }
    
    .floral-ai-input:focus {
      border-color: ${config.primaryColor};
    }
    
    .floral-ai-send {
      background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor});
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
    }
    
    .floral-ai-send:hover {
      transform: scale(1.05);
    }
    
    .floral-ai-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .floral-ai-welcome {
      text-align: center;
      padding: 32px 16px;
      color: #6b7280;
    }
    
    .floral-ai-welcome-icon {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor});
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
      }
      
      .floral-ai-widget.bottom-right,
      .floral-ai-widget.bottom-left {
        bottom: 10px;
      }
      
      .floral-ai-widget.bottom-right { right: 10px; }
      .floral-ai-widget.bottom-left { left: 10px; }
    }
  `;

  // Create widget HTML
  function createWidget() {
    const widget = document.createElement('div');
    widget.className = `floral-ai-widget ${config.position}`;
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
              <h3>${config.agentName}</h3>
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
            <input type="text" class="floral-ai-input" id="floral-ai-input" placeholder="Type your message...">
            <button class="floral-ai-send" id="floral-ai-send">➤</button>
          </div>
        </div>
      </div>
    `;
    
    return widget;
  }

  // Widget functionality
  class FloralAIWidget {
    constructor() {
      this.isOpen = false;
      this.messages = [];
      this.isTyping = false;
      this.init();
    }

    init() {
      // Add styles
      const styleSheet = document.createElement('style');
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);

      // Create and add widget
      this.widget = createWidget();
      document.body.appendChild(this.widget);

      // Bind events
      this.bindEvents();
    }

    bindEvents() {
      const button = document.getElementById('floral-ai-button');
      const closeBtn = document.getElementById('floral-ai-close');
      const input = document.getElementById('floral-ai-input');
      const sendBtn = document.getElementById('floral-ai-send');

      button.addEventListener('click', () => this.toggle());
      closeBtn.addEventListener('click', () => this.close());
      
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage();
        }
      });
      
      sendBtn.addEventListener('click', () => this.sendMessage());
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
      document.getElementById('floral-ai-input').focus();
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

    async sendMessage() {
      const input = document.getElementById('floral-ai-input');
      const sendBtn = document.getElementById('floral-ai-send');
      const message = input.value.trim();
      
      if (!message || this.isTyping) return;
      
      // Clear input and disable
      input.value = '';
      sendBtn.disabled = true;
      this.isTyping = true;
      
      // Add user message
      this.addMessage(message, true);
      
      // Show typing indicator
      this.showTyping();
      
      try {
        // Send to agent API
        const response = await fetch(config.agentUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message,
            timestamp: new Date().toISOString()
          })
        });
        
        // Simulate response delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Hide typing and add response
        this.hideTyping();
        this.addMessage("Thank you for your message! I'm here to help you with any questions or assistance you need.");
        
      } catch (error) {
        console.error('Error sending message:', error);
        this.hideTyping();
        this.addMessage("I apologize, but I'm having trouble processing your request right now. Please try again in a moment.");
      } finally {
        this.isTyping = false;
        sendBtn.disabled = false;
        input.focus();
      }
    }
  }

  // Initialize widget when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      new FloralAIWidget();
    });
  } else {
    new FloralAIWidget();
  }
})();
