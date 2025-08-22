// Test script for direct webhook call
// Run this in the browser console to test the direct n8n webhook

async function testDirectWebhook() {
  console.log('🧪 Testing direct webhook call...');
  
  // Get the current user and agent
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log('❌ No user logged in');
    return;
  }
  
  console.log('👤 User:', user.email);
  
  // Get the first agent for testing
  const { data: agents, error: agentError } = await supabase
    .from('agents')
    .select('*')
    .eq('user_id', user.id)
    .limit(1);
    
  if (agentError || !agents || agents.length === 0) {
    console.log('❌ No agents found:', agentError);
    return;
  }
  
  const agent = agents[0];
  console.log('🤖 Agent:', agent.name, 'ID:', agent.id);
  
  // Create a test payload (same as document upload)
  const testPayload = {
    idempotency_key: `test:${Date.now()}`,
    document_id: crypto.randomUUID(),
    agent_uuid: agent.id,
    user_id: user.id,
    bucket: "agent-documents",
    file_path: `test/path/document.pdf`,
    filename: "test-document.pdf",
    mime_type: "application/pdf",
    file_size: 1024,
    signed_url: "https://example.com/test-document.pdf",
    name: agent.name,
    goal: "Test goal",
    tone: "Professional",
    instructions: "Test instructions"
  };
  
  console.log('📤 Test payload:', testPayload);
  
  try {
    console.log('🚀 Sending webhook directly to n8n...');
    
    const response = await fetch('https://abhixchawla.app.n8n.cloud/webhook/agentconfigure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPayload)
    });
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response ok:', response.ok);
    
    if (response.ok) {
      const responseText = await response.text();
      console.log('📥 Response text:', responseText);
      console.log('✅ Webhook sent successfully!');
    } else {
      console.log('❌ Webhook failed:', response.status, response.statusText);
    }
    
  } catch (error) {
    console.error('❌ Error sending webhook:', error);
  }
}

// Run the test
testDirectWebhook();
