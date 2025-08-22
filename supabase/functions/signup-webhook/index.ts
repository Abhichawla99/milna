
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Utility function to ensure URLs have proper protocol
const ensureUrlProtocol = (url: string): string => {
  if (!url) return url;
  
  // Trim whitespace
  const trimmedUrl = url.trim();
  
  // If already has protocol, return as is
  if (trimmedUrl.match(/^https?:\/\//i)) {
    return trimmedUrl;
  }
  
  // Add http:// if no protocol is present
  return `http://${trimmedUrl}`;
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user_id, name, email, company, website, hasPermission, agent_id } = await req.json()

    console.log('Received signup data:', {
      user_id,
      name,
      email,
      company,
      website,
      hasPermission,
      agent_id
    })

    // Normalize the website URL
    const normalizedWebsite = website ? ensureUrlProtocol(website) : '';

    // Prepare payload for n8n webhook
    const webhookPayload = {
      user_id,
      name,
      email,
      company,
      website: normalizedWebsite,
      hasPermission: hasPermission || false,
      agent_id: agent_id || null,
      timestamp: new Date().toISOString()
    };

    console.log('Sending to n8n webhook:', webhookPayload);

    // Send to n8n webhook
    const n8nResponse = await fetch('https://abhixchawla.app.n8n.cloud/webhook/newsiteuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
    });

    if (!n8nResponse.ok) {
      console.error('n8n webhook failed:', n8nResponse.status, await n8nResponse.text());
      throw new Error(`n8n webhook failed with status ${n8nResponse.status}`);
    }

    const n8nResult = await n8nResponse.text();
    console.log('n8n webhook response:', n8nResult);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Signup data sent to webhook successfully',
        webhook_response: n8nResult
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error processing webhook:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to process signup data',
        details: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
