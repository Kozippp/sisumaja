"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { clsx } from "clsx";

export function HeroSection() {
  const text = "SISUMAJA";
  const letters = text.split("");

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    }),
  };

  const childVariants: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Background Gradients with Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, 0], 
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-1/4 -left-64 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] opacity-60 mix-blend-screen" 
        />
        <motion.div 
          animate={{ 
            x: [0, -100, 0], 
            y: [0, 100, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-1/4 -right-64 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] opacity-60 mix-blend-screen" 
        />
        <motion.div 
          animate={{ 
            opacity: [0.3, 0.6, 0.3], 
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-fuchsia-900/10 rounded-full blur-[120px]" 
        />
      </div>

      {/* Grain Overlay for Texture */}
      <div className="absolute inset-0 opacity-[0.03] z-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-20">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8 backdrop-blur-sm"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          Eesti esimene creatorhouse
        </motion.div>
        
        {/* Title with Write-on Effect */}
        <h1 className="text-7xl md:text-9xl font-black mb-8 tracking-tighter leading-[0.9] flex justify-center overflow-hidden">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex"
          >
            {letters.map((letter, index) => (
              <motion.span 
                key={index} 
                variants={childVariants}
                className={clsx(
                  "inline-block",
                  index >= 4 ? "text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-600" : "text-white"
                )}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>
        </h1>
        
        {/* Subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Pakume uuenduslikku meelelahutust Eesti rahvale ning efektiivset turunduskanalit meiega resoneeruvatele ettevõtele.
        </motion.p>
        
        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link 
            href="/kontakt" 
            className="group relative px-8 py-4 bg-primary text-white font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)]"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative uppercase tracking-wide text-sm flex items-center gap-2">
              Võta ühendust <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
          <Link 
            href="/tehtud-tood" 
            className="group px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/5 transition-all hover:scale-105 active:scale-95 uppercase tracking-wide text-sm flex items-center gap-2 backdrop-blur-sm"
          >
            Vaata tehtud töid
          </Link>
        </motion.div>
      </div>

      {/* Bottom fade for seamless transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
    </section>
  );
}

