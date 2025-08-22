import { cn } from "@/lib/utils";
import {
  Settings,
  Cloud,
  DollarSign,
  Zap,
  Heart,
  HelpCircle,
  ArrowRight,
  Terminal,
} from "lucide-react";
import { SplashCursor } from "../ui/SplashCursor";

export function FeaturesSectionWithHoverEffects() {
  const features = [
    {
      title: "AI-Powered Conversations",
      description:
        "Advanced natural language processing for human-like interactions with your customers.",
      icon: <Terminal className="w-6 h-6" />,
    },
    {
      title: "24/7 Availability",
      description:
        "Never miss a lead with round-the-clock engagement that works across all time zones.",
      icon: <Cloud className="w-6 h-6" />,
    },
    {
      title: "Lead Qualification",
      description:
        "Automatically qualify leads and book demos with intelligent conversation flows.",
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: "Advanced Analytics",
      description:
        "Detailed insights into customer interactions and agent performance metrics.",
      icon: <DollarSign className="w-6 h-6" />,
    },
    {
      title: "Easy Integration",
      description:
        "Connect with your CRM, calendars, and workflows in under 5 minutes.",
      icon: <ArrowRight className="w-6 h-6" />,
    },
    {
      title: "Smart Automation",
      description:
        "Automate repetitive tasks and focus on what matters most to your business.",
      icon: <HelpCircle className="w-6 h-6" />,
    },
    {
      title: "Enterprise Security",
      description:
        "Bank-level security with encryption and compliance standards for peace of mind.",
      icon: <Settings className="w-6 h-6" />,
    },
    {
      title: "Scale Effortlessly",
      description:
        "Handle unlimited conversations without increasing overhead or complexity.",
      icon: <Heart className="w-6 h-6" />,
    },
  ];
  
  return (
    <section className="py-20 px-4 bg-background relative overflow-hidden">
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
        BACK_COLOR={{ r: 0.1, g: 0.1, b: 0.2 }}
        TRANSPARENT={true}
      />
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-warm-earth mb-6">
            Powerful Features
          </h2>
          <p className="text-xl text-warm-stone max-w-2xl mx-auto">
            Everything you need to transform your website visitors into loyal customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <Feature key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800 cursor-pointer",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};

const ShowcaseCards = () => {
  return <FeaturesSectionWithHoverEffects />;
};

export default ShowcaseCards;
