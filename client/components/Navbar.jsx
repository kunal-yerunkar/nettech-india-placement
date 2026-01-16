import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, ArrowUpRight, MessageSquare } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  // Hide the sticky CTA on the registration page
  const isRegisterPage = location.pathname === '/register';

  // Links for the navigation
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Domains', href: '/domains' },
    { name: 'Process', href: '/process' },
    { name: 'Partners', href: '/partners' },
    { name: 'Placements', href: '/success-stories' },
    { name: 'Contact', href: '/contact' },
  ];

  // Logic for Route Preloader
  useEffect(() => {
    setIsLoading(true);
    setLoadingProgress(0);

    // Fast initial jump
    const timer1 = setTimeout(() => setLoadingProgress(30), 50);
    const timer2 = setTimeout(() => setLoadingProgress(75), 300);
    const timer3 = setTimeout(() => {
      setLoadingProgress(100);
      setTimeout(() => setIsLoading(false), 400); // Wait for animation to finish
    }, 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <>
      {/* Subtle Preloader Bar */}
      {isLoading && (
        <div className="fixed top-0 left-0 w-full h-[3px] z-[2000] pointer-events-none overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.8)] transition-all duration-500 ease-out"
            style={{ width: `${loadingProgress}%` }}
          ></div>
        </div>
      )}

      {/* 1. Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 w-full h-full bg-[#05070a] z-[600] flex flex-col transition-all duration-500 ease-in-out ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
      >
        <div className="flex justify-between items-center px-6 h-20 border-b border-white/5 flex-shrink-0">
          <Link to="/" onClick={() => setIsOpen(false)}>
            <img
              src="/images/logo/NetTech India logo dark.png"
              alt="NetTech India"
              className="h-10 object-contain"
            />
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-3 text-white/40 hover:text-white bg-white/5 rounded-full transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-center px-10 py-10 overflow-y-auto">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link, idx) => (
              <Link
                key={link.name}
                to={link.href}
                className={`block text-[2.6rem] xs:text-[3rem] font-black leading-[1.1] transition-all duration-500
                  ${location.pathname === link.href
                    ? 'text-blue-500'
                    : 'text-white hover:text-blue-400'}`}
                style={{
                  transitionDelay: `${idx * 50}ms`,
                  transform: isOpen ? 'translateX(0)' : 'translateX(-20px)',
                  opacity: isOpen ? 1 : 0
                }}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="px-6 pb-12 pt-4 flex-shrink-0 flex flex-col items-center">
          <Link
            to="/register"
            className="block w-full py-5 rounded-full text-xl font-black text-white bg-blue-700 hover:bg-blue-600 text-center shadow-2xl shadow-blue-500/20 active:scale-95 transition-all"
            onClick={() => setIsOpen(false)}
          >
            Get Hired Now
          </Link>
          <p className="text-center text-gray-700 text-[9px] mt-10 font-black uppercase tracking-[0.4em] opacity-40">
            NetTech India Placement Cell
          </p>
        </div>
      </div>

      {/* 2. Main Navbar Bar */}
      <div className={`fixed w-full z-[510] transition-all duration-500 ease-in-out ${isOpen ? 'opacity-0 pointer-events-none' : (isScrolled ? 'top-4 px-4 sm:px-6' : 'top-0')}`}>
        <nav
          className={`mx-auto transition-all duration-500 ease-in-out 
            ${(isScrolled)
              ? 'max-w-6xl rounded-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border border-white/20 dark:border-gray-800 shadow-[0_8px_32px_rgba(0,0,0,0.1)]'
              : 'max-w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800'
            }`}
        >
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className={`flex justify-between items-center transition-all duration-500 ${isScrolled ? 'h-16' : 'h-20'}`}>

              <div className="flex items-center">
                <Link to="/" className="flex-shrink-0 group">
                  <img
                    src={isDarkMode ? "/images/logo/NetTech India logo dark.png" : "/images/logo/NetTech India logo.png"}
                    alt="NetTech India"
                    className={`transition-all duration-500 object-contain group-hover:scale-105 ${isScrolled ? 'h-8 sm:h-9' : 'h-9 sm:h-11 lg:h-12'}`}
                  />
                </Link>
              </div>

              <div className="hidden lg:flex items-center space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`relative px-4 py-2 text-sm font-bold transition-all duration-300 rounded-full
                      ${location.pathname === link.href
                        ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40'
                        : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50/50 dark:hover:bg-gray-800/50'}`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-4"></div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={toggleTheme}
                    className="p-2.5 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  </button>

                  <Link
                    to="/register"
                    className="relative overflow-hidden bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-black hover:bg-blue-800 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95 group"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Get Hired
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </Link>
                </div>
              </div>

              <div className="lg:hidden flex items-center space-x-3">
                <button
                  onClick={toggleTheme}
                  className="p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <button
                  onClick={() => setIsOpen(true)}
                  className="p-2.5 focus:outline-none rounded-full text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  <Menu className="w-8 h-8" />
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {!isRegisterPage && !isOpen && (
        <button
          onClick={() => navigate('/register')}
          className="md:hidden fixed bottom-0 left-0 w-full z-[400] bg-blue-700 text-white py-3.5 px-6 shadow-[0_-4px_24px_rgba(0,0,0,0.2)] flex items-center justify-center gap-3 active:scale-95 transition-all border-t border-white/10"
        >
          <div className="relative">
            <MessageSquare className="w-4 h-4 fill-current" />
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_6px_#34d399]"></span>
          </div>
          <span className="font-black uppercase tracking-[0.25em] text-[10px]">Get Hired Now</span>
        </button>
      )}
    </>
  );
};

export default Navbar;