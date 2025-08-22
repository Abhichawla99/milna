// Test script for the new response parsing function
// This tests the cleanResponse function that removes JSON brackets and quotes

function cleanResponse(response) {
  if (!response) return "Thank you for your message! I'm here to help you.";
  
  // Try to parse as JSON first
  try {
    const parsed = JSON.parse(response);
    
    // Handle array format: [{"output": "message"}]
    if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].output) {
      return parsed[0].output;
    }
    
    // Handle object formats
    if (parsed.output) return parsed.output;
    if (parsed.response) return parsed.response;
    if (parsed.message) return parsed.message;
    if (parsed.reply) return parsed.reply;
    if (parsed.text) return parsed.text;
    
    // If it's a string, return it
    if (typeof parsed === 'string') return parsed;
    
  } catch (e) {
    // If JSON parsing fails, treat as plain text
  }
  
  // Remove extra quotes at start and end if it's a string
  response = response.replace(/^"|"$/g, '');
  
  return response.trim() || "Thank you for your message! I'm here to help you.";
}

// Test cases
const testCases = [
  {
    input: '[{"output": "Hi there! How can I help you today?"}]',
    expected: 'Hi there! How can I help you today?',
    description: 'Array format with output field'
  },
  {
    input: '{"output": "Hello! I\'m here to assist you."}',
    expected: 'Hello! I\'m here to assist you.',
    description: 'Object format with output field'
  },
  {
    input: '{"response": "This is a test response"}',
    expected: 'This is a test response',
    description: 'Object format with response field'
  },
  {
    input: '{"message": "Simple message here"}',
    expected: 'Simple message here',
    description: 'Object format with message field'
  },
  {
    input: '"Just a quoted string"',
    expected: 'Just a quoted string',
    description: 'Simple quoted string'
  },
  {
    input: 'Plain text without quotes',
    expected: 'Plain text without quotes',
    description: 'Plain text without any formatting'
  },
  {
    input: '',
    expected: "Thank you for your message! I'm here to help you.",
    description: 'Empty response'
  },
  {
    input: null,
    expected: "Thank you for your message! I'm here to help you.",
    description: 'Null response'
  }
];

console.log('🧪 Testing new response parsing function...\n');

let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  const result = cleanResponse(testCase.input);
  const success = result === testCase.expected;
  
  console.log(`Test ${index + 1}: ${testCase.description}`);
  console.log(`  Input:    ${JSON.stringify(testCase.input)}`);
  console.log(`  Expected: ${JSON.stringify(testCase.expected)}`);
  console.log(`  Result:   ${JSON.stringify(result)}`);
  console.log(`  Status:   ${success ? '✅ PASS' : '❌ FAIL'}`);
  console.log('');
  
  if (success) {
    passed++;
  } else {
    failed++;
  }
});

console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
console.log('');

if (failed === 0) {
  console.log('🎉 All tests passed! The response parsing function is working correctly.');
  console.log('✨ Your embedded widgets will now display clean responses without JSON formatting.');
} else {
  console.log('⚠️  Some tests failed. Please check the response parsing function.');
}

// Test the function in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { cleanResponse };
}
