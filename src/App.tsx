
import React from "react";
import { Toaster } from "@/frontend/components/ui/toaster";
import { Toaster as Sonner } from "@/frontend/components/ui/sonner";
import { TooltipProvider } from "@/frontend/components/ui/tooltip";
// Removed react-query provider since it's not used and causing invalid hook call issues
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, RequireAuth } from "@/frontend/hooks/useAuth";
import { SubscriptionProvider } from "@/frontend/hooks/useSubscription";

import Index from "./frontend/pages/Index";
import UseCases from "./frontend/pages/UseCases";
import Pricing from "./frontend/pages/Pricing";
import Features from "./frontend/pages/Features";
import Blog from "./frontend/pages/Blog";
import BlogPost from "./frontend/pages/BlogPost";
import HelpCenter from "./frontend/pages/HelpCenter";
import Community from "./frontend/pages/Community";
import Status from "./frontend/pages/Status";
import PrivacyPolicy from "./frontend/pages/PrivacyPolicy";
import TermsOfService from "./frontend/pages/TermsOfService";
import HowItWorks from "./frontend/pages/HowItWorks";
import DesignInspiration from "./frontend/pages/DesignInspiration";
import NotFound from "./frontend/pages/NotFound";
import Dashboard from "./frontend/components/agent/Dashboard";
import EmbeddedAgentDemo from "./frontend/pages/EmbeddedAgentDemo";
import BentoDemoPage from "./frontend/pages/BentoDemo";

// const queryClient = new QueryClient();

const App = () => (
  // Removed <QueryClientProvider> wrapper
  <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <AuthProvider>
        <SubscriptionProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/use-cases" element={<UseCases />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/features" element={<Features />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/community" element={<Community />} />
            <Route path="/status" element={<Status />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/design-inspiration" element={<DesignInspiration />} />
            <Route path="/embedded-agent-demo" element={<EmbeddedAgentDemo />} />
            <Route path="/bento-demo" element={<BentoDemoPage />} />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </SubscriptionProvider>
      </AuthProvider>
    </BrowserRouter>
  </TooltipProvider>
);

export default App;

