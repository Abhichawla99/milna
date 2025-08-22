
import { Bot, Zap, Shield, BarChart, Palette, Globe, MessageSquare, Clock, Users } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { Badge } from "@/frontend/components/ui/badge";
import { BentoCard, BentoGrid } from "@/frontend/components/ui/bento-grid";
import Footer from "@/frontend/components/layout/Footer";
import { Link } from "react-router-dom";

const Features = () => {
  const bentoFeatures = [
    {
      Icon: MessageSquare,
      name: "AI-Powered Conversations",
      description: "Advanced natural language processing for human-like interactions with your customers.",
      href: "/features/conversations",
      cta: "Learn more",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-400 to-indigo-500 opacity-20 grainy-pastel" />
      ),
      className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
    },
    {
      Icon: Clock,
      name: "24/7 Availability",
      description: "Never miss a lead with round-the-clock engagement that works across all time zones.",
      href: "/features/availability",
      cta: "Learn more",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 opacity-20 grainy-pastel" />
      ),
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
    },
    {
      Icon: Users,
      name: "Lead Qualification",
      description: "Automatically qualify leads and book demos with intelligent conversation flows.",
      href: "/features/qualification",
      cta: "Learn more",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-amber-400 to-yellow-500 opacity-20 grainy-pastel" />
      ),
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: BarChart,
      name: "Advanced Analytics",
      description: "Detailed insights into customer interactions and agent performance metrics.",
      href: "/features/analytics",
      cta: "Learn more",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-pink-400 to-purple-500 opacity-20 grainy-pastel" />
      ),
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
      Icon: Zap,
      name: "Easy Integration",
      description: "Connect with your CRM, calendars, and workflows in under 5 minutes.",
      href: "/features/integration",
      cta: "Learn more",
      background: (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-indigo-400 to-purple-500 opacity-20 grainy-pastel" />
      ),
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
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
            Platform Features
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Everything You Need to Succeed
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Powerful features designed to help you create engaging AI experiences for your customers.
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* BentoGrid Features Section */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-4">
          <BentoGrid className="lg:grid-rows-3">
            {bentoFeatures.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using Milna to enhance their customer experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Free Trial
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .grainy-pastel {
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px, 15px 15px;
          background-position: 0 0, 10px 10px;
        }
      `}</style>
    </div>
  );
};

export default Features;
