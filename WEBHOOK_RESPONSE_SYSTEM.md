# Webhook Response Listening System

## Overview

The chat system now implements an asynchronous response listening mechanism that sends webhooks to your n8n endpoint and polls for responses. This allows for longer processing times and better user experience.

## How It Works

### 1. Webhook Flow

1. **User sends message** → Frontend sends webhook to n8n
2. **n8n processes** → Your workflow handles the request
3. **Frontend polls** → Checks for response every 2 seconds
4. **Response received** → Displays in chat interface

### 2. Webhook Endpoints

**Chat Webhook:** `https://abhixchawla.app.n8n.cloud/webhook/49ccefa1-44e4-4117-9cac-00e147f79cc9/chat`

### 3. Request Payload

```json
{
  "agent_id": "agent-uuid-string",
  "agent_uuid": "agent-uuid-string",
  "user_message": "User's message",
  "visitor_id": "unique-visitor-id",
  "session_id": "unique-session-id",
  "conversation_id": "conversation-uuid",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

### 4. Response Polling

The system polls for responses using this payload:

```json
{
  "response_id": "agentId_visitorId_sessionId",
  "agent_id": "agent-uuid-string",
  "visitor_id": "unique-visitor-id",
  "session_id": "unique-session-id",
  "conversation_id": "conversation-uuid",
  "action": "check_response"
}
```

### 5. Expected Response Format

Your n8n workflow should return:

```json
{
  "status": "completed",
  "response": "AI agent's response message"
}
```

Or for errors:

```json
{
  "status": "error",
  "error": "Error message"
}
```

## Configuration

### Polling Settings

- **Poll Interval:** 2 seconds
- **Timeout:** 30 seconds
- **Max Retries:** 15 attempts

### Components Using Response Listening

1. **AgentChatModal** - Main chat interface
2. **AgentConfigModal** - Test chat functionality
3. **AgentEmbedModal** - Embedded chat widget

## Implementation Details

### ResponseListener Class

Located in `src/frontend/utils/responseListener.ts`

```typescript
// Start polling for response
await responseListener.startPolling({
  agentId: agent.agent_id || agent.id,
  visitorId,
  sessionId,
  conversationId,
  onResponse: (responseText) => {
    // Handle successful response
  },
  onError: (error) => {
    // Handle error
  },
  onTimeout: () => {
    // Handle timeout
  },
  timeoutMs: 30000,
  pollIntervalMs: 2000
});
```

### Cleanup

The system automatically stops polling when:
- Response is received
- Error occurs
- Timeout is reached
- Modal is closed

## n8n Workflow Requirements

Your n8n workflow should:

1. **Receive the initial webhook** with user message
2. **Process the request** (AI processing, etc.)
3. **Store the response** temporarily
4. **Return response** when polled with `action: "check_response"`

### Example n8n Response Handling

```javascript
// In your n8n workflow
if ($input.json().action === "check_response") {
  // Return stored response
  return {
    status: "completed",
    response: "AI response here"
  };
} else {
  // Process new message
  // Store response for later retrieval
  return { status: "processing" };
}
```

## Testing

1. **Send a message** in any chat interface
2. **Check browser console** for polling logs
3. **Verify webhook delivery** in n8n
4. **Test response handling** with your workflow

## Error Handling

The system handles:
- Network errors (continues polling)
- Timeout errors (shows timeout message)
- n8n errors (displays error message)
- Invalid responses (shows fallback message)
