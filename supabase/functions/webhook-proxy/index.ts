import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
  
  // Add https:// for webhook URLs (more secure)
  return `https://${trimmedUrl}`;
};

interface DocumentWebhookPayload {
  document_id: string;
  agent_uuid: string; // Now using agent_uuid instead of agent_id
  user_id: string;
  bucket: string;
  file_path: string;
  filename: string;
  mime_type: string;
  file_size: number;
  signed_url: string;
  name?: string;
  goal?: string;
  tone?: string;
  instructions?: string;
  idempotency_key?: string;
}

interface ContextManagerWebhookPayload {
  agent_id: string;
  agent_uuid: string;
  user_id: string;
  message: string;
  agent_name: string;
  timestamp: string;
}

type WebhookPayload = DocumentWebhookPayload | ContextManagerWebhookPayload;

// Message limit checking functions
const checkMessageLimit = async (supabase: any, userId: string): Promise<boolean> => {
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('message_count, subscription_status, appsumo_redeemed')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error checking message limit:', error);
      return true; // Allow on error
    }

    const messageCount = profile?.message_count || 0;
    const hasProAccess = profile?.subscription_status === 'active' || profile?.appsumo_redeemed === true;
    
    return hasProAccess || messageCount < 100; // Updated to 100 messages
  } catch (error) {
    console.error('Error in checkMessageLimit:', error);
    return true; // Allow on error
  }
};

