
import { Play, ArrowRight } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";

const DemoSection = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-muted/30 to-background relative overflow-hidden">
      {/* Geometric background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 right-20 w-20 h-20 bg-floral-orange/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-16 w-32 h-32 bg-floral-green/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-floral-yellow rounded-full animate-bounce"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Folks-inspired header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-8">
            <h2 className="text-5xl md:text-7xl font-bold leading-tight mb-4">
              SearchFlow
              <div className="relative inline-block ml-4">
                <span className="text-muted-foreground">simplifies</span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-floral-yellow rounded-full"></div>
              </div>
            </h2>
            <h3 className="text-4xl md:text-6xl font-bold text-foreground">
              your daily life
            </h3>
          </div>
          
          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-card border border-border rounded-full px-6 py-3 font-medium text-sm hover:bg-muted/50 transition-colors">
              ⭐ Automate visitor engagement
            </div>
            <div className="bg-card border border-border rounded-full px-6 py-3 font-medium text-sm hover:bg-muted/50 transition-colors">
              🎯 Qualify leads instantly
            </div>
            <div className="bg-card border border-border rounded-full px-6 py-3 font-medium text-sm hover:bg-muted/50 transition-colors">
              📅 Book meetings automatically
            </div>
            <div className="bg-card border border-border rounded-full px-6 py-3 font-medium text-sm hover:bg-muted/50 transition-colors">
              💬 Answer questions 24/7
            </div>
          </div>
        </div>

        {/* Demo Section with Folks-inspired layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
          {/* Left side - Video Demo */}
          <div className="relative">
            <div className="bg-gradient-to-br from-floral-yellow to-floral-orange rounded-3xl p-8 shadow-2xl">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-black/80 rounded-full"></div>
              <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-floral-pink rounded-2xl rotate-45"></div>
              
              {/* Video placeholder */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-floral-yellow/90 rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-floral-yellow transition-colors cursor-pointer shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200">
                      <Play className="w-8 h-8 text-black ml-1" />
                    </div>
                    <p className="text-lg font-semibold text-foreground">
                      Watch SearchFlow in Action
                    </p>
                    <p className="text-sm text-muted-foreground">
                      2 min demo showing AI booking a meeting
                    </p>
                  </div>
                  
                  {/* Browser window decoration */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Core feature */}
          <div className="space-y-8">
            <div className="inline-block">
              <div className="bg-floral-yellow text-black text-sm font-bold px-4 py-2 rounded-full mb-4">
                ⭐ Core AI
              </div>
              <h3 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Access visitor
                <br />
                <span className="text-muted-foreground">information at all times</span>
              </h3>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              AI conversations automatically capture visitor intent and preferences. 
              You can track engagement patterns, identify hot leads, and get detailed 
              insights about what your prospects are really looking for.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-floral-green/10 rounded-2xl border border-floral-green/20">
                <div className="w-6 h-6 bg-floral-green rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <div className="font-semibold text-foreground">Real-time Lead Scoring</div>
                  <div className="text-sm text-muted-foreground">Automatically qualify leads based on conversation patterns</div>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-floral-yellow/10 rounded-2xl border border-floral-yellow/20">
                <div className="w-6 h-6 bg-floral-yellow rounded-full flex items-center justify-center text-black text-sm font-bold flex-shrink-0 mt-0.5">
                  ⚡
                </div>
                <div>
                  <div className="font-semibold text-foreground">Instant Notifications</div>
                  <div className="text-sm text-muted-foreground">Get alerted in Slack when high-value prospects engage</div>
                </div>
              </div>
            </div>

            <Button size="lg" className="bg-floral-yellow text-black hover:bg-floral-yellow/90 font-semibold px-8 py-6 rounded-2xl group">
              Try It Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoSection;
