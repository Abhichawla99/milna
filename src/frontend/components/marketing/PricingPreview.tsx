import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Star, Zap } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { SplashCursor } from "../ui/SplashCursor";

interface PricingPreviewProps {
  onGetStartedClick: () => void;
}

const PricingPreview = ({ onGetStartedClick }: PricingPreviewProps) => {
  const [isAnnual, setIsAnnual] = useState(true);

  const monthlyPlans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for trying out Milna",
      features: [
        "1 AI Agent",
        "100 messages/month",
        "Basic integrations",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Pro",
      price: "$199",
      period: "/month",
      description: "For growing businesses",
      features: [
        "Unlimited AI Agents",
        "Unlimited messages",
        "Advanced integrations",
        "Priority support",
        "Custom branding",
        "Analytics dashboard"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantee",
        "On-premise options",
        "Team management"
      ],
      popular: false
    }
  ];

  const annualPlans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for trying out Milna",
      features: [
        "1 AI Agent",
        "100 messages/month",
        "Basic integrations",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Pro Annual",
      price: "$956",
      period: "/year",
      originalPrice: "$2,388",
      description: "Save 60% with annual billing. Limited time offer!",
      features: [
        "Unlimited AI Agents",
        "Unlimited messages",
        "Advanced integrations",
        "Priority support",
        "Custom branding",
        "Analytics dashboard"
      ],
      popular: true,
      discount: "60% OFF"
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Everything in Pro",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantee",
        "On-premise options",
        "Team management"
      ],
      popular: false
    }
  ];

  const plans = isAnnual ? annualPlans : monthlyPlans;

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-var(--cream) relative overflow-hidden">
      <SplashCursor 
        SIM_RESOLUTION={32}
        DYE_RESOLUTION={256}
        DENSITY_DISSIPATION={1.5}
        VELOCITY_DISSIPATION={1.0}
        PRESSURE={0.05}
        PRESSURE_ITERATIONS={8}
        CURL={1}
        SPLAT_RADIUS={0.1}
        SPLAT_FORCE={2000}
        SHADING={false}
        COLOR_UPDATE_SPEED={4}
        BACK_COLOR={{ r: 0.08, g: 0.08, b: 0.15 }}
        TRANSPARENT={true}
      />
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-var(--ink) mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-var(--ink-muted) max-w-2xl mx-auto mb-8">
            Start free and scale as you grow. No hidden fees, no surprises.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-lg font-medium ${!isAnnual ? 'text-var(--ink)' : 'text-var(--ink-muted)'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-primary' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-12' : 'translate-x-1'
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-medium ${isAnnual ? 'text-var(--ink)' : 'text-var(--ink-muted)'}`}>
                Annual
              </span>
              {isAnnual && (
                <div className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                  <Zap className="w-3 h-3" />
                  Save 60%
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl p-8 shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                plan.popular 
                  ? 'border-primary shadow-glow-warm' 
                  : 'border-gray-200'
              }`}
            >
              {(plan.popular || plan.discount) && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    {plan.discount ? <Zap className="h-3 w-3" /> : <Star className="h-3 w-3 fill-current" />}
                    {plan.discount || "Most Popular"}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-var(--ink) mb-2">
                  {plan.name}
                </h3>
                <div className="mb-2">
                  {plan.originalPrice && (
                    <span className="text-lg text-var(--ink-muted) line-through mr-2">
                      {plan.originalPrice}
                    </span>
                  )}
                  <span className="text-3xl font-bold text-var(--ink)">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-var(--ink-muted) ml-1">
                      {plan.period}
                    </span>
                  )}
                </div>
                <p className="text-var(--ink-muted) text-sm">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-var(--ink) text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={onGetStartedClick}
                className={`w-full py-3 font-semibold ${
                  plan.popular
                    ? 'btn-primary text-white shadow-glow-warm'
                    : 'btn-secondary text-var(--ink) border-2 border-var(--ink) hover:bg-var(--ink) hover:text-white'
                }`}
                data-event={`pricing-${plan.name.toLowerCase()}-click`}
              >
                {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPreview;
