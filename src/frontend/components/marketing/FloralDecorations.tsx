
import React from 'react';
import { motion } from 'framer-motion';

const FloralDecorations = () => {
  const floralShapes = [
    // Top decorations
    { size: 120, x: '5%', y: '10%', color: 'from-floral-orange to-floral-red', delay: 0 },
    { size: 80, x: '90%', y: '5%', color: 'from-floral-pink to-floral-orange', delay: 1 },
    { size: 60, x: '15%', y: '8%', color: 'from-floral-yellow to-floral-green', delay: 2 },
    
    // Middle decorations
    { size: 100, x: '85%', y: '40%', color: 'from-floral-green to-floral-yellow', delay: 0.5 },
    { size: 70, x: '10%', y: '45%', color: 'from-floral-pink to-floral-red', delay: 1.5 },
    { size: 90, x: '92%', y: '60%', color: 'from-floral-orange to-floral-pink', delay: 2.5 },
    
    // Bottom decorations
    { size: 110, x: '8%', y: '80%', color: 'from-floral-red to-floral-orange', delay: 0.8 },
    { size: 75, x: '88%', y: '85%', color: 'from-floral-yellow to-floral-pink', delay: 1.8 },
    { size: 85, x: '12%', y: '92%', color: 'from-floral-green to-floral-orange', delay: 2.8 },
  ];

  const petals = [
    // Scattered petals
    { size: 24, x: '25%', y: '20%', color: 'floral-orange', delay: 3 },
    { size: 18, x: '70%', y: '25%', color: 'floral-pink', delay: 3.5 },
    { size: 20, x: '40%', y: '15%', color: 'floral-yellow', delay: 4 },
    { size: 16, x: '60%', y: '70%', color: 'floral-green', delay: 4.5 },
    { size: 22, x: '30%', y: '75%', color: 'floral-red', delay: 5 },
    { size: 19, x: '75%', y: '50%', color: 'floral-orange', delay: 5.5 },
  ];

  return (
    <>
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-black/95" />
      
      {/* Large floral shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floralShapes.map((shape, index) => (
          <motion.div
            key={`shape-${index}`}
            className={`absolute rounded-full opacity-20 bg-gradient-to-br ${shape.color} blur-3xl`}
            style={{
              width: shape.size,
              height: shape.size,
              left: shape.x,
              top: shape.y,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              opacity: [0, 0.3, 0.2],
            }}
            transition={{
              duration: 3,
              delay: shape.delay,
              ease: "easeOut"
            }}
          />
        ))}

        {/* Animated flower petals */}
        {petals.map((petal, index) => (
          <motion.div
            key={`petal-${index}`}
            className={`absolute bg-${petal.color} opacity-30 rounded-full blur-sm`}
            style={{
              width: petal.size,
              height: petal.size,
              left: petal.x,
              top: petal.y,
            }}
            initial={{ scale: 0, rotate: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.5, 1],
              rotate: [0, 180, 360],
              opacity: [0, 0.4, 0.3],
            }}
            transition={{
              duration: 4,
              delay: petal.delay,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 8,
            }}
          />
        ))}

        {/* Floating particles */}
        {Array.from({ length: 15 }).map((_, index) => (
          <motion.div
            key={`particle-${index}`}
            className="absolute w-2 h-2 bg-floral-orange/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}

        {/* Organic flowing shapes */}
        <motion.div
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-floral-pink/10 to-floral-orange/10 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-gradient-to-br from-floral-yellow/15 to-floral-green/15 rounded-full blur-2xl"
          animate={{
            scale: [1, 0.8, 1.2, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </>
  );
};

export default FloralDecorations;
