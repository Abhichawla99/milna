// Test script for document upload webhook
// Run this in the browser console to test the webhook-proxy function

async function testDocumentWebhook() {
  console.log('🧪 Testing document upload webhook...');
  
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
  
  // Create a test payload
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
    console.log('🚀 Invoking webhook-proxy function...');
    
    const { data, error } = await supabase.functions.invoke("webhook-proxy", {
      body: testPayload,
    });
    
    console.log('📥 Function response data:', data);
    console.log('📥 Function response error:', error);
    
    if (error) {
      console.log('❌ Webhook function error:', error);
    } else {
      console.log('✅ Webhook function called successfully');
    }
    
  } catch (error) {
    console.error('❌ Error calling webhook function:', error);
  }
}

// Run the test
testDocumentWebhook();
