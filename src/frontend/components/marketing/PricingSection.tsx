
import { Button } from "@/frontend/components/ui/button";
import { Check, Star, MessageSquare, Zap } from "lucide-react";
import ContactForm from "@/frontend/components/forms/ContactForm";
import { useState } from "react";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "Perfect for trying out Milna. No credit card required.",
    features: [
      "50 messages per month",
      "AI Search & Chat",
      "Basic analytics",
      "Email support",
      "Standard integrations"
    ],
    cta: "Try Milna Free",
    popular: false,
    badge: "Free Forever"
  },
  {
    name: "Pro",
    price: "$199", 
    period: "/month",
    description: "Chosen by most SaaS teams. Unlimited AI agents & analytics dashboard.",
    features: [
      "Unlimited messages",
      "Calendar integrations",
      "Slack integration",
      "Email alerts",
      "CRM integrations", 
      "Priority support",
      "Advanced analytics",
      "Lead tracking",
      "Common questions insights"
    ],
    cta: "Start Free Trial",
    popular: true,
    badge: "Most Popular"
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Custom integrations, SLA, and team management.",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "White-label solution",
      "Dedicated account manager",
      "Custom analytics",
      "SLA guarantee",
      "Volume discounts",
      "Custom features"
    ],
    cta: "Contact Sales",
    popular: false,
    isCustom: true
  }
];

const annualPlans = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "Perfect for trying out Milna. No credit card required.",
    features: [
      "50 messages per month",
      "AI Search & Chat",
      "Basic analytics",
      "Email support",
      "Standard integrations"
    ],
    cta: "Try Milna Free",
    popular: false,
    badge: "Free Forever"
  },
  {
    name: "Pro Annual",
    price: "$956",
    period: "/year",
    originalPrice: "$2,388",
    description: "Save 60% with annual billing. Limited time offer!",
    features: [
      "Unlimited messages",
      "Calendar integrations",
      "Slack integration",
      "Email alerts",
      "CRM integrations", 
      "Priority support",
      "Advanced analytics",
      "Lead tracking",
      "Common questions insights",
      "2 months FREE"
    ],
    cta: "Get 60% Off",
    popular: true,
    badge: "Best Value",
    discount: "60% OFF"
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Custom integrations, SLA, and team management.",
    features: [
      "Everything in Pro",
      "Custom integrations",
      "White-label solution",
      "Dedicated account manager",
      "Custom analytics",
      "SLA guarantee",
      "Volume discounts",
      "Custom features"
    ],
    cta: "Contact Sales",
    popular: false,
    isCustom: true
  }
];

const PricingSection = () => {
  const [showContactForm, setShowContactForm] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);

  const handlePlanSelect = (plan: typeof plans[0]) => {
    if (plan.isCustom) {
      setShowContactForm(true);
    } else {
      // Handle other plan selections
      console.log(`Selected plan: ${plan.name}`);
    }
  };

  const currentPlans = isAnnual ? annualPlans : plans;

  return (
    <section className="section-padding bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-lg font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors ${
                isAnnual ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-8 w-8 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-12' : 'translate-x-1'
                }`}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
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
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {currentPlans.map((plan, index) => (
            <div key={index} className={`pricing-card ${plan.popular ? 'featured' : ''}`}>
              {(plan.popular || plan.badge) && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    {plan.popular && <Star className="w-3 h-3" />}
                    {plan.badge}
                  </div>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground mb-4">{plan.description}</p>
                <div className="flex items-end justify-center gap-1 mb-6">
                  {plan.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through mr-2">
                      {plan.originalPrice}
                    </span>
                  )}
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground mb-1">{plan.period}</span>
                </div>
                {plan.discount && (
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {plan.discount}
                    </div>
                  </div>
                )}
                
                <Button 
                  className={plan.popular ? "btn-primary w-full" : "btn-outline w-full"}
                  size="lg"
                  onClick={() => handlePlanSelect(plan)}
                >
                  {plan.cta}
                </Button>
              </div>

              <ul className="space-y-4">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-secondary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Special message section */}
        <div className="text-center mt-12">
          <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl mx-auto">
            <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Start Converting Visitors Today</h3>
            <p className="text-muted-foreground">
              Try our AI sales agent risk-free. No credit card required. Upgrade anytime when you're ready to scale your lead generation.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <ContactForm onClose={() => setShowContactForm(false)} />
      )}
    </section>
  );
};

export default PricingSection;
