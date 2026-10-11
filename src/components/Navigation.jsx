import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartQuantity } = useCart();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // For the pages like home, we want text to be white/gold when at top,
  // but if we are on a white background, it's different.
  // We'll use a rich dark glassmorphic effect when scrolled.
  const isHomeOrNotScrolled = !isScrolled && location.pathname === '/';

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: isScrolled ? '15px 0' : '25px 0',
        backgroundColor: isScrolled ? 'rgba(10, 34, 19, 0.9)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        boxShadow: isScrolled ? '0 10px 30px rgba(0,0,0,0.2)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid transparent',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '15px', textDecoration: 'none' }}>
          <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.6 }}>
            <img src="/images/logo.png" alt="Lush Ayush Logo" className="logo-highlight" style={{ width: '55px', height: '55px', borderRadius: '50%', objectFit: 'cover' }} />
          </motion.div>
          <span style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: '1.6rem', 
            fontWeight: 700,
            color: isScrolled ? '#FFFFFF' : (location.pathname === '/' ? '#FFFFFF' : 'var(--color-primary)'),
            letterSpacing: '1px'
          }}>
            Lush <span style={{ color: 'var(--color-accent)' }}>Ayush</span>
          </span>
        </Link>

        <nav style={{ display: 'flex', gap: '40px' }}>
          {[
            { name: 'Home', path: '/' },
            { name: 'Services & Videos', path: '/services' },
            { name: 'Book Appointment', path: '/booking' },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.path}
              style={{
                position: 'relative',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                color: location.pathname === item.path 
                  ? 'var(--color-accent)' 
                  : (isScrolled ? '#F8FAFC' : (isHomeOrNotScrolled ? '#F8FAFC' : 'var(--color-primary)')),
                transition: 'color 0.3s ease',
              }}
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ display: 'inline-block' }}
              >
                {item.name}
              </motion.span>
              
              <AnimatePresence>
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="navbar-underline"
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    exit={{ opacity: 0, scaleX: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      position: 'absolute',
                      bottom: '-8px',
                      left: '0%',
                      right: '0%',
                      height: '3px',
                      background: 'var(--gradient-gold)',
                      borderRadius: '4px',
                      boxShadow: '0 2px 10px rgba(212,175,55,0.4)'
                    }}
                  />
                )}
              </AnimatePresence>
            </Link>
          ))}
          <Link to="/checkout" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: location.pathname === '/checkout' ? 'var(--color-accent)' : (isScrolled ? '#F8FAFC' : (isHomeOrNotScrolled ? '#F8FAFC' : 'var(--color-primary)')), transition: 'color 0.3s ease' }}>
            <ShoppingCart size={24} />
            {cartQuantity > 0 && (
              <span style={{ position: 'absolute', top: '-8px', right: '-12px', background: 'var(--color-accent)', color: 'var(--color-primary)', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold' }}>
                {cartQuantity}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </motion.header>
  );
};

export default Navigation;
