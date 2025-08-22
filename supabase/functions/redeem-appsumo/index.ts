
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[REDEEM-APPSUMO] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { code } = await req.json();
    if (!code) throw new Error("AppSumo code is required");
    logStep("Code provided", { code });

    // Check if code exists and is not redeemed
    const { data: codeData, error: codeError } = await supabaseClient
      .from("appsumo_codes")
      .select("*")
      .eq("code", code)
      .eq("is_redeemed", false)
      .single();

    if (codeError || !codeData) {
      logStep("Invalid or already redeemed code", { code, error: codeError });
      return new Response(JSON.stringify({ error: "Invalid or already redeemed code" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Check if code is expired
    if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
      logStep("Code is expired", { code, expires_at: codeData.expires_at });
      return new Response(JSON.stringify({ error: "Code has expired" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Check if user already redeemed a code
    const { data: profile } = await supabaseClient
      .from("user_profiles")
      .select("appsumo_redeemed")
      .eq("user_id", user.id)
      .single();

    if (profile?.appsumo_redeemed) {
      logStep("User already redeemed AppSumo code");
      return new Response(JSON.stringify({ error: "You have already redeemed an AppSumo code" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Redeem the code
    const { error: redeemError } = await supabaseClient
      .from("appsumo_codes")
      .update({
        is_redeemed: true,
        redeemed_by: user.id,
        redeemed_at: new Date().toISOString(),
      })
      .eq("id", codeData.id);

    if (redeemError) {
      logStep("Error redeeming code", { error: redeemError });
      throw new Error("Failed to redeem code");
    }

    // Update user profile
    const { error: profileError } = await supabaseClient
      .from("user_profiles")
      .upsert({
        user_id: user.id,
        appsumo_redeemed: true,
        subscription_status: "active",
        subscription_tier: "Pro",
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      logStep("Error updating profile", { error: profileError });
      throw new Error("Failed to update user profile");
    }

    logStep("Code redeemed successfully", { code, userId: user.id });

    return new Response(JSON.stringify({ 
      success: true, 
      message: "AppSumo code redeemed successfully! You now have Pro access." 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in redeem-appsumo", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
