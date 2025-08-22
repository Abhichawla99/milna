import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/frontend/components/ui/button";
import { SplashCursor } from "../ui/SplashCursor";

interface MidPageCTAProps {
  onGetStartedClick: () => void;
}

const MidPageCTA = ({ onGetStartedClick }: MidPageCTAProps) => {
  return (
    <section className="py-8 px-4 bg-primary/5 border-y border-primary/10 sticky top-0 z-40 backdrop-blur-sm relative overflow-hidden">
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
        BACK_COLOR={{ r: 0.02, g: 0.02, b: 0.05 }}
        TRANSPARENT={true}
      />
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="text-center sm:text-left">
            <p className="text-lg font-semibold text-var(--ink)">
              Stop losing leads to missed conversations.
            </p>
          </div>
          <Button
            onClick={onGetStartedClick}
            className="btn-primary text-white px-6 py-3 font-semibold shadow-glow-warm group whitespace-nowrap"
            data-event="mid-cta-click"
          >
            Try Milna Free
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default MidPageCTA;
