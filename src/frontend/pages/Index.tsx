
import { useState } from "react";
import { ArrowRight, BarChart3 } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/frontend/components/ui/dialog";
import { useToast } from "@/frontend/hooks/use-toast";
import HeroSection from "@/frontend/components/marketing/HeroSection";
import ShowcaseCards from "@/frontend/components/marketing/ShowcaseCards";
import HowItConverts from "@/frontend/components/marketing/HowItConverts";
import MidPageCTA from "@/frontend/components/marketing/MidPageCTA";
import PricingPreview from "@/frontend/components/marketing/PricingPreview";
import TestimonialsSection from "@/frontend/components/marketing/TestimonialsSection";
import Footer from "@/frontend/components/layout/Footer";
import { LoginForm } from "@/frontend/components/forms/LoginForm";
import { SignupForm } from "@/frontend/components/forms/SignupForm";
import { useAuth } from "@/frontend/hooks/useAuth";
import { useSubscription } from "@/frontend/hooks/useSubscription";
import { Link } from "react-router-dom";


const Index = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isPricingSignup, setIsPricingSignup] = useState(false);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const { createCheckout } = useSubscription();

  console.log('Index page - user:', user, 'loading:', loading);

  const handleGetStartedClick = () => {
    setIsPricingSignup(false);
    setIsSignupOpen(true);
  };

  const handlePricingGetStartedClick = () => {
    setIsPricingSignup(true);
    setIsSignupOpen(true);
  };

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Main Content */}
      <main className="bg-background">
        <HeroSection onGetStartedClick={handleGetStartedClick} onLoginClick={handleLoginClick} />
        <ShowcaseCards />
        <HowItConverts />
        <MidPageCTA onGetStartedClick={handleGetStartedClick} />
        <PricingPreview onGetStartedClick={handlePricingGetStartedClick} />
        <TestimonialsSection />
      </main>

      <Footer />

      {/* Login Dialog */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-[600px] bg-card border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Welcome Back</DialogTitle>
            <DialogDescription className="text-muted-foreground text-lg">
              Sign in to your Milna account to continue.
            </DialogDescription>
          </DialogHeader>
          <LoginForm onSuccess={() => setIsLoginOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Signup Dialog */}
      <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
        <DialogContent className="sm:max-w-[600px] bg-card border">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create Your Account</DialogTitle>
            <DialogDescription className="text-muted-foreground text-lg">
              Join thousands of businesses using AI agents to boost their sales.
            </DialogDescription>
          </DialogHeader>
          <SignupForm 
            onSuccess={() => setIsSignupOpen(false)} 
            isPricingFlow={isPricingSignup}
            onPricingSuccess={async () => {
              setIsSignupOpen(false);
              try {
                await createCheckout();
              } catch (error) {
                toast({
                  title: "Error",
                  description: "Failed to create checkout session",
                  variant: "destructive",
                });
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
