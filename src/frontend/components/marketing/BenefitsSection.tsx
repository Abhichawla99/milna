
import React from "react";
import { motion } from "framer-motion";
import { BentoCard, BentoGrid } from "../ui/bento-grid";
import { 
  MessageSquare, 
  Clock, 
  Users, 
  BarChart3, 
  Zap, 
  TrendingUp 
} from "lucide-react";

const features = [
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
    Icon: BarChart3,
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

const BenefitsSection = () => {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-white py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-8 flex items-center gap-3"
        >
          <div className="h-6 w-6 rounded-full bg-[#C79FFF]" />
          <span className="font-medium tracking-wide text-[#3E2D1F]">
            Powerful Features
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-extrabold tracking-tight text-[#3E2D1F] mb-3">
            Everything you need to transform visitors into customers
          </h2>
          <p className="text-lg text-[#6B4A8F]/80 max-w-2xl">
            Turn your website traffic into booked demos and captured leads with intelligent AI conversations
          </p>
        </motion.div>

        <BentoGrid className="lg:grid-rows-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <BentoCard {...feature} />
            </motion.div>
          ))}
        </BentoGrid>
      </div>

      <style jsx>{`
        .grainy-pastel {
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 20px 20px, 15px 15px;
          background-position: 0 0, 10px 10px;
        }
      `}</style>
    </section>
  );
};

export default BenefitsSection;
