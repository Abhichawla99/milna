
import { useState } from "react";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/frontend/components/ui/form";
import { Input } from "@/frontend/components/ui/input";
import { X, Eye, EyeOff, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/frontend/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const passwordSchema = z.object({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordData = z.infer<typeof passwordSchema>;

interface UserData {
  name: string;
  company: string;
  website: string;
  hasPermission: boolean;
  agent_id: string;
}

interface PasswordSetupProps {
  email: string;
  userData: UserData;
  onSuccess: () => void;
  onClose: () => void;
}

const PasswordSetup = ({ email, userData, onSuccess, onClose }: PasswordSetupProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Function to ensure user profile is created
  const ensureUserProfile = async (userId: string, email: string, userData: UserData) => {
    try {
      console.log('Ensuring user profile exists for new user:', userId);
      
      const { data: profile, error } = await supabase
        .from("user_profiles")
        .insert({
          user_id: userId,
          name: userData.name,
          work_email: email,
          company_name: userData.company,
          website: userData.website,
          has_permission: userData.hasPermission
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating user profile:', error);
        return null;
      }

      console.log('Successfully created user profile:', profile);
      return profile;
    } catch (error) {
      console.error('Error in ensureUserProfile:', error);
      return null;
    }
  };

  const onSubmit = async (data: PasswordData) => {
    setIsSubmitting(true);
    console.log("Setting up password for:", email);

    try {
      // Create the user account with proper email redirect and metadata
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: userData.name,
            company: userData.company,
            website: userData.website,
            hasPermission: userData.hasPermission,
            agent_id: userData.agent_id,
          }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      if (authData.user) {
        console.log('User created successfully:', authData.user.id);
        console.log('User confirmation status:', authData.user.email_confirmed_at);
        
        // If user is immediately confirmed, create profile right away
        if (authData.user.email_confirmed_at) {
          console.log('User confirmed immediately, creating profile');
          await ensureUserProfile(authData.user.id, email, userData);
        }
        
        // Check if email confirmation is required
        if (!authData.user.email_confirmed_at) {
          toast({
            title: "Account Created Successfully! 🎉",
            description: "Please check your email to verify your account before signing in. Your profile and AI agent will be ready once verified!",
          });
        } else {
          // Email confirmation is disabled, user is immediately confirmed
          toast({
            title: "Account Created Successfully! 🎉",
            description: "Your account is ready and your profile and AI agent have been created automatically!",
          });
        }

        onSuccess();
      }
    } catch (error: any) {
      console.error('Error creating account:', error);
      
      // Handle specific error cases
      let errorMessage = "Failed to create account. Please try again.";
      
      if (error.message?.includes("User already registered")) {
        errorMessage = "An account with this email already exists. Please try signing in instead.";
      } else if (error.message?.includes("Password")) {
        errorMessage = "Password doesn't meet requirements. Please try a stronger password.";
      } else if (error.message?.includes("Invalid email")) {
        errorMessage = "Please enter a valid email address.";
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Set Your Password</CardTitle>
          <CardDescription className="text-center">
            Create a secure password for your account
            <br />
            <span className="text-sm font-medium mt-2 block">Agent ID: {userData.agent_id}</span>
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password *</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="text-sm text-muted-foreground">
                <p className="mb-2">Password requirements:</p>
                <ul className="space-y-1 text-xs">
                  <li>• At least 8 characters long</li>
                  <li>• Contains uppercase and lowercase letters</li>
                  <li>• Contains at least one number</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordSetup;
