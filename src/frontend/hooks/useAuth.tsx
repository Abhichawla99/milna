
import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { generateUniqueAgentId } from "@/frontend/utils/agentIdGenerator";
import WelcomeAgentModal from "@/frontend/components/onboarding/WelcomeAgentModal";
import type { User, Session } from "@supabase/supabase-js";

type AuthUser = User | null;

type AuthContextType = {
  user: AuthUser;
  session: Session | null;
  loading: boolean;
  login: (opts: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  signup: (opts: { email: string; password: string; name: string; company: string; website?: string; hasPermission?: boolean }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<AuthUser>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const agentCreationAttempted = useRef<Set<string>>(new Set());
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [welcomeAgentData, setWelcomeAgentData] = useState<{agentName: string, companyName: string} | null>(null);

  // Function to fetch fresh user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching fresh user profile for:', userId);
      
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return null;
      }

      console.log('Fresh user profile fetched:', profile);
      return profile;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Function to ensure user profile exists
  const ensureUserProfile = async (userId: string, email: string, userMetadata: any) => {
    try {
      console.log('Ensuring user profile exists for:', userId);
      
      // Check if profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking user profile:', checkError);
        return null;
      }

      if (existingProfile) {
        console.log('User profile already exists');
        return existingProfile.id;
      }

      // Create user profile if it doesn't exist
      const { data: newProfile, error: createError } = await supabase
        .from("user_profiles")
        .insert({
          user_id: userId,
          name: userMetadata?.name || 'User',
          work_email: email,
          company_name: userMetadata?.company || 'My Company',
          website: userMetadata?.website || '',
          has_permission: userMetadata?.hasPermission || false
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating user profile:', createError);
        return null;
      }

      console.log('Successfully created user profile:', newProfile);
      return newProfile.id;
    } catch (error) {
      console.error('Error in ensureUserProfile:', error);
      return null;
    }
  };

  // Function to create first agent for user (user-scoped and idempotent)
  const createFirstAgent = async (
    userId: string
  ): Promise<{ agentId: string; created: boolean } | null> => {
    // Prevent multiple attempts for the same user
    if (agentCreationAttempted.current.has(userId)) {
      console.log('Agent creation already attempted for user:', userId);
      return null;
    }
    agentCreationAttempted.current.add(userId);

    try {
      console.log('Creating first agent for user:', userId);
      
      // Check if THIS USER already has agents (user-scoped check)
      const { data: existingAgents, error: checkError } = await supabase
        .from("agents")
        .select("id")
        .eq("user_id", userId)
        .limit(1);

      if (checkError) {
        console.error('Error checking existing agents:', checkError);
        return null;
      }

      if (existingAgents && existingAgents.length > 0) {
        console.log('User already has agents, skipping creation');
        return { agentId: existingAgents[0].id as unknown as string, created: false };
      }

      // Fetch fresh user profile data to get the company name
      const userProfile = await fetchUserProfile(userId);
      if (!userProfile) {
        console.error('Cannot create agent: user profile not found');
        return null;
      }

      // Use company name from fresh profile data
      const companyName = userProfile.company_name || 'My Company';
      console.log('Using company name from profile:', companyName);

      // Generate consistent agent slug based on user ID
      const agentSlug = `agent_${userId.replace(/-/g, '_')}`;
      const embedCode = `<iframe src="${window.location.origin}/agent/${agentSlug}" width="100%" height="600" frameborder="0"></iframe>`;
      
      const { data: newAgent, error: createError } = await supabase
        .from("agents")
        .insert({
          user_id: userId,
          agent_id: agentSlug,
          name: `${companyName} AI Agent`,
          status: "active",
          embed_code: embedCode,
          goal: "Help customers find information and answer questions about our products and services",
          tone: "friendly",
          instructions: `You are a helpful AI assistant for ${companyName}. Be professional, friendly, and provide accurate information about our company and services.`,
          integrations: {},
          api_keys: {},
          analytics_data: {}
        })
        .select("id")
        .single();

      if (createError) {
        console.error('Error creating first agent:', createError);
        return null;
      }

      console.log('Successfully created first agent with UUID:', newAgent?.id);
      return { agentId: (newAgent as { id: string }).id, created: true };
    } catch (error) {
      console.error('Error in createFirstAgent:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    // SYNCHRONOUS handler to prevent auth deadlocks
    const handleAuthChange = (event: string, session: Session | null) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (!mounted) return;
      
      // Always update state synchronously
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false); // Always clear loading
      
      // Defer async operations to prevent deadlock
      setTimeout(() => {
        if (!mounted) return;
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in, ensuring profile and agent exist');
          
          // Ensure user profile exists first, then create agent (deferred)
          ensureUserProfile(session.user.id, session.user.email!, session.user.user_metadata)
            .then(async () => {
              // Always pass only userId to createFirstAgent - it will fetch fresh profile data
              const result = await createFirstAgent(session.user!.id);
              // Send first-time signup webhook ONLY if agent was just created
              if (result?.created) {
                console.log('Invoking signup-webhook with real agents.id (UUID):', result.agentId);
                
                // Fetch fresh profile data for webhook and welcome modal
                const freshProfile = await fetchUserProfile(session.user!.id);
                
                // Show welcome modal for new agent
                setWelcomeAgentData({
                  agentName: `${freshProfile?.company_name || 'My Company'} AI Agent`,
                  companyName: freshProfile?.company_name || 'My Company'
                });
                setShowWelcomeModal(true);
                
                const webhookData = {
                  user_id: session.user!.id,
                  name: freshProfile?.name || session.user!.user_metadata?.name || 'User',
                  email: session.user!.email!,
                  company: freshProfile?.company_name || session.user!.user_metadata?.company || 'My Company',
                  website: freshProfile?.website || session.user!.user_metadata?.website || '',
                  hasPermission: freshProfile?.has_permission || session.user!.user_metadata?.hasPermission || false,
                  agent_id: result.agentId, // UUID from agents.id
                };
                
                console.log('Webhook data with fresh profile:', webhookData);
                await supabase.functions.invoke('signup-webhook', {
                  body: webhookData,
                });
              }
            });

          navigate("/dashboard");
        } else if (event === 'SIGNED_OUT') {
          navigate("/");
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed');
        } else if (event === 'USER_UPDATED') {
          console.log('User updated');
        }
      }, 0);
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Check for existing session - force fresh session retrieval
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
      }
      console.log('Initial session check:', session?.user?.email);
      
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false); // Always clear loading
        
        // If user is already signed in, ensure they have a profile and agent (deferred)
        if (session?.user) {
          setTimeout(() => {
            ensureUserProfile(session.user!.id, session.user!.email!, session.user!.user_metadata)
              .then(async () => {
                // Always pass only userId to createFirstAgent - it will fetch fresh profile data
                const result = await createFirstAgent(session.user!.id);
                // Send first-time signup webhook ONLY if agent was just created
                if (result?.created) {
                  console.log('Invoking signup-webhook with real agents.id (UUID):', result.agentId);
                  
                  // Fetch fresh profile data for webhook and welcome modal
                  const freshProfile = await fetchUserProfile(session.user!.id);
                  
                  // Show welcome modal for new agent
                  setWelcomeAgentData({
                    agentName: `${freshProfile?.company_name || 'My Company'} AI Agent`,
                    companyName: freshProfile?.company_name || 'My Company'
                  });
                  setShowWelcomeModal(true);
                  
                  const webhookData = {
                    user_id: session.user!.id,
                    name: freshProfile?.name || session.user!.user_metadata?.name || 'User',
                    email: session.user!.email!,
                    company: freshProfile?.company_name || session.user!.user_metadata?.company || 'My Company',
                    website: freshProfile?.website || session.user!.user_metadata?.website || '',
                    hasPermission: freshProfile?.has_permission || session.user!.user_metadata?.hasPermission || false,
                    agent_id: result.agentId, // UUID from agents.id
                  };
                  
                  console.log('Webhook data with fresh profile:', webhookData);
                  await supabase.functions.invoke('signup-webhook', {
                    body: webhookData,
                  });
                }
              });
          }, 100);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signup = async ({ email, password, name, company, website, hasPermission }: { 
    email: string; 
    password: string; 
    name: string; 
    company: string; 
    website?: string; 
    hasPermission?: boolean; 
  }) => {
    setLoading(true);
    try {
      const agentId = generateUniqueAgentId();
      const redirectUrl = window.location.origin;
      
      console.log('Attempting signup with redirect URL:', redirectUrl);
      console.log('Signup data - Company:', company, 'Name:', name);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            company,
            website: website || '',
            hasPermission: hasPermission || false,
            agent_id: agentId
          }
        }
      });
      
      if (error) {
        console.error('Signup error:', error);
        throw error;
      }
      
      console.log('Signup successful:', data);
      
      // If user is created and confirmed immediately, ensure profile exists
      if (data.user && data.user.email_confirmed_at) {
        console.log('User confirmed immediately, ensuring profile exists');
        await ensureUserProfile(data.user.id, data.user.email!, data.user.user_metadata);
      }

      if (data.user && !data.user.email_confirmed_at) {
        console.log('User created but email not confirmed yet');
      } else if (data.user && data.user.email_confirmed_at) {
        console.log('User created and confirmed');
      }
      
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }: { email: string; password: string }) => {
    setLoading(true);
    try {
      console.log('Attempting login for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error);
        throw error;
      }
      
      console.log('Login successful:', data);
      
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      agentCreationAttempted.current.clear(); // Reset agent creation tracking
      navigate("/");
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, logout, signup }}>
      {children}
      {welcomeAgentData && (
        <WelcomeAgentModal
          isOpen={showWelcomeModal}
          onClose={() => {
            setShowWelcomeModal(false);
            setWelcomeAgentData(null);
          }}
          agentName={welcomeAgentData.agentName}
          companyName={welcomeAgentData.companyName}
          onRefreshDashboard={() => {
            // Trigger a subtle refresh to show the new agent
            window.location.reload();
          }}
        />
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
};

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 via-purple-400 to-orange-400"><div className="text-white text-xl">Loading...</div></div>;
  if (!user) return <Navigate to="/" replace state={{ from: location }} />;
  
  return <>{children}</>;
};
