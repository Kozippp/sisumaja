"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black/80 backdrop-blur-lg border-b border-white/10 py-4"
            : "bg-transparent py-4 md:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="relative z-50 flex items-center h-10 md:h-12 w-auto"
            >
              <Image
                src="/LOGOTRANSPARENT.png"
                alt="Sisumaja logo"
                width={240}
                height={96}
                className="h-14 md:h-20 w-auto object-contain"
                priority
              />
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink href="/">Avaleht</NavLink>
              <NavLink href="/tehtud-tood">Tehtud tööd</NavLink>
              <NavLink href="/kontakt">Kontakt</NavLink>
              <Link
                href="/kontakt"
                className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-primary hover:text-white transition-all duration-300 text-sm uppercase tracking-wide"
              >
                Kirjuta meile
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative z-50 p-2 text-white hover:text-primary transition-colors"
              aria-label={isOpen ? "Sulge menüü" : "Ava menüü"}
            >
              {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center space-y-8 md:hidden"
          >
            <MobileNavLink href="/" onClick={() => setIsOpen(false)}>
              Avaleht
            </MobileNavLink>
            <MobileNavLink href="/tehtud-tood" onClick={() => setIsOpen(false)}>
              Tehtud tööd
            </MobileNavLink>
            <MobileNavLink href="/kontakt" onClick={() => setIsOpen(false)}>
              Kontakt
            </MobileNavLink>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

function MobileNavLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="text-3xl font-bold text-white hover:text-primary transition-colors uppercase tracking-wider"
    >
      {children}
    </Link>
  );
}
