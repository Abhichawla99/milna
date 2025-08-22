// Test script for n8n response format
// Run this in the browser console to test the response parsing

function testN8nResponseParsing() {
  console.log('🧪 Testing n8n response parsing...');
  
  // Simulate the n8n response format
  const n8nResponse = {
    response: "Hello! I'm your AI agent. How can I help you today?",
    success: true
  };
  
  console.log('📥 Simulated n8n response:', n8nResponse);
  
  // Test the parsing logic
  let agentResponse = '';
  
  // Use the same parsing logic as the chat components
  if (n8nResponse.response && n8nResponse.success !== undefined) {
    console.log('✅ Detected n8n response format');
    agentResponse = n8nResponse.response;
  } else {
    agentResponse = n8nResponse.response || n8nResponse.output || n8nResponse.message || n8nResponse.reply || n8nResponse.text || JSON.stringify(n8nResponse);
  }
  
  console.log('🎯 Final parsed response:', agentResponse);
  console.log('✅ Response will be displayed in chat:', agentResponse);
  
  return agentResponse;
}

// Test with different response formats
function testAllFormats() {
  console.log('\n🧪 Testing all response formats...');
  
  const testCases = [
    {
      name: 'n8n format',
      response: { response: "AI response here", success: true }
    },
    {
      name: 'simple response',
      response: { response: "Simple response" }
    },
    {
      name: 'output field',
      response: { output: "Output response" }
    },
    {
      name: 'message field',
      response: { message: "Message response" }
    },
    {
      name: 'plain text',
      response: "Plain text response"
    }
  ];
  
  testCases.forEach(testCase => {
    console.log(`\n📝 Testing ${testCase.name}:`, testCase.response);
    
    let agentResponse = '';
    
    if (typeof testCase.response === 'string') {
      agentResponse = testCase.response;
    } else if (testCase.response.response && testCase.response.success !== undefined) {
      agentResponse = testCase.response.response;
    } else {
      agentResponse = testCase.response.response || testCase.response.output || testCase.response.message || testCase.response.reply || testCase.response.text || JSON.stringify(testCase.response);
    }
    
    console.log(`✅ ${testCase.name} result:`, agentResponse);
  });
}

// Run the tests
testN8nResponseParsing();
testAllFormats();
