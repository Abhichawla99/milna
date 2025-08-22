
import React from 'react';
import { motion } from 'framer-motion';

const RealFlowerDecorations = () => {
  // Real flower SVGs and images
  const flowers = [
    // Top area flowers
    { 
      type: 'rose', 
      size: 'large', 
      x: '8%', 
      y: '5%', 
      rotation: 15,
      color: '#FF69B4',
      delay: 0
    },
    { 
      type: 'sunflower', 
      size: 'large', 
      x: '85%', 
      y: '8%', 
      rotation: -20,
      color: '#FFD700',
      delay: 0.5
    },
    { 
      type: 'tulip', 
      size: 'medium', 
      x: '15%', 
      y: '12%', 
      rotation: 45,
      color: '#FF6347',
      delay: 1
    },
    
    // Middle area flowers
    { 
      type: 'daisy', 
      size: 'medium', 
      x: '92%', 
      y: '45%', 
      rotation: -30,
      color: '#FFFFFF',
      delay: 1.5
    },
    { 
      type: 'cherry_blossom', 
      size: 'small', 
      x: '5%', 
      y: '35%', 
      rotation: 60,
      color: '#FFB6C1',
      delay: 2
    },
    { 
      type: 'lotus', 
      size: 'large', 
      x: '88%', 
      y: '65%', 
      rotation: 10,
      color: '#DDA0DD',
      delay: 2.5
    },
    
    // Bottom area flowers
    { 
      type: 'hibiscus', 
      size: 'large', 
      x: '10%', 
      y: '80%', 
      rotation: -45,
      color: '#FF4500',
      delay: 3
    },
    { 
      type: 'lily', 
      size: 'medium', 
      x: '90%', 
      y: '88%', 
      rotation: 25,
      color: '#FF69B4',
      delay: 3.5
    },
    { 
      type: 'peony', 
      size: 'medium', 
      x: '12%', 
      y: '92%', 
      rotation: -15,
      color: '#FF1493',
      delay: 4
    },
  ];

  // Scattered petals
  const petals = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: Math.random() * 15 + 8,
    color: ['#FF69B4', '#FFD700', '#FF6347', '#DDA0DD', '#FF4500'][Math.floor(Math.random() * 5)],
    delay: Math.random() * 10,
    duration: 15 + Math.random() * 10
  }));

  const FlowerSVG = ({ type, color, size }: { type: string; color: string; size: string }) => {
    const dimensions = size === 'large' ? 120 : size === 'medium' ? 80 : 50;
    
    switch (type) {
      case 'rose':
        return (
          <svg width={dimensions} height={dimensions} viewBox="0 0 100 100" fill="none">
            <path d="M50 85C70 85 85 70 85 50C85 30 70 15 50 15C30 15 15 30 15 50C15 70 30 85 50 85Z" fill={color} opacity="0.8"/>
            <path d="M50 75C65 75 75 65 75 50C75 35 65 25 50 25C35 25 25 35 25 50C25 65 35 75 50 75Z" fill={color} opacity="0.6"/>
            <path d="M50 65C60 65 65 60 65 50C65 40 60 35 50 35C40 35 35 40 35 50C35 60 40 65 50 65Z" fill={color} opacity="0.4"/>
            <circle cx="50" cy="45" r="8" fill="#228B22" opacity="0.7"/>
          </svg>
        );
      
      case 'sunflower':
        return (
          <svg width={dimensions} height={dimensions} viewBox="0 0 100 100" fill="none">
            <g>
              {Array.from({ length: 12 }, (_, i) => (
                <path
                  key={i}
                  d="M50 20 L55 35 L50 50 L45 35 Z"
                  fill={color}
                  transform={`rotate(${i * 30} 50 50)`}
                  opacity="0.8"
                />
              ))}
              <circle cx="50" cy="50" r="15" fill="#8B4513"/>
            </g>
          </svg>
        );
      
      case 'tulip':
        return (
          <svg width={dimensions} height={dimensions} viewBox="0 0 100 100" fill="none">
            <path d="M50 20 Q35 35 40 55 Q50 65 60 55 Q65 35 50 20 Z" fill={color} opacity="0.8"/>
            <path d="M50 55 L50 80" stroke="#228B22" strokeWidth="3" fill="none"/>
            <path d="M45 65 Q50 60 55 65" stroke="#228B22" strokeWidth="2" fill="none"/>
          </svg>
        );
      
      case 'daisy':
        return (
          <svg width={dimensions} height={dimensions} viewBox="0 0 100 100" fill="none">
            <g>
              {Array.from({ length: 8 }, (_, i) => (
                <ellipse
                  key={i}
                  cx="50"
                  cy="30"
                  rx="6"
                  ry="18"
                  fill={color}
                  transform={`rotate(${i * 45} 50 50)`}
                  opacity="0.9"
                />
              ))}
              <circle cx="50" cy="50" r="8" fill="#FFD700"/>
            </g>
          </svg>
        );
      
      case 'cherry_blossom':
        return (
          <svg width={dimensions} height={dimensions} viewBox="0 0 100 100" fill="none">
            <g>
              {Array.from({ length: 5 }, (_, i) => (
                <path
                  key={i}
                  d="M50 40 Q40 35 45 50 Q50 55 55 50 Q60 35 50 40 Z"
                  fill={color}
                  transform={`rotate(${i * 72} 50 50)`}
                  opacity="0.8"
                />
              ))}
              <circle cx="50" cy="50" r="5" fill="#FFC0CB"/>
            </g>
          </svg>
        );
      
      default:
        return (
          <svg width={dimensions} height={dimensions} viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="25" fill={color} opacity="0.7"/>
            <circle cx="50" cy="50" r="15" fill="#FFD700" opacity="0.8"/>
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Main flowers */}
      {flowers.map((flower, index) => (
        <motion.div
          key={`flower-${index}`}
          className="flower-decoration absolute"
          style={{
            left: flower.x,
            top: flower.y,
            transform: `rotate(${flower.rotation}deg)`,
          }}
          initial={{ scale: 0, opacity: 0, rotate: flower.rotation - 180 }}
          animate={{ 
            scale: 1, 
            opacity: 1, 
            rotate: flower.rotation,
          }}
          transition={{
            duration: 2,
            delay: flower.delay,
            ease: "easeOut"
          }}
        >
          <motion.div
            animate={{
              y: [-5, 5, -5],
              rotate: [flower.rotation - 2, flower.rotation + 2, flower.rotation - 2],
            }}
            transition={{
              duration: 6 + index,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <FlowerSVG type={flower.type} color={flower.color} size={flower.size} />
          </motion.div>
        </motion.div>
      ))}

      {/* Floating petals */}
      {petals.map((petal) => (
        <motion.div
          key={`petal-${petal.id}`}
          className="absolute rounded-full"
          style={{
            left: petal.x,
            top: petal.y,
            width: petal.size,
            height: petal.size,
            backgroundColor: petal.color,
          }}
          initial={{ y: -100, opacity: 0, rotate: 0 }}
          animate={{
            y: window.innerHeight + 100,
            opacity: [0, 1, 1, 0],
            rotate: 360,
            x: [0, 30, -20, 10, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      {/* Vine decorations on edges */}
      <div className="absolute left-0 top-0 h-full w-8">
        <svg className="h-full w-full" viewBox="0 0 32 400" fill="none">
          <path
            d="M2 0 Q10 50 8 100 Q15 150 5 200 Q20 250 10 300 Q18 350 8 400"
            stroke="#228B22"
            strokeWidth="3"
            fill="none"
            opacity="0.6"
          />
          {Array.from({ length: 8 }, (_, i) => (
            <circle
              key={i}
              cx={i % 2 === 0 ? "8" : "16"}
              cy={i * 50 + 25}
              r="4"
              fill="#32CD32"
              opacity="0.7"
            />
          ))}
        </svg>
      </div>

      <div className="absolute right-0 top-0 h-full w-8">
        <svg className="h-full w-full" viewBox="0 0 32 400" fill="none">
          <path
            d="M30 0 Q22 50 24 100 Q17 150 27 200 Q12 250 22 300 Q14 350 24 400"
            stroke="#228B22"
            strokeWidth="3"
            fill="none"
            opacity="0.6"
          />
          {Array.from({ length: 8 }, (_, i) => (
            <circle
              key={i}
              cx={i % 2 === 0 ? "24" : "16"}
              cy={i * 50 + 25}
              r="4"
              fill="#32CD32"
              opacity="0.7"
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export default RealFlowerDecorations;
