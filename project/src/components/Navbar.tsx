import React, { useState } from 'react';
import { Home, Menu, X, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';
import { supabase } from '../lib/supabase';

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Properties', href: '#' },
    { name: 'Roommates', href: '/roommates', icon: Users },
    { name: 'About Us', href: '#' },
    { name: 'Contact', href: '#' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-6 w-6 text-red-600" />
              <span className="text-lg font-semibold text-gray-900">PG Finder</span>
            </Link>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <motion.div whileHover={{ scale: 1.05 }} key={link.name}>
                <Link
                  to={link.href}
                  className="relative flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600 transition-all"
                >
                  {link.icon && <link.icon className="h-4 w-4" />}
                  <span className="relative group">
                    {link.name}
                    <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
                  </span>
                </Link>
              </motion.div>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md shadow-md hover:bg-red-700 transition"
            >
              Sign In
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/list-property')}
              className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md shadow-md hover:bg-red-50 transition"
            >
              List Property
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5 text-gray-600" /> : <Menu className="h-5 w-5 text-gray-600" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t border-gray-200 py-4"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block px-4 py-2 text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="px-4 space-y-2">
                <button
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-sm font-medium text-white bg-red-600 rounded-md shadow-md hover:bg-red-700 transition"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    navigate('/list-property');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-2 text-sm font-medium text-red-600 border border-red-600 rounded-md shadow-md hover:bg-red-50 transition"
                >
                  List Property
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </nav>
  );
};

export default Navbar;
