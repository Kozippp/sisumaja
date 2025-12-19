'use client';

import { motion } from 'framer-motion';

export function MotionWrapper({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className={className}
      variants={{
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15, // Smooth stagger
            delayChildren: 0.1,
          },
        },
        hidden: { opacity: 0 },
      }}
    >
      {children}
    </motion.div>
  );
}

export function MotionItem({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
        visible: { 
            opacity: 1, 
            y: 0, 
            filter: 'blur(0px)',
            transition: { 
                type: "spring", 
                stiffness: 70, 
                damping: 20,
                mass: 1.2
            }
        },
      }}
    >
      {children}
    </motion.div>
  );
}

