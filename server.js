import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:8083',
    'http://localhost:3000',
    'http://localhost:5173',
    'https://yourdomain.com' // Replace with your production domain
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Webhook proxy endpoint
app.post('/api/webhook-proxy', async (req, res) => {
  try {
    console.log('=== WEBHOOK PROXY REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', req.headers);

    // Validate request body
    if (!req.body) {
      return res.status(400).json({
        error: 'Missing request body',
        message: 'Request body is required'
      });
    }

    // Required fields validation
    const requiredFields = ['agent_id', 'agent_uuid', 'user_id', 'message'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: 'Missing required fields',
        missingFields,
        message: `Required fields: ${requiredFields.join(', ')}`
      });
    }

    // Forward request to n8n webhook
    console.log('Forwarding request to n8n webhook...');
    
    const n8nResponse = await fetch('https://abhixchawla.app.n8n.cloud/webhook/contextmanager', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Webhook-Proxy/1.0'
      },
      body: JSON.stringify(req.body)
    });

    console.log('n8n response status:', n8nResponse.status);
    console.log('n8n response headers:', Object.fromEntries(n8nResponse.headers.entries()));

    // Get response body safely
    let responseBody = '';
    try {
      responseBody = await n8nResponse.text();
      console.log('n8n response body (raw):', responseBody);
    } catch (error) {
      console.error('Error reading n8n response:', error);
      responseBody = '';
    }

    // Try to parse as JSON if it looks like JSON
    let parsedResponse = null;
    if (responseBody.trim() && (responseBody.trim().startsWith('{') || responseBody.trim().startsWith('['))) {
      try {
        parsedResponse = JSON.parse(responseBody);
        console.log('n8n response body (parsed):', parsedResponse);
      } catch (parseError) {
        console.error('Error parsing n8n response as JSON:', parseError);
        parsedResponse = null;
      }
    }

    // Handle n8n response
    if (!n8nResponse.ok) {
      console.error('n8n webhook failed:', n8nResponse.status, responseBody);
      return res.status(n8nResponse.status).json({
        error: 'n8n webhook failed',
        status: n8nResponse.status,
        statusText: n8nResponse.statusText,
        body: responseBody
      });
    }

    // Success response
    console.log('Webhook proxy successful');
    
    // Extract the response content
    let finalResponse = '';
    if (parsedResponse) {
      finalResponse = parsedResponse.response || parsedResponse.message || parsedResponse.output || parsedResponse.text || JSON.stringify(parsedResponse);
    } else {
      finalResponse = responseBody || "Request processed successfully";
    }

    res.status(200).json({
      success: true,
      response: finalResponse,
      original_response: parsedResponse || responseBody,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Webhook proxy error:', error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Webhook proxy server running on port ${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Webhook proxy: http://localhost:${PORT}/api/webhook-proxy`);
  console.log(`🌐 CORS enabled for: ${corsOptions.origin.join(', ')}`);
});

export default app;
