import {
  MessageSquare,
  Clock,
  Users,
  BarChart3,
  Zap,
  TrendingUp,
} from "lucide-react";

import { BentoCard, BentoGrid } from "./bento-grid";

const features = [
  {
    Icon: MessageSquare,
    name: "AI Conversations",
    description: "Intelligent AI that engages visitors with personalized conversations and captures leads 24/7.",
    href: "/features/conversations",
    cta: "Learn more",
    background: (
      <img 
        src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&crop=center" 
        alt="AI Conversations"
        className="absolute -right-20 -top-20 opacity-60 w-80 h-80 object-cover rounded-full"
      />
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
      <img 
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center" 
        alt="24/7 Availability"
        className="absolute -right-20 -top-20 opacity-60 w-80 h-80 object-cover rounded-full"
      />
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
      <img 
        src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&crop=center" 
        alt="Lead Qualification"
        className="absolute -right-20 -top-20 opacity-60 w-80 h-80 object-cover rounded-full"
      />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: BarChart3,
    name: "Analytics Dashboard",
    description: "Track performance, monitor conversations, and optimize your conversion funnel.",
    href: "/features/analytics",
    cta: "Learn more",
    background: (
      <img 
        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop&crop=center" 
        alt="Analytics Dashboard"
        className="absolute -right-20 -top-20 opacity-60 w-80 h-80 object-cover rounded-full"
      />
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
      <img 
        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop&crop=center" 
        alt="Easy Integration"
        className="absolute -right-20 -top-20 opacity-60 w-80 h-80 object-cover rounded-full"
      />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
  },
];

function BentoDemo() {
  return (
    <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}

export { BentoDemo };