const incrementMessageCount = async (supabase: any, userId: string): Promise<void> => {
  try {
    const { data: profile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('message_count')
      .eq('user_id', userId)
      .single();

    if (fetchError) {
      console.error('Error fetching message count:', fetchError);
      return;
    }

    const currentCount = profile?.message_count || 0;

    const { error: updateError } = await supabase
      .from('user_profiles')
      .update({
        message_count: currentCount + 1,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Error updating message count:', updateError);
    } else {
      console.log(`Message count incremented for user ${userId}: ${currentCount} -> ${currentCount + 1}`);
    }
  } catch (error) {
    console.error('Error in incrementMessageCount:', error);
  }
};

// Handle context manager webhook requests
const handleContextManagerRequest = async (payload: ContextManagerWebhookPayload, corsHeaders: any) => {
  try {
    console.log('Processing context manager request:', JSON.stringify(payload, null, 2));

    // Validate required fields
    const requiredFields = ['agent_id', 'agent_uuid', 'user_id', 'message'];
    for (const field of requiredFields) {
      if (!payload[field]) {
        console.error(`Missing required field: ${field}`);
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Create Supabase client for message limit checking
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check message limit before processing
    const canSendMessage = await checkMessageLimit(supabase, payload.user_id)
    if (!canSendMessage) {
      console.log(`Message limit reached for user ${payload.user_id}`)
      return new Response(
        JSON.stringify({ 
          error: 'Message limit reached',
          message: 'You have reached your 100 message limit. Please upgrade to Pro for unlimited messaging.'
        }),
        { 
          status: 429, // Too Many Requests
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Call the n8n context manager webhook
    console.log('Calling n8n context manager webhook...');
    
    const webhookResponse = await fetch('https://abhixchawla.app.n8n.cloud/webhook/contextmanager', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    console.log('n8n context manager webhook response status:', webhookResponse.status);
    
    if (!webhookResponse.ok) {
      console.error('n8n context manager webhook failed:', webhookResponse.status, webhookResponse.statusText);
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
      );
    }

    // Increment message count after successful webhook call
    await incrementMessageCount(supabase, payload.user_id);

    // Get response from n8n
    const responseText = await webhookResponse.text();
    console.log('n8n context manager response:', responseText);

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
    );

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
    );
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify the request is authenticated
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.log('Missing authorization header')
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Parse the request body
    const payload: WebhookPayload = await req.json()
    console.log('=== WEBHOOK PROXY DEBUG ===')
    console.log('Full webhook payload received:', JSON.stringify(payload, null, 2))
    
    // Detect request type based on payload structure
    const isContextManagerRequest = 'message' in payload && 'agent_id' in payload;
    const isDocumentUploadRequest = 'document_id' in payload && 'bucket' in payload;
    
    console.log('Request type detection:');
    console.log('- isContextManagerRequest:', isContextManagerRequest);
    console.log('- isDocumentUploadRequest:', isDocumentUploadRequest);
    
    if (isContextManagerRequest) {
      console.log('=== CONTEXT MANAGER REQUEST ===');
      return handleContextManagerRequest(payload as ContextManagerWebhookPayload, corsHeaders);
    } else if (isDocumentUploadRequest) {
      console.log('=== DOCUMENT UPLOAD REQUEST ===');
      console.log('Agent UUID from payload:', payload.agent_uuid);
      console.log('Agent UUID type:', typeof payload.agent_uuid);
      console.log('Agent UUID is null?', payload.agent_uuid === null);
      console.log('Agent UUID is undefined?', payload.agent_uuid === undefined);
    } else {
      console.error('Unknown request type - payload does not match expected structure');
      return new Response(
        JSON.stringify({ error: 'Invalid payload structure' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create Supabase client for message limit checking
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check message limit before processing
    const canSendMessage = await checkMessageLimit(supabase, payload.user_id)
    if (!canSendMessage) {
      console.log(`Message limit reached for user ${payload.user_id}`)
      return new Response(
        JSON.stringify({ 
          error: 'Message limit reached',
          message: 'You have reached your 100 message limit. Please upgrade to Pro for unlimited messaging.'
        }),
        { 
          status: 429, // Too Many Requests
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate required fields
    const requiredFields = ['document_id', 'agent_uuid', 'user_id', 'bucket', 'file_path', 'filename', 'mime_type', 'file_size', 'signed_url']
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

    // Prepare webhook data for n8n
    const webhookData = {
      document_id: payload.document_id,
      agent_uuid: payload.agent_uuid, // Now using agent_uuid as the primary identifier
      user_id: payload.user_id,
      bucket: payload.bucket,
      file_path: payload.file_path,
      filename: payload.filename,
      mime_type: payload.mime_type,
      file_size: payload.file_size,
      signed_url: payload.signed_url,
      name: payload.name || '',
      goal: payload.goal || '',
      tone: payload.tone || '',
      instructions: payload.instructions || '',
      idempotency_key: payload.idempotency_key || payload.document_id,
      timestamp: new Date().toISOString()
    }

    console.log('Calling n8n webhook...')
    console.log('Final webhook data being sent to n8n:', JSON.stringify(webhookData, null, 2))
    
    // Try to call the n8n webhook with a timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    try {
      // Ensure the webhook URL has proper protocol
      const webhookUrl = ensureUrlProtocol('abhixchawla.app.n8n.cloud/webhook/agentconfigure');
      
      const webhookResponse = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      console.log('Webhook response status:', webhookResponse.status)
      
      let responseBody = ''
      try {
        responseBody = await webhookResponse.text()
        console.log('Webhook response body:', responseBody)
      } catch (error) {
        console.error('Error reading webhook response:', error)
        responseBody = 'Unable to read response'
      }

      if (!webhookResponse.ok) {
        console.error('Webhook call failed:', webhookResponse.status, responseBody)
        
        // Don't fail the entire request if webhook fails - document is already uploaded
        console.log('Webhook failed but document upload was successful, continuing...')
        return new Response(
          JSON.stringify({ 
            success: true, 
            warning: 'Document uploaded successfully, but external processing failed',
            webhook_status: webhookResponse.status,
            webhook_body: responseBody 
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      console.log('Webhook call successful')
      
      // Increment message count after successful processing
      await incrementMessageCount(supabase, payload.user_id)
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          status: webhookResponse.status,
          body: responseBody 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )

    } catch (webhookError) {
      clearTimeout(timeoutId)
      console.error('Webhook call error:', webhookError)
      
      // Don't fail the entire request if webhook fails - document is already uploaded
      console.log('Webhook error but document upload was successful, continuing...')
      return new Response(
        JSON.stringify({ 
          success: true, 
          warning: 'Document uploaded successfully, but external processing failed',
          error: webhookError.message 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

  } catch (error) {
    console.error('Edge function error:', error)
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
