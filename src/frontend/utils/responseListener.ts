import { ensureUrlProtocol } from "./urlHelpers";

interface ResponseData {
  id: string;
  agent_id: string;
  visitor_id: string;
  session_id: string;
  conversation_id?: string;
  response: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'error';
}

interface ResponseListenerOptions {
  agentId: string;
  visitorId: string;
  sessionId: string;
  conversationId?: string;
  onResponse: (response: string) => void;
  onError: (error: string) => void;
  onTimeout: () => void;
  timeoutMs?: number;
  pollIntervalMs?: number;
}

class ResponseListener {
  private pollingInterval: NodeJS.Timeout | null = null;
  private timeoutId: NodeJS.Timeout | null = null;
  private isPolling = false;
  private startTime: number = 0;

  async startPolling(options: ResponseListenerOptions) {
    if (this.isPolling) {
      console.log('Response listener already polling');
      return;
    }

    this.isPolling = true;
    this.startTime = Date.now();
    const timeoutMs = options.timeoutMs || 30000; // 30 seconds default
    const pollIntervalMs = options.pollIntervalMs || 2000; // 2 seconds default

    console.log('Starting response polling for:', {
      agentId: options.agentId,
      visitorId: options.visitorId,
      sessionId: options.sessionId,
      timeoutMs,
      pollIntervalMs
    });

    // Set timeout
    this.timeoutId = setTimeout(() => {
      this.stopPolling();
      options.onTimeout();
    }, timeoutMs);

    // Start polling
    this.pollingInterval = setInterval(async () => {
      try {
        await this.checkForResponse(options);
      } catch (error) {
        console.error('Error checking for response:', error);
      }
    }, pollIntervalMs);

    // Do initial check
    await this.checkForResponse(options);
  }

  private async checkForResponse(options: ResponseListenerOptions) {
    try {
      // Create a unique identifier for this conversation
      const responseId = `${options.agentId}_${options.visitorId}_${options.sessionId}`;
      
      // Check for response at the n8n webhook endpoint
      const responseUrl = ensureUrlProtocol('abhixchawla.app.n8n.cloud/webhook/49ccefa1-44e4-4117-9cac-00e147f79cc9/chat');
      
      const response = await fetch(responseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          response_id: responseId,
          agent_id: options.agentId,
          visitor_id: options.visitorId,
          session_id: options.sessionId,
          conversation_id: options.conversationId,
          action: 'check_response',
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        const responseText = await response.text();
        console.log('Poll response text:', responseText);
        
        // Try to parse as JSON
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.log('Response is not JSON, treating as text response');
          // If it's not JSON, treat it as a direct response
          this.stopPolling();
          options.onResponse(responseText);
          return;
        }
        
        // Handle JSON response
        if (data.response && data.status === 'completed') {
          console.log('Received JSON response from n8n:', data);
          this.stopPolling();
          options.onResponse(data.response);
          return;
        } else if (data.status === 'error') {
          console.error('n8n returned error:', data.error);
          this.stopPolling();
          options.onError(data.error || 'Unknown error occurred');
          return;
        } else if (data.response) {
          // If there's a response field but no status, treat it as completed
          console.log('Received response without status:', data);
          this.stopPolling();
          options.onResponse(data.response);
          return;
        } else if (data.message || data.output || data.text) {
          // Handle different response field names
          const responseText = data.message || data.output || data.text;
          console.log('Received response with alternative field:', data);
          this.stopPolling();
          options.onResponse(responseText);
          return;
        } else if (data.response && data.success !== undefined) {
          // Special handling for n8n response format
          console.log('✅ Detected n8n response format in polling:', data);
          this.stopPolling();
          options.onResponse(data.response);
          return;
        }
        
        // Still pending, continue polling
        console.log('Response still pending, continuing to poll...');
      } else {
        console.log('Response check failed, status:', response.status);
      }
    } catch (error) {
      console.error('Error checking for response:', error);
      // Don't stop polling on network errors, just log and continue
    }
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    this.isPolling = false;
    console.log('Response polling stopped');
  }

  isActive() {
    return this.isPolling;
  }

  getElapsedTime() {
    return Date.now() - this.startTime;
  }
}

// Create a singleton instance
const responseListener = new ResponseListener();

export default responseListener;
export type { ResponseData, ResponseListenerOptions };
