
import { Globe, MessageSquare, Calendar, ArrowRight, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Button } from "@/frontend/components/ui/button";
import { useState } from "react";

const steps = [
  {
    icon: Globe,
    title: "Learn Your Business",
    description: "Our AI automatically learns about your business by analyzing your website content. You can add or remove more information anytime.",
    details: "Simply connect your website and our AI will scan and understand your products, services, and brand voice within minutes."
  },
  {
    icon: MessageSquare,
    title: "AI Search/Chat",
    description: "Sales agent is created instantly that you can chat with within two minutes of getting started. Visitors get instant answers and personalized assistance through intelligent conversations.",
    details: "Your AI sales agent is ready to engage visitors with natural conversations, answer questions, and guide them through your sales funnel."
  },
  {
    icon: Calendar,
    title: "Book Meetings & Send Alerts",
    description: "Connect your calendars and qualified leads are automatically scheduled and you're notified via Slack or email.",
    details: "Seamlessly integrate with your existing tools and never miss a qualified lead with instant notifications and automated scheduling."
  }
];

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <section className="section-padding bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your website into an AI-powered sales machine
          </p>
        </div>

        {/* Steps Container */}
        <div className="max-w-7xl mx-auto">
          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between mb-12">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                {/* Step Indicator */}
                <div className="relative">
                  <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl font-bold transition-all duration-300 ${
                    activeStep === index 
                      ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25' 
                      : 'border-muted-foreground/30 bg-background text-muted-foreground hover:border-primary/50'
                  }`}>
                    {index + 1}
                  </div>
                </div>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-8">
                    <div className="h-1 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30 rounded-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Cards Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card 
                key={index} 
                className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                  activeStep === index ? 'ring-2 ring-primary shadow-xl shadow-primary/10' : ''
                }`}
                onMouseEnter={() => setActiveStep(index)}
                onMouseLeave={() => setActiveStep(null)}
              >
                <CardHeader className="text-center pb-4">
                  {/* Mobile Step Indicator */}
                  <div className="lg:hidden w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-primary font-bold text-lg">{index + 1}</span>
                  </div>
                  
                  {/* Icon */}
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    activeStep === index 
                      ? 'bg-primary text-primary-foreground shadow-lg scale-110' 
                      : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                  }`}>
                    <step.icon className="w-10 h-10" />
                  </div>
                  
                  <CardTitle className="text-2xl font-bold mb-2">{step.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="text-center">
                  <CardDescription className="text-base leading-relaxed mb-6">
                    {step.description}
                  </CardDescription>
                  
                  {/* Expandable Details */}
                  <div className={`transition-all duration-300 overflow-hidden ${
                    activeStep === index ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
                      <p className="text-sm text-muted-foreground italic">
                        {step.details}
                      </p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`mt-4 transition-all duration-300 ${
                      activeStep === index 
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                        : 'hover:bg-primary/10'
                    }`}
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Success Indicator */}
          <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-secondary/10 border border-secondary/20 rounded-full">
              <Check className="w-5 h-5 text-secondary" />
              <span className="text-secondary font-medium">Complete setup in under 5 minutes</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
    </section>
  );
};

export default HowItWorksSection;
