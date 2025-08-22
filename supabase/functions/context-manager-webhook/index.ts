import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContextManagerPayload {
  agent_id: string;
  agent_uuid: string;
  user_id: string;
  message: string;
  agent_name: string;
  timestamp: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse the request body
    const payload: ContextManagerPayload = await req.json()
    console.log('=== CONTEXT MANAGER WEBHOOK ===')
    console.log('Payload received:', JSON.stringify(payload, null, 2))

    // Validate required fields
    const requiredFields = ['agent_id', 'agent_uuid', 'user_id', 'message']
    for (const field of requiredFields) {
      if (!payload[field]) {
        console.error(`Missing required field: ${field}`)
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
    }

    // Call the n8n webhook
    console.log('Calling n8n context manager webhook...')
    
    const webhookResponse = await fetch('https://abhixchawla.app.n8n.cloud/webhook/contextmanager', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('n8n webhook response status:', webhookResponse.status);
    
    if (!webhookResponse.ok) {
      console.error('n8n webhook failed:', webhookResponse.status, webhookResponse.statusText);
      return new Response(
        JSON.stringify({ 
          error: 'n8n webhook failed',
          status: webhookResponse.status,
          statusText: webhookResponse.statusText
        }),
        { 
          status: webhookResponse.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get response from n8n
    const responseText = await webhookResponse.text();
    console.log('n8n response:', responseText);

    // Try to parse as JSON
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { response: responseText };
    }

    return new Response(
      JSON.stringify({
        success: true,
        response: responseData.response || responseData.message || responseData.output || responseText,
        original_response: responseData
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error in context manager webhook:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
