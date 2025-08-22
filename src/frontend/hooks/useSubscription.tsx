
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/frontend/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type ProUserFeatures = {
  unlimited_agents: boolean;
  unlimited_messages: boolean;
  unlimited_integrations: boolean;
  unlimited_documents: boolean;
  custom_integrations: boolean;
  priority_support: boolean;
  advanced_analytics: boolean;
  white_label: boolean;
  api_access: boolean;
  team_members_limit: number;
  custom_domain: boolean;
  sso_access: boolean;
  dedicated_support: boolean;
};

type ProUserData = {
  id: string;
  user_id: string;
  subscription_type: string;
  subscription_status: string;
  subscription_start: string;
  subscription_end: string | null;
  billing_cycle: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  features: ProUserFeatures;
  created_at: string;
  updated_at: string;
};

type UserLimits = {
  message_limit: number;
  agent_limit: number;
  integration_limit: number;
  document_limit: number;
  is_pro_user: boolean;
};

type SubscriptionContextType = {
  // Legacy fields for backward compatibility
  subscribed: boolean;
  subscriptionTier: string | null;
  subscriptionEnd: string | null;
  messageCount: number;
  messageLimit: number;
  messagesRemaining: number;
  isLimitReached: boolean;
  appsumoAccess: boolean;
  loading: boolean;
  
  // New pro user fields
  isProUser: boolean;
  proUserData: ProUserData | null;
  userLimits: UserLimits | null;
  agentCount: number;
  integrationCount: number;
  documentCount: number;
  
  // Functions
  checkSubscription: () => Promise<void>;
  checkMessageLimit: () => Promise<void>;
  checkProUserStatus: () => Promise<void>;
  getUserLimits: () => Promise<void>;
  createCheckout: () => Promise<void>;
  openCustomerPortal: () => Promise<void>;
  redeemAppsumoCode: (code: string) => Promise<{ success: boolean; message: string }>;
  refreshUsage: () => Promise<void>;
  upgradeToPro: (subscriptionType?: string, stripeCustomerId?: string, stripeSubscriptionId?: string) => Promise<boolean>;
  downgradeFromPro: () => Promise<boolean>;
  canCreateAgent: () => boolean;
  canSendMessage: () => boolean;
  canAddIntegration: () => boolean;
  canUploadDocument: () => boolean;
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, session } = useAuth();
  
  // Legacy state for backward compatibility
  const [subscribed, setSubscribed] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string | null>(null);
  const [subscriptionEnd, setSubscriptionEnd] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const [messageLimit, setMessageLimit] = useState(100);
  const [messagesRemaining, setMessagesRemaining] = useState(100);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [appsumoAccess, setAppsumoAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // New pro user state
  const [isProUser, setIsProUser] = useState(false);
  const [proUserData, setProUserData] = useState<ProUserData | null>(null);
  const [userLimits, setUserLimits] = useState<UserLimits | null>(null);
  const [agentCount, setAgentCount] = useState(0);
  const [integrationCount, setIntegrationCount] = useState(0);
  const [documentCount, setDocumentCount] = useState(0);

  const checkProUserStatus = async () => {
    if (!user || !session) return;
    
    try {
      // Check if user is pro using the database function
      const { data: isPro, error: proError } = await supabase.rpc('is_pro_user', {
        user_uuid: user.id
      });
      
      if (proError) throw proError;
      
      setIsProUser(isPro || false);
      
      // If pro user, fetch detailed pro user data
      if (isPro) {
        const { data: proData, error: proDataError } = await supabase
          .from('pro_users')
          .select('*')
          .eq('user_id', user.id)
          .eq('subscription_status', 'active')
          .single();
        
        if (!proDataError && proData) {
          setProUserData({
            id: proData.id,
            user_id: proData.user_id,
            subscription_type: proData.subscription_type,
            subscription_status: proData.subscription_status,
            subscription_start: proData.subscription_start,
            subscription_end: proData.subscription_end,
            billing_cycle: proData.billing_cycle,
            stripe_customer_id: proData.stripe_customer_id,
            stripe_subscription_id: proData.stripe_subscription_id,
            features: {
              unlimited_agents: proData.unlimited_agents,
              unlimited_messages: proData.unlimited_messages,
              unlimited_integrations: proData.unlimited_integrations,
              unlimited_documents: proData.unlimited_documents,
              custom_integrations: proData.custom_integrations,
              priority_support: proData.priority_support,
              advanced_analytics: proData.advanced_analytics,
              white_label: proData.white_label,
              api_access: proData.api_access,
              team_members_limit: proData.team_members_limit,
              custom_domain: proData.custom_domain,
              sso_access: proData.sso_access,
              dedicated_support: proData.dedicated_support,
            },
            created_at: proData.created_at,
            updated_at: proData.updated_at,
          });
        }
      } else {
        setProUserData(null);
      }
    } catch (error) {
      console.error('Error checking pro user status:', error);
    }
  };

  const getUserLimits = async () => {
    if (!user || !session) return;
    
    try {
      // Get user limits using the database function
      const { data: limits, error: limitsError } = await supabase.rpc('get_user_limits', {
        user_uuid: user.id
      });
      
      if (limitsError) throw limitsError;
      
      if (limits && limits.length > 0) {
        const limitData = limits[0];
        setUserLimits({
          message_limit: limitData.message_limit,
          agent_limit: limitData.agent_limit,
          integration_limit: limitData.integration_limit,
          document_limit: limitData.document_limit,
          is_pro_user: limitData.is_pro_user,
        });
        
        // Update legacy state for backward compatibility
        setMessageLimit(limitData.message_limit === -1 ? Infinity : limitData.message_limit);
        setIsProUser(limitData.is_pro_user);
        setSubscribed(limitData.is_pro_user);
      }
    } catch (error) {
      console.error('Error getting user limits:', error);
    }
  };

  // Real-time monitoring for pro_users table changes
  useEffect(() => {
    if (!user) return;

    // Set up real-time subscription to watch for pro_users changes
    const channel = supabase
      .channel('pro_users_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pro_users',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Pro users table change detected:', payload);
          
          // Handle different types of changes
          if (payload.eventType === 'INSERT') {
            // New pro user entry created
            console.log('New pro user entry detected!');
            checkProUserStatus();
            getUserLimits();
            getUsageCounts();
            
            // Show success notification
            if (typeof window !== 'undefined' && window.toast) {
              window.toast({
                title: "Welcome to Pro! 🎉",
                description: "Your account has been upgraded successfully.",
              });
            }
          } else if (payload.eventType === 'UPDATE') {
            // Pro user entry updated
            console.log('Pro user entry updated');
            checkProUserStatus();
            getUserLimits();
          } else if (payload.eventType === 'DELETE') {
            // Pro user entry deleted (downgrade)
            console.log('Pro user entry deleted');
            setIsProUser(false);
            setProUserData(null);
            getUserLimits();
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Polling fallback for payment status (in case real-time fails)
  useEffect(() => {
    if (!user || isProUser) return;

    const checkPaymentStatus = async () => {
      try {
        // Check if user has been upgraded to pro
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('is_pro_user, subscription_status')
          .eq('user_id', user.id)
          .single();
        
        if (profile?.is_pro_user) {
          // User has been upgraded - refresh all data
          await checkProUserStatus();
          await getUserLimits();
          await getUsageCounts();
          
          // Show success notification
          if (typeof window !== 'undefined' && window.toast) {
            window.toast({
              title: "Welcome to Pro! 🎉",
              description: "Your account has been upgraded successfully.",
            });
          }
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    };

    // Poll every 5 seconds for the first 2 minutes after user logs in
    const interval = setInterval(checkPaymentStatus, 5000);
    const timeout = setTimeout(() => {
      clearInterval(interval);
    }, 120000); // Stop polling after 2 minutes

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [user, isProUser]);

  const getUsageCounts = async () => {
    if (!user) return;
    
    try {
      // Get agent count
      const { count: agentCount } = await supabase
        .from('agents')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
      
      setAgentCount(agentCount || 0);
      
      // Get integration count
      const { count: integrationCount } = await supabase
        .from('agent_integrations')
        .select('*', { count: 'exact', head: true })
        .eq('agent_id', supabase.from('agents').select('id').eq('user_id', user.id));
      
      setIntegrationCount(integrationCount || 0);
      
      // Get document count
      const { count: documentCount } = await supabase
        .from('agent_documents')
        .select('*', { count: 'exact', head: true })
        .eq('agent_id', supabase.from('agents').select('id').eq('user_id', user.id));
      
      setDocumentCount(documentCount || 0);
    } catch (error) {
      console.error('Error getting usage counts:', error);
    }
  };

  const checkSubscription = async () => {
    if (!user || !session) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setSubscribed(data.subscribed || false);
      setSubscriptionTier(data.subscription_tier || null);
      setSubscriptionEnd(data.subscription_end || null);
      setAppsumoAccess(data.appsumo_access || false);
    } catch (error) {
      console.error('Error checking subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkMessageLimit = async () => {
    if (!user || !session) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('check-message-limit', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      setMessageCount(data.messageCount || 0);
      setMessagesRemaining(data.messagesRemaining || 0);
      setIsLimitReached(data.isLimitReached || false);
      setMessageLimit(data.freeMessageLimit || 100);
      setSubscribed(data.hasProAccess || false);
      setAppsumoAccess(data.appsumoRedeemed || false);
    } catch (error) {
      console.error('Error checking message limit:', error);
      // Fallback to basic message count if API fails
      await refreshUsage();
    }
  };

  const refreshUsage = async () => {
    if (!user) return;
    
    try {
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("message_count")
        .eq("user_id", user.id)
        .single();
      
      const count = profile?.message_count || 0;
      setMessageCount(count);
      setMessagesRemaining(Math.max(0, messageLimit - count));
      setIsLimitReached(count >= messageLimit);
    } catch (error) {
      console.error('Error refreshing usage:', error);
    }
  };

  const createCheckout = async () => {
    if (!session) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error creating checkout:', error);
      throw error;
    }
  };

  const openCustomerPortal = async () => {
    if (!session) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      window.open(data.url, '_blank');
    } catch (error) {
      console.error('Error opening customer portal:', error);
      throw error;
    }
  };

  const redeemAppsumoCode = async (code: string): Promise<{ success: boolean; message: string }> => {
    if (!session) throw new Error('Not authenticated');
    
    try {
      const { data, error } = await supabase.functions.invoke('redeem-appsumo', {
        body: { code },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      if (data.success) {
        await checkSubscription();
        await checkMessageLimit();
        await checkProUserStatus();
        await getUserLimits();
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error || 'Failed to redeem code' };
      }
    } catch (error: any) {
      console.error('Error redeeming AppSumo code:', error);
      return { success: false, message: error.message || 'Failed to redeem code' };
    }
  };

  const upgradeToPro = async (
    subscriptionType: string = 'pro',
    stripeCustomerId?: string,
    stripeSubscriptionId?: string
  ): Promise<boolean> => {
    if (!user || !session) return false;
    
    try {
      const { data, error } = await supabase.rpc('upgrade_to_pro', {
        user_uuid: user.id,
        subscription_type: subscriptionType,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        billing_cycle: 'monthly'
      });
      
      if (error) throw error;
      
      // Refresh all pro user data
      await checkProUserStatus();
      await getUserLimits();
      await getUsageCounts();
      
      return true;
    } catch (error) {
      console.error('Error upgrading to pro:', error);
      return false;
    }
  };

  const downgradeFromPro = async (): Promise<boolean> => {
    if (!user || !session) return false;
    
    try {
      const { data, error } = await supabase.rpc('downgrade_from_pro', {
        user_uuid: user.id
      });
      
      if (error) throw error;
      
      // Refresh all pro user data
      await checkProUserStatus();
      await getUserLimits();
      await getUsageCounts();
      
      return true;
    } catch (error) {
      console.error('Error downgrading from pro:', error);
      return false;
    }
  };

  // Helper functions to check permissions
  const canCreateAgent = (): boolean => {
    if (isProUser && proUserData?.features.unlimited_agents) return true;
    if (!userLimits) return false;
    return userLimits.agent_limit === -1 || agentCount < userLimits.agent_limit;
  };

  const canSendMessage = (): boolean => {
    if (isProUser && proUserData?.features.unlimited_messages) return true;
    if (!userLimits) return false;
    return userLimits.message_limit === -1 || messageCount < userLimits.message_limit;
  };

  const canAddIntegration = (): boolean => {
    if (isProUser && proUserData?.features.unlimited_integrations) return true;
    if (!userLimits) return false;
    return userLimits.integration_limit === -1 || integrationCount < userLimits.integration_limit;
  };

  const canUploadDocument = (): boolean => {
    if (isProUser && proUserData?.features.unlimited_documents) return true;
    if (!userLimits) return false;
    return userLimits.document_limit === -1 || documentCount < userLimits.document_limit;
  };

  useEffect(() => {
    if (user && session) {
      checkSubscription();
      checkMessageLimit();
      refreshUsage();
      checkProUserStatus();
      getUserLimits();
      getUsageCounts();
    } else {
      // Reset all state when user logs out
      setSubscribed(false);
      setSubscriptionTier(null);
      setSubscriptionEnd(null);
      setMessageCount(0);
      setMessageLimit(100);
      setMessagesRemaining(100);
      setIsLimitReached(false);
      setAppsumoAccess(false);
      setIsProUser(false);
      setProUserData(null);
      setUserLimits(null);
      setAgentCount(0);
      setIntegrationCount(0);
      setDocumentCount(0);
      setLoading(false);
    }
  }, [user, session]);

  return (
    <SubscriptionContext.Provider value={{
      // Legacy fields for backward compatibility
      subscribed,
      subscriptionTier,
      subscriptionEnd,
      messageCount,
      messageLimit,
      messagesRemaining,
      isLimitReached,
      appsumoAccess,
      loading,
      
      // New pro user fields
      isProUser,
      proUserData,
      userLimits,
      agentCount,
      integrationCount,
      documentCount,
      
      // Functions
      checkSubscription,
      checkMessageLimit,
      checkProUserStatus,
      getUserLimits,
      createCheckout,
      openCustomerPortal,
      redeemAppsumoCode,
      refreshUsage,
      upgradeToPro,
      downgradeFromPro,
      canCreateAgent,
      canSendMessage,
      canAddIntegration,
      canUploadDocument,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used within <SubscriptionProvider>");
  return ctx;
};
