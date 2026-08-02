import { motion } from 'motion/react';

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Círculos flutuantes maiores e mais visíveis com movimento mais suave */}
      <motion.div
        className="absolute w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl"
        animate={{
          x: [0, 150, 0],
          y: [0, -150, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: [0.45, 0.05, 0.55, 0.95]
        }}
        style={{ top: '5%', left: '5%' }}
      />
      
      <motion.div
        className="absolute w-[450px] h-[450px] bg-yellow-400/15 rounded-full blur-3xl"
        animate={{
          x: [0, -120, 0],
          y: [0, 120, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: [0.45, 0.05, 0.55, 0.95]
        }}
        style={{ top: '40%', right: '5%' }}
      />

      <motion.div
        className="absolute w-[400px] h-[400px] bg-blue-300/20 rounded-full blur-3xl"
        animate={{
          x: [0, 80, 0],
          y: [0, -80, 0],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: [0.45, 0.05, 0.55, 0.95]
        }}
        style={{ bottom: '10%', left: '45%' }}
      />
      
      {/* Partículas mais fluidas */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-white/30 rounded-full"
          animate={{
            y: [0, -800],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 10 + (i % 4) * 2,
            repeat: Infinity,
            ease: [0.45, 0.05, 0.55, 0.95],
            delay: i * 1.2
          }}
          style={{ 
            left: `${10 + (i * 8)}%`, 
            top: '100%',
          }}
        />
      ))}
      
      {/* Linhas diagonais mais suaves */}
      <motion.div
        className="absolute w-1 h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent"
        animate={{
          x: [-100, window.innerWidth + 100],
          y: [0, 400],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 3
        }}
        style={{ top: '20%', left: 0 }}
      />

      <motion.div
        className="absolute w-1 h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent"
        animate={{
          x: [-100, window.innerWidth + 100],
          y: [0, 400],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 4,
          delay: 8
        }}
        style={{ top: '40%', left: 0 }}
      />
    </div>
  );
}