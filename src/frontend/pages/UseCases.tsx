
import { ShoppingCart, GraduationCap, Heart, Building, Headphones, Briefcase } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import Footer from "@/frontend/components/layout/Footer";
import { Link } from "react-router-dom";

const UseCases = () => {
  const useCases = [
    {
      icon: ShoppingCart,
      title: "E-commerce Support",
      description: "Help customers find products, answer questions, and guide them through the purchase process.",
      features: ["Product recommendations", "Order tracking", "Return assistance", "Payment help"],
      example: "Increase sales by 35% with 24/7 shopping assistance"
    },
    {
      icon: GraduationCap,
      title: "Educational Platforms",
      description: "Provide instant learning support, answer student questions, and guide through courses.",
      features: ["Course guidance", "Assignment help", "Study resources", "Progress tracking"],
      example: "Improve student engagement by 50% with AI tutoring"
    },
    {
      icon: Heart,
      title: "Healthcare Services",
      description: "Assist with appointment scheduling, provide health information, and support patient care.",
      features: ["Appointment booking", "Symptom checker", "Health resources", "Care reminders"],
      example: "Reduce call volume by 40% with automated assistance"
    },
    {
      icon: Building,
      title: "Real Estate",
      description: "Help visitors find properties, schedule viewings, and get market information.",
      features: ["Property search", "Viewing scheduler", "Market insights", "Mortgage guidance"],
      example: "Generate 60% more qualified leads with AI assistance"
    },
    {
      icon: Headphones,
      title: "Customer Service",
      description: "Handle common inquiries, escalate complex issues, and provide 24/7 support.",
      features: ["FAQ responses", "Ticket creation", "Issue escalation", "Status updates"],
      example: "Resolve 80% of inquiries instantly without human intervention"
    },
    {
      icon: Briefcase,
      title: "Professional Services",
      description: "Qualify leads, schedule consultations, and provide service information.",
      features: ["Lead qualification", "Consultation booking", "Service details", "Pricing info"],
      example: "Book 3x more consultations with automated scheduling"
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
            Use Cases
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            AI Solutions for Every Industry
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover how businesses across different industries are using Milna to enhance customer experience.
          </p>
        </div>
      </section>

      {/* Use Cases Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <useCase.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{useCase.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {useCase.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Key Features:</h4>
                    <ul className="space-y-1">
                      {useCase.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <Badge variant="outline" className="text-xs">
                      {useCase.example}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Success Stories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See how businesses like yours are achieving remarkable results with AI agents.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { stat: "85%", label: "Reduction in support tickets" },
              { stat: "3.2x", label: "Increase in lead conversion" },
              { stat: "24/7", label: "Customer support availability" }
            ].map((metric, index) => (
              <Card key={index} className="bg-card border-border text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">{metric.stat}</div>
                  <p className="text-muted-foreground">{metric.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Start Your Success Story</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already transforming their customer experience with AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Create Your Agent
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button size="lg" variant="outline">
                Learn How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UseCases;
