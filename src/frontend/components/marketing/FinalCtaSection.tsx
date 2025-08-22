
import { Button } from "@/frontend/components/ui/button";
import { ArrowRight, Sparkles, Star } from "lucide-react";

const FinalCtaSection = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-black to-gray-900 relative overflow-hidden text-white">
      {/* Geometric Decorations inspired by Folks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large background shapes */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-floral-yellow/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-20 w-40 h-40 bg-floral-green/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-floral-pink/20 rounded-2xl rotate-45 blur-2xl"></div>
        
        {/* Small accent elements */}
        <div className="absolute top-40 right-10 w-6 h-6 bg-floral-orange rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 left-16 w-4 h-4 bg-floral-yellow rounded-full animate-bounce"></div>
        <div className="absolute top-32 left-1/3 w-3 h-3 bg-floral-green rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header with decorative elements */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-4 mb-8">
              <div className="bg-floral-yellow/20 backdrop-blur-sm rounded-full px-6 py-3 border border-floral-yellow/30">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-floral-yellow" />
                  <span className="text-sm font-medium text-floral-yellow">Ready to Book More Demos?</span>
                </div>
              </div>
              <div className="hidden md:block text-white/60 text-sm">
                ( Join 10,000+ SaaS teams using Milna )
              </div>
            </div>

            <h2 className="text-5xl md:text-8xl font-bold mb-8 leading-tight">
              Stop losing
              <span className="relative">
                <span className="text-floral-yellow">leads</span>
                <div className="absolute -top-3 -right-4 bg-floral-pink text-white text-sm px-3 py-1 rounded-full rotate-12 font-medium flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Secure
                </div>
              </span>
              <br />
              <span className="text-white/80">to missed conversations</span>
            </h2>
          </div>
          
          <p className="text-xl md:text-2xl text-white/80 mb-16 max-w-3xl mx-auto leading-relaxed">
            Turn visitors into booked meetings — without lifting a finger. 
            Join thousands of SaaS teams using Milna to automate their lead generation.
          </p>

          {/* CTA Buttons with enhanced styling */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Button size="lg" className="bg-floral-yellow text-black hover:bg-floral-yellow/90 text-xl px-16 py-8 rounded-3xl group font-bold shadow-2xl hover:shadow-floral-yellow/25 hover:scale-105 transition-all duration-300">
              Book More Calls Today
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="text-xl px-16 py-8 rounded-3xl border-2 border-white/30 text-white hover:bg-white hover:text-black font-bold hover:scale-105 transition-all duration-300">
              Watch 2-Min Demo
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-floral-yellow mb-2">10,000+</div>
              <div className="text-white/70 font-medium">SaaS teams using Milna</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-floral-green mb-2">24/7</div>
              <div className="text-white/70 font-medium">lead capture</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-floral-pink mb-2">300%</div>
              <div className="text-white/70 font-medium">more demos booked</div>
            </div>
          </div>

          {/* Small print */}
          <p className="text-sm text-white/60 font-medium">
            No credit card required • Setup in 3 minutes • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCtaSection;
