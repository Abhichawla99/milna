import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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

    // Extract the token from the Authorization header
    const token = authHeader.replace('Bearer ', '')
    
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify the token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Authentication error:', authError)
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get user profile with message count and subscription info
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select(`
        message_count,
        subscription_status,
        subscription_tier,
        appsumo_redeemed
      `)
      .eq('user_id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching user profile:', profileError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user profile' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Calculate message limits and access
    const messageCount = profile?.message_count || 0
    const freeMessageLimit = 100 // Updated to 100 messages
    const hasProAccess = profile?.subscription_status === 'active' || profile?.appsumo_redeemed === true
    const canSendMessage = hasProAccess || messageCount < freeMessageLimit
    const messagesRemaining = hasProAccess ? -1 : Math.max(0, freeMessageLimit - messageCount)
    const isLimitReached = !hasProAccess && messageCount >= freeMessageLimit

    console.log('Message limit check:', {
      userId: user.id,
      messageCount,
      freeMessageLimit,
      hasProAccess,
      canSendMessage,
      messagesRemaining,
      isLimitReached
    })

    return new Response(
      JSON.stringify({
        messageCount,
        freeMessageLimit,
        hasProAccess,
        canSendMessage,
        messagesRemaining,
        isLimitReached,
        appsumoRedeemed: profile?.appsumo_redeemed || false,
        subscriptionStatus: profile?.subscription_status || null,
        subscriptionTier: profile?.subscription_tier || null
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

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
