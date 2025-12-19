"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', 'all');
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    localStorage.setItem('cookie-consent', 'necessary');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
        >
          <div className="max-w-7xl mx-auto bg-neutral-900/95 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-bold text-white">Küpsiste eelistused</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                  Kasutame küpsiseid, et pakkuda teile parimat võimalikku kasutajakogemust. 
                  Mõned küpsised on vajalikud veebilehe toimimiseks, teised aitavad meil mõista, kuidas te lehte kasutate.
                  Lisateavet leiate meie <Link href="/kupsiste-poliitika" className="text-white underline hover:text-gray-300">küpsiste poliitikast</Link> ja <Link href="/privaatsuspoliitika" className="text-white underline hover:text-gray-300">privaatsuspoliitikast</Link>.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto min-w-fit">
                <button
                  onClick={handleAcceptNecessary}
                  className="px-6 py-2.5 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors text-sm font-medium whitespace-nowrap"
                >
                  Ainult vajalikud
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-gray-200 transition-colors text-sm font-bold whitespace-nowrap shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                >
                  Nõustun kõigiga
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors lg:hidden"
              aria-label="Sulge"
            >
              <X size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

