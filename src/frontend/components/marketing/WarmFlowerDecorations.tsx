
import React from 'react';
import { motion } from 'framer-motion';

const WarmFlowerDecorations = () => {
  // Elegant, calming flowers with warm colors
  const cornerFlowers = [
    // Top-left corner cluster
    { 
      type: 'cherry_blossom', 
      size: 'large', 
      x: '5%', 
      y: '8%', 
      rotation: 15,
      color: '#D4A574', // warm sand
      delay: 0
    },
    { 
      type: 'simple_petal', 
      size: 'medium', 
      x: '8%', 
      y: '15%', 
      rotation: -20,
      color: '#C4A079', // warm stone
      delay: 0.5
    },
    { 
      type: 'leaf', 
      size: 'small', 
      x: '12%', 
      y: '10%', 
      rotation: 45,
      color: '#9DB08A', // warm sage
      delay: 1
    },
    
    // Bottom-right corner cluster
    { 
      type: 'rose', 
      size: 'large', 
      x: '90%', 
      y: '85%', 
      rotation: -25,
      color: '#E8B4A6', // warm rose
      delay: 1.5
    },
    { 
      type: 'simple_petal', 
      size: 'medium', 
      x: '85%', 
      y: '88%', 
      rotation: 30,
      color: '#F0D5B8', // warm cream
      delay: 2
    },
    { 
      type: 'leaf', 
      size: 'small', 
      x: '88%', 
      y: '92%', 
      rotation: -15,
      color: '#9DB08A', // warm sage
      delay: 2.5
    },
  ];

  // Subtle floating elements
  const floatingElements = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: `${20 + Math.random() * 60}%`,
    y: `${20 + Math.random() * 60}%`,
    size: Math.random() * 8 + 4,
    color: ['#D4A574', '#C4A079', '#E8B4A6', '#F0D5B8'][Math.floor(Math.random() * 4)],
    delay: Math.random() * 15,
    duration: 20 + Math.random() * 10
  }));

  const FlowerSVG = ({ type, color, size }: { type: string; color: string; size: string }) => {
    const dimensions = size === 'large' ? 80 : size === 'medium' ? 50 : 30;
    
    switch (type) {
      case 'cherry_blossom':
        return (
          <svg width={dimensions} height={dimensions} viewBox="0 0 100 100" fill="none">
            <g>
              {Array.from({ length: 5 }, (_, i) => (
                <path
                  key={i}
                  d="M50 45 Q40 35 45 50 Q50 55 55 50 Q60 35 50 45 Z"
                  fill={color}
                  transform={`rotate(${i * 72} 50 50)`}
                  opacity="0.7"
                />
              ))}
              <circle cx="50" cy="50" r="4" fill="#F0D5B8" opacity="0.8"/>
            </g>
          </svg>
        );
      
      case 'simple_petal':
        return (
          <svg width={dimensions} height={dimensions} viewBox="0 0 100 100" fill="none">
            <ellipse cx="50" cy="35" rx="8" ry="20" fill={color} opacity="0.6" transform="rotate(0 50 50)"/>
            <ellipse cx="50" cy="35" rx="8" ry="20" fill={color} opacity="0.6" transform="rotate(60 50 50)"/>
            <ellipse cx="50" cy="35" rx="8" ry="20" fill={color} opacity="0.6" transform="rotate(120 50 50)"/>
            <circle cx="50" cy="50" r="6" fill="#D4A574" opacity="0.7"/>
          </svg>
        );
      
      case 'rose':
        return (
          <svg width={dimensions} height={dimensions} viewBox="0 0 100 100" fill="none">
            <path d="M50 75C65 75 75 65 75 50C75 35 65 25 50 25C35 25 25 35 25 50C25 65 35 75 50 75Z" fill={color} opacity="0.6"/>
            <path d="M50 65C60 65 65 60 65 50C65 40 60 35 50 35C40 35 35 40 35 50C35 60 40 65 50 65Z" fill={color} opacity="0.4"/>
            <circle cx="50" cy="48" r="6" fill="#9DB08A" opacity="0.5"/>
          </svg>
        );
      
      case 'leaf':
        return (
          <svg width={dimensions} height={dimensions} viewBox="0 0 100 100" fill="none">
            <path d="M50 20 Q65 35 60 60 Q50 70 40 60 Q35 35 50 20 Z" fill={color} opacity="0.6"/>
            <path d="M50 25 L50 65" stroke={color} strokeWidth="1" opacity="0.4"/>
          </svg>
        );
      
      default:
        return (
          <svg width={dimensions} height={dimensions} viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="15" fill={color} opacity="0.5"/>
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Corner flower clusters */}
      {cornerFlowers.map((flower, index) => (
        <motion.div
          key={`corner-flower-${index}`}
          className="absolute"
          style={{
            left: flower.x,
            top: flower.y,
            transform: `rotate(${flower.rotation}deg)`,
          }}
          initial={{ scale: 0, opacity: 0, rotate: flower.rotation - 90 }}
          animate={{ 
            scale: 1, 
            opacity: 1, 
            rotate: flower.rotation,
          }}
          transition={{
            duration: 2.5,
            delay: flower.delay,
            ease: "easeOut"
          }}
        >
          <motion.div
            animate={{
              y: [-3, 3, -3],
              rotate: [flower.rotation - 1, flower.rotation + 1, flower.rotation - 1],
            }}
            transition={{
              duration: 8 + index,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <FlowerSVG type={flower.type} color={flower.color} size={flower.size} />
          </motion.div>
        </motion.div>
      ))}

      {/* Subtle floating petals */}
      {floatingElements.map((element) => (
        <motion.div
          key={`floating-${element.id}`}
          className="absolute rounded-full opacity-30"
          style={{
            left: element.x,
            top: element.y,
            width: element.size,
            height: element.size,
            backgroundColor: element.color,
          }}
          initial={{ y: -50, opacity: 0, rotate: 0 }}
          animate={{
            y: window.innerHeight + 50,
            opacity: [0, 0.3, 0.3, 0],
            rotate: 180,
            x: [0, 15, -10, 5, 0],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Subtle vine decoration on left edge */}
      <div className="absolute left-0 top-0 h-full w-6">
        <svg className="h-full w-full" viewBox="0 0 24 400" fill="none">
          <path
            d="M2 0 Q8 50 6 100 Q12 150 4 200 Q15 250 8 300 Q14 350 6 400"
            stroke="#9DB08A"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
          />
          {Array.from({ length: 6 }, (_, i) => (
            <circle
              key={i}
              cx={i % 2 === 0 ? "6" : "12"}
              cy={i * 60 + 40}
              r="2"
              fill="#D4A574"
              opacity="0.4"
            />
          ))}
        </svg>
      </div>

      {/* Subtle vine decoration on right edge */}
      <div className="absolute right-0 top-0 h-full w-6">
        <svg className="h-full w-full" viewBox="0 0 24 400" fill="none">
          <path
            d="M22 0 Q16 50 18 100 Q12 150 20 200 Q9 250 16 300 Q10 350 18 400"
            stroke="#9DB08A"
            strokeWidth="2"
            fill="none"
            opacity="0.3"
          />
          {Array.from({ length: 6 }, (_, i) => (
            <circle
              key={i}
              cx={i % 2 === 0 ? "18" : "12"}
              cy={i * 60 + 40}
              r="2"
              fill="#D4A574"
              opacity="0.4"
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default WarmFlowerDecorations;
