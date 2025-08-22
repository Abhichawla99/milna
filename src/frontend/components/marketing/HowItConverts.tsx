import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Calendar, Mail, TrendingUp, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { SplashCursor } from "../ui/SplashCursor";

const HowItConverts = () => {
  const steps = [
        {
    icon: MessageCircle,
    title: "Engage",
    description: "Start conversations with visitors instantly. AI responds to every question, objection, and interest signal in real-time.",
    colors: [[255, 218, 185], [255, 182, 193]], // #ffdab9 to #ffb6c1 - soft peach to light pink
    animationSpeed: 3,
  },
  {
    icon: Mail,
    title: "Capture Email",
    description: "Grow your pipeline with verified contacts. Every interaction captures valuable lead information automatically.",
    colors: [[221, 160, 221], [255, 218, 185]], // #dda0dd to #ffdab9 - plum to soft peach
    animationSpeed: 3,
  },
  {
    icon: Calendar,
    title: "Book",
    description: "AI schedules demos with qualified leads on autopilot. Integrates with your calendar and CRM seamlessly.",
    colors: [[255, 182, 193], [221, 160, 221]], // #ffb6c1 to #dda0dd - light pink to plum
    animationSpeed: 3,
  }
  ];

  const stats = [
    {
      icon: TrendingUp,
      value: "700M+",
      label: "Weekly ChatGPT users have changed how we search",
      description: "We no longer read articles, we ask questions in natural language"
    },
    {
      icon: Users,
      value: "89%",
      label: "Of website visitors leave without converting",
      description: "Static chatbots with 3 options can't handle real conversations"
    },
    {
      icon: Zap,
      value: "3.2s",
      label: "Average time before visitors bounce",
      description: "Traditional forms and static content fail to engage"
    }
  ];

  return (
    <section className="py-20 px-4 relative overflow-hidden min-h-screen bg-white dark:bg-black">
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
        BACK_COLOR={{ r: 0.05, g: 0.05, b: 0.1 }}
        TRANSPARENT={true}
      />
      <div className="container mx-auto relative z-10 h-full flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Mission Statement */}
          <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-3xl p-12 mb-20 max-w-5xl mx-auto border border-blue-100/50 dark:border-blue-800/30 shadow-xl">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full mr-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Our Mission: Change How We Interact With Websites
              </h3>
            </div>
            <p className="text-xl text-gray-700 dark:text-gray-200 leading-relaxed max-w-4xl mx-auto">
              The way we search and interact online has fundamentally changed. <span className="font-semibold text-blue-600 dark:text-blue-400">700M+ weekly ChatGPT users</span> have shifted from keyword searches to natural language questions. 
              We want <span className="font-semibold text-purple-600 dark:text-purple-400">answers, not just articles</span>. Yet most websites still use static chatbots with 3 basic options that can't handle real conversations.
            </p>
            <div className="mt-8 flex items-center justify-center space-x-8 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                <span>Static chatbots fail</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                <span>Traffic wasted</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span>AI conversations win</span>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-24 max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-xl mr-4">
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stat.value}</span>
                </div>
                <h4 className="text-xl font-semibold text-black dark:text-white mb-3">{stat.label}</h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{stat.description}</p>
              </motion.div>
            ))}
          </div>

          {/* How it converts heading - moved here */}
          <div className="mb-16">
            <h2 className="text-5xl md:text-7xl font-bold text-black dark:text-white mb-8">
              How it converts visitors into customers
            </h2>
            <p className="text-2xl text-gray-600 dark:text-gray-200 max-w-4xl mx-auto leading-relaxed">
              Three simple steps to turn your traffic into booked demos and captured leads
            </p>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-center w-full gap-8 mx-auto">
          {steps.map((step, index) => (
            <Card
              key={step.title}
              title={step.title}
              description={step.description}
              icon={<step.icon className="w-10 h-10" />}
              colors={step.colors}
              animationSpeed={step.animationSpeed}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

const Card = ({
  title,
  description,
  icon,
  colors,
  animationSpeed,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  colors: number[][];
  animationSpeed: number;
}) => {
  const [hovered, setHovered] = React.useState(false);
  
  // Convert RGB arrays to CSS rgba strings
  const color1 = colors[0];
  const color2 = colors[1] || colors[0];
  
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="border border-black/[0.2] group/canvas-card flex items-center justify-center dark:border-white/[0.2] max-w-sm w-full mx-auto p-4 relative h-[30rem] relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm cursor-pointer transition-all duration-300 hover:scale-105"
    >
      <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-white text-black" />
      <Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-white text-black" />

      {/* Always visible background with colors */}
      <div className="h-full w-full absolute inset-0 rounded-lg overflow-hidden">
        {/* Solid color background using the first color */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundColor: `rgb(${color1[0]}, ${color1[1]}, ${color1[2]})`
          }}
        />
      </div>

      {/* Enhanced hover effect with animated dots */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-full w-full absolute inset-0 rounded-lg overflow-hidden"
          >
            {/* Animated dots pattern using CSS */}
            <div 
              className="absolute inset-0 bg-[length:20px_20px] animate-pulse opacity-40" 
              style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, rgba(${color1[0]}, ${color1[1]}, ${color1[2]}, 0.8) 1px, transparent 1px)`
              }}
            />
            <div 
              className="absolute inset-0 bg-[length:30px_30px] animate-pulse opacity-30" 
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(${color2[0]}, ${color2[1]}, ${color2[2]}, 0.6) 1px, transparent 1px)`,
                animationDelay: '0.5s'
              }}
            />
            <div 
              className="absolute inset-0 bg-[length:40px_40px] animate-pulse opacity-20" 
              style={{
                backgroundImage: `radial-gradient(circle at 75% 75%, rgba(${color1[0]}, ${color1[1]}, ${color1[2]}, 0.4) 1px, transparent 1px)`,
                animationDelay: '1s'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-20">
        <div className="text-center group-hover/canvas-card:-translate-y-4 group-hover/canvas-card:opacity-0 transition duration-200 w-full mx-auto flex items-center justify-center">
          <div className="text-black dark:text-white group-hover/canvas-card:text-black">
            {icon}
          </div>
        </div>
        <h2 className="text-xl opacity-0 group-hover/canvas-card:opacity-100 relative z-10 text-black dark:text-white mt-4 font-bold group-hover/canvas-card:text-black group-hover/canvas-card:-translate-y-2 transition duration-200 drop-shadow-lg font-semibold">
          {title}
        </h2>
        <p className="text-sm opacity-0 group-hover/canvas-card:opacity-100 relative z-10 text-gray-800 dark:text-gray-100 mt-2 group-hover/canvas-card:text-black group-hover/canvas-card:-translate-y-2 transition duration-200 max-w-xs drop-shadow-lg font-medium leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

const Icon = ({ className, ...rest }: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};

export default HowItConverts;
