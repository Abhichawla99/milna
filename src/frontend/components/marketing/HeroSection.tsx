import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, TrendingUp, Users, MessageSquare } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { MilnaChatBar } from "@/frontend/components/MilnaChatBar";

interface HeroSectionProps {
  onGetStartedClick: () => void;
  onLoginClick: () => void;
}

const HeroSection = ({ onGetStartedClick, onLoginClick }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen w-full flex flex-col justify-center px-4 bg-stone-50">
      {/* Background Image - Full Screen */}
      <div className="absolute inset-0 z-0">
        {/* Background image - full screen */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/arth-artwork-background.png')`,
            filter: 'brightness(0.9) contrast(1.1)',
            zIndex: 1,
          }}
        />
        
        {/* Fallback gradient background if image doesn't load */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #f59e0b 50%, #dc2626 100%)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            zIndex: 0,
          }}
        />
        
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-black/15 z-10" />
      </div>

      {/* All Content - Full Screen */}
      <div className="relative z-20 h-full flex flex-col justify-between">
        {/* Top Navigation */}
        <div className="pt-8">
          <div className="container mx-auto flex justify-between items-center">
            {/* Logo/Brand */}
            <div className="text-white font-bold text-xl">Milna</div>
            
            {/* Navigation */}
            <div className="flex items-center gap-6">
              <button 
                onClick={() => {
                  const missionSection = document.getElementById('mission');
                  if (missionSection) {
                    missionSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-white/90 hover:text-white transition-colors font-medium cursor-pointer"
              >
                Our Mission
              </button>
              <button 
                onClick={onLoginClick}
                className="text-white/90 hover:text-white transition-colors font-medium cursor-pointer"
              >
                Log In
              </button>
              <Button
                onClick={onGetStartedClick}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-2 rounded-lg transition-all font-medium shadow-lg"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content - Centered */}
        <div className="flex-1 flex items-center justify-center">
          <div className="container mx-auto text-center max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Hero Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-3 mb-8"
              >
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-medium">AI-Powered Lead Generation</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight tracking-tight"
              >
                Turn visitors into
                <span className="block text-blue-300 mt-2">booked calls, </span>
                <span className="block text-white">automatically.</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed"
              >
                Milna engages your traffic, books demos, and captures leads so you never lose revenue again. 24/7 AI that converts visitors into customers.
              </motion.p>

              {/* Search Bar - Moved Above CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="mb-12"
              >
                <div className="container mx-auto max-w-4xl">
                  <MilnaChatBar />
                </div>
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-4"
              >
                <Button
                  onClick={onGetStartedClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-4 h-auto font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 group rounded-xl"
                  data-event="hero-cta-click"
                >
                  Start Building Your Agent
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button
                  variant="outline"
                  className="border-2 border-white/40 text-white hover:bg-white/20 text-lg px-8 py-4 h-auto font-medium backdrop-blur-sm bg-white/10 rounded-xl shadow-lg"
                  data-event="hero-demo-click"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </motion.div>

              {/* Quick Setup Text */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
                className="text-white/80 text-lg mb-12 font-medium"
              >
                No credit card required • Setup in 3 minutes
              </motion.p>

              {/* Social Proof */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="flex flex-col md:flex-row items-center justify-center gap-8 text-white/80"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-yellow-400" />
                  <span>10,000+ SaaS teams</span>
                </div>
                <div className="hidden md:block w-1 h-1 bg-white/60 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-yellow-400" />
                  <span>1M+ conversations</span>
                </div>
                <div className="hidden md:block w-1 h-1 bg-white/60 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-yellow-400" />
                  <span>300% more demos booked</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
