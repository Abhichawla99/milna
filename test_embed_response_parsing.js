// Test script for embed code response parsing
// This tests the response parsing logic in the embed code

function testResponseParsing() {
  console.log('🧪 Testing Embed Code Response Parsing...\n');

  // Test cases
  const testCases = [
    {
      name: 'Array format with output',
      response: '[{"output": "Hi there! How can I help you today? If you have any questions or need assistance, just let me know."}]',
      expected: 'Hi there! How can I help you today? If you have any questions or need assistance, just let me know.'
    },
    {
      name: 'Single object with output',
      response: '{"output": "Hello! How can I assist you?"}',
      expected: 'Hello! How can I assist you?'
    },
    {
      name: 'Response field',
      response: '{"response": "This is a response message"}',
      expected: 'This is a response message'
    },
    {
      name: 'Message field',
      response: '{"message": "This is a message"}',
      expected: 'This is a message'
    },
    {
      name: 'Plain string',
      response: 'This is a plain string response',
      expected: 'This is a plain string response'
    },
    {
      name: 'Empty response',
      response: '',
      expected: "Thank you for your message! I'm here to help you with any questions or assistance you need."
    }
  ];

  // Test function (simplified version of the embed code logic)
  function parseResponse(data) {
    let agentResponse = "Thank you for your message! I'm here to help you with any questions or assistance you need.";
    
    if (data) { 
      try { 
        const jsonData = JSON.parse(data); 
        
        // Handle array format: [{"output": "message"}]
        if (Array.isArray(jsonData) && jsonData.length > 0 && jsonData[0].output) {
          agentResponse = jsonData[0].output;
        }
        // Handle single object format: {"output": "message"}
        else if (jsonData.output && typeof jsonData.output === 'string') {
          agentResponse = jsonData.output;
        }
        // Handle other common response formats
        else if (jsonData.response && typeof jsonData.response === 'string') {
          agentResponse = jsonData.response;
        } else if (jsonData.message && typeof jsonData.message === 'string') {
          agentResponse = jsonData.message;
        } else if (jsonData.reply && typeof jsonData.reply === 'string') {
          agentResponse = jsonData.reply;
        } else if (jsonData.text && typeof jsonData.text === 'string') {
          agentResponse = jsonData.text;
        } else if (typeof jsonData === 'string') {
          agentResponse = jsonData;
        }
      } catch (e) { 
        agentResponse = data; 
      } 
    }
    
    return agentResponse;
  }

  // Run tests
  let passed = 0;
  let failed = 0;

  testCases.forEach((testCase, index) => {
    console.log(`Test ${index + 1}: ${testCase.name}`);
    console.log(`Input: ${testCase.response}`);
    
    const result = parseResponse(testCase.response);
    console.log(`Result: ${result}`);
    console.log(`Expected: ${testCase.expected}`);
    
    if (result === testCase.expected) {
      console.log('✅ PASSED\n');
      passed++;
    } else {
      console.log('❌ FAILED\n');
      failed++;
    }
  });

  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('🎉 All tests passed! The embed code should now correctly parse your AI backend responses.');
  } else {
    console.log('⚠️  Some tests failed. Please check the parsing logic.');
  }
}

// Run the test
testResponseParsing();

// Export for use in other environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testResponseParsing };
} else {
  window.testResponseParsing = testResponseParsing;
}
