import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll handler to prevent 404 routing errors
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      setIsOpen(false); // Close mobile menu first
      // Small timeout to allow menu animation to start closing before scroll
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  return (
    <>
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-xl border-b border-gray-100 py-4 shadow-sm' 
          : 'bg-gradient-to-b from-black/50 to-transparent py-6'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center relative z-50">
              <a 
                href="#hero" 
                onClick={(e) => handleNavClick(e, '#hero')}
                className="flex flex-col group"
              >
                <span className={`serif font-bold text-2xl tracking-tighter transition-colors duration-300 ${
                  scrolled && !isOpen ? 'text-black' : 'text-white'
                }`}>
                  YIDAO JIAHUA
                </span>
                <span className={`text-[10px] tracking-[0.3em] uppercase transition-colors ${
                   scrolled && !isOpen ? 'text-gray-500' : 'text-gray-300'
                } group-hover:text-brand-gold`}>
                  译 道 佳 华
                </span>
              </a>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-10">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-sm font-medium tracking-widest uppercase transition-all duration-300 relative group ${
                    scrolled ? 'text-gray-600 hover:text-black' : 'text-gray-200 hover:text-white'
                  }`}
                >
                  {link.label}
                  <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-brand-gold group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
              <a 
                href="#contact"
                onClick={(e) => handleNavClick(e, '#contact')}
                className={`px-6 py-2 border transition-all duration-300 text-xs font-bold tracking-widest uppercase ${
                  scrolled 
                    ? 'border-black text-black hover:bg-black hover:text-white' 
                    : 'border-white/50 text-white hover:bg-white hover:text-black'
                }`}
              >
                合作咨询
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center z-50">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 focus:outline-none transition-colors ${
                  isOpen ? 'text-white' : (scrolled ? 'text-black' : 'text-white')
                }`}
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Fullscreen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center md:hidden"
          >
            <div className="flex flex-col items-center space-y-8">
              {NAV_LINKS.map((link, idx) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(e, link.href)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="text-2xl font-serif text-white hover:text-brand-gold tracking-widest transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={(e: React.MouseEvent<HTMLAnchorElement>) => handleNavClick(e, '#contact')}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 px-8 py-3 bg-brand-gold text-white font-bold tracking-widest uppercase"
              >
                立即联系
              </motion.a>
            </div>
            
            {/* Decorative background element */}
            <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-brand-gold/10 to-transparent pointer-events-none"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;