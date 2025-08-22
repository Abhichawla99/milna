
import { Check, X } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/frontend/components/ui/card";
import { Badge } from "@/frontend/components/ui/badge";
import Footer from "@/frontend/components/layout/Footer";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out our AI agent platform",
      features: [
        "1 AI Agent",
        "Basic customization",
        "Standard support",
        "Up to 100 conversations/month",
        "Basic analytics"
      ],
      limitations: [
        "No integrations",
        "Limited customization",
        "Basic support only"
      ],
      popular: false,
      cta: "Get Started Free"
    },
    {
      name: "Pro",
      price: "$199",
      period: "per month",
      description: "Best for businesses ready to scale with AI",
      features: [
        "Unlimited AI Agents",
        "Advanced customization",
        "Priority support",
        "Unlimited conversations",
        "Advanced analytics",
        "All integrations",
        "Team collaboration",
        "Custom branding",
        "API access",
        "White-label solution"
      ],
      limitations: [],
      popular: true,
      cta: "Start Pro Trial"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "Tailored solutions for large organizations",
      features: [
        "Everything in Pro",
        "Dedicated account manager",
        "Custom integrations",
        "SLA guarantees",
        "On-premise deployment",
        "Advanced security",
        "Custom training",
        "24/7 phone support"
      ],
      limitations: [],
      popular: false,
      cta: "Contact Sales"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
              <img src="/milna-symbol.png" alt="Milna" className="h-8 w-8" />
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
            Pricing Plans
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Choose the perfect plan for your business. Start free and scale as you grow.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'} bg-card`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold text-foreground">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <CardDescription className="mt-4 text-muted-foreground">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className={`w-full mb-6 ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`} variant={plan.popular ? "default" : "outline"}>
                    {plan.cta}
                  </Button>
                  
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, limitIndex) => (
                      <div key={limitIndex} className="flex items-center">
                        <X className="h-4 w-4 text-muted-foreground mr-3 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{limitation}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-foreground">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about our pricing</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "Can I change my plan anytime?",
                answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                question: "Is there a free trial for Pro?",
                answer: "Yes, we offer a 14-day free trial for the Pro plan with no credit card required."
              },
              {
                question: "What happens to my agents if I downgrade?",
                answer: "Your agents will remain active, but you'll be limited to the features of your new plan."
              }
            ].map((faq, index) => (
              <Card key={index} className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg text-foreground">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Pricing;
