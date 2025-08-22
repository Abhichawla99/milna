
import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { SplashCursor } from "../ui/SplashCursor";

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Milna increased our demo bookings by 300% in the first month. We're now capturing leads 24/7 that we were missing before.",
      author: "Sarah Chen",
      role: "Head of Sales",
      company: "TechFlow Inc.",
      rating: 5
    },
    {
      quote: "The AI agent books qualified demos automatically and integrates perfectly with our CRM. It's like having a sales rep that never sleeps.",
      author: "Marcus Rodriguez",
      role: "VP of Growth",
      company: "InnovateCorp",
      rating: 5
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-var(--cream) to-white relative overflow-hidden">
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
        BACK_COLOR={{ r: 0.03, g: 0.03, b: 0.08 }}
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
            Trusted by SaaS teams worldwide
          </h2>
          <p className="text-lg text-var(--ink-muted) max-w-2xl mx-auto">
            See how companies are using Milna to convert more visitors into booked demos
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 relative"
            >
              <Quote className="h-8 w-8 text-primary/20 absolute top-6 right-6" />
              
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              <blockquote className="text-lg text-var(--ink) mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                  {testimonial.author.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="font-semibold text-var(--ink)">
                    {testimonial.author}
                  </div>
                  <div className="text-sm text-var(--ink-muted)">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg border border-gray-100">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <span className="text-sm font-medium text-var(--ink)">
              4.9/5 from 500+ reviews
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
