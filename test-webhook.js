// Test script to debug webhook responses
// Run this in the browser console to test the webhook

async function testWebhook() {
  console.log('🧪 Testing webhook response...');
  
  const testPayload = {
    agent_id: "test-agent-id",
    agent_uuid: "test-agent-uuid",
    user_message: "Hello, this is a test message",
    visitor_id: "test-visitor-" + Date.now(),
    session_id: "test-session-" + Date.now(),
    timestamp: new Date().toISOString()
  };
  
  console.log('📤 Sending payload:', testPayload);
  
  try {
    const response = await fetch('https://abhixchawla.app.n8n.cloud/webhook/49ccefa1-44e4-4117-9cac-00e147f79cc9/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📥 Response text:', responseText);
    
    // Try to parse as JSON
    try {
      const jsonData = JSON.parse(responseText);
      console.log('📥 Parsed JSON:', jsonData);
      console.log('📥 Available fields:', Object.keys(jsonData));
      
      // Check for response fields
      const responseFields = ['response', 'output', 'message', 'reply', 'text'];
      for (const field of responseFields) {
        if (jsonData[field]) {
          console.log(`✅ Found response in field '${field}':`, jsonData[field]);
        }
      }
    } catch (parseError) {
      console.log('📥 Not JSON, treating as text response:', responseText);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the test
testWebhook();
