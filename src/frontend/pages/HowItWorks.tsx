
import { ArrowRight, Code, Settings, Rocket } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import Footer from "@/frontend/components/layout/Footer";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  const steps = [
    {
      icon: Settings,
      title: "Create Your Agent",
      description: "Set up your AI agent in minutes with our intuitive interface. Customize the personality, tone, and knowledge base.",
      details: ["Choose agent personality", "Set conversation goals", "Upload knowledge documents", "Configure responses"]
    },
    {
      icon: Code,
      title: "Get Embed Code",
      description: "Copy the simple embed code generated for your agent. No technical knowledge required - it works anywhere.",
      details: ["One-line embed code", "Works on any website", "Mobile responsive", "Instant deployment"]
    },
    {
      icon: Rocket,
      title: "Launch & Monitor",
      description: "Embed the code on your website and watch your AI agent start helping customers immediately.",
              details: ["Real-time conversations", "Analytics interface", "Performance insights", "Continuous learning"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-2xl font-bold text-primary">
              Milna
            </Link>
            <Link to="/dashboard">
              <Button variant="outline">Home</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            How It Works
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Get Started in 3 Simple Steps
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            From setup to deployment, we've made it incredibly easy to add AI to your website.
          </p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col lg:flex-row items-center mb-16 last:mb-0">
                <div className="lg:w-1/2 mb-8 lg:mb-0">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mr-4">
                          <step.icon className="h-6 w-6 text-primary" />
                        </div>
                        <Badge variant="outline">Step {index + 1}</Badge>
                      </div>
                      <CardTitle className="text-2xl text-foreground">{step.title}</CardTitle>
                      <CardDescription className="text-muted-foreground text-lg">
                        {step.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-center text-muted-foreground">
                            <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="lg:w-1/2 flex justify-center">
                  <div className="w-64 h-64 bg-muted/50 rounded-lg flex items-center justify-center">
                    <step.icon className="h-16 w-16 text-primary/30" />
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center my-8">
                    <ArrowRight className="h-6 w-6 text-primary rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">See It in Action</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Watch how easy it is to create and deploy your first AI agent.
          </p>
          <div className="max-w-2xl mx-auto bg-card rounded-lg p-8 border border-border">
            <div className="aspect-video bg-muted/50 rounded-lg flex items-center justify-center mb-6">
              <Button variant="outline" size="lg">
                <Rocket className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              3-minute walkthrough showing the complete process
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Ready to Build Your Agent?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start creating your AI agent today. No credit card required.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
