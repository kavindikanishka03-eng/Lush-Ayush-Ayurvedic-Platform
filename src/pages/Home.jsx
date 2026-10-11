import { motion } from 'framer-motion';
import { ArrowRight, Leaf, Sparkles, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import FAQ from '../components/FAQ';
import Reviews from '../components/Reviews';
import Products from '../components/Products';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.2 } }
};

const featureVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const Home = () => {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {/* Hero Section */}
      <section style={{ 
        position: 'relative', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: '80px',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'url("/images/ayurveda_hero.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.6)',
          zIndex: -1
        }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1, color: '#fff' }}>
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ maxWidth: '600px' }}
          >
            <h1 style={{ fontSize: '4rem', color: '#fff', marginBottom: 'var(--space-4)', fontWeight: 600 }}>
              Rediscover Your Inner <span style={{ color: 'var(--color-accent)' }}>Harmony</span>
            </h1>
            <p style={{ fontSize: '1.2rem', marginBottom: 'var(--space-6)', opacity: 0.9, lineHeight: 1.8 }}>
              Experience the pinnacle of luxury Ayurveda in Sri Lanka. Tailored, all-natural therapies to rejuvenate your mind, body, and soul.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
              <Link to="/booking" className="btn btn-accent" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
                Book Consultation <ArrowRight size={20} />
              </Link>
              <Link to="/services" className="btn" style={{ 
                border: '1px solid #fff', color: '#fff', padding: '16px 32px', fontSize: '1.1rem',
                backdropFilter: 'blur(5px)', backgroundColor: 'rgba(255,255,255,0.1)'
              }}>
                Explore Treatments
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container text-center">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>The Lush Ayush Difference</h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-12)', maxWidth: '600px', margin: '0 auto var(--space-8)' }}>
            We combine ancient Vedic wisdom with modern luxury to provide an unparalleled wellness experience.
          </p>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-3 gap-6"
          >
            {[
              { 
                image: '/images/herbs.png', 
                title: '100% Organic Herbs', 
                desc: 'Sourced directly from pristine natural habitats for maximum potency.' 
              },
              { 
                image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop', 
                title: 'Luxury Ambience', 
                desc: 'A serene and opulent environment designed for complete relaxation.' 
              },
              { 
                image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800&auto=format&fit=crop', 
                title: 'Expert Practitioners', 
                desc: 'Highly qualified Ayurvedic doctors with decades of experience.' 
              }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                variants={featureVariants}
                style={{ 
                  backgroundColor: 'var(--color-surface)', 
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: '0 4px 15px rgba(10,34,19,0.05)',
                  transition: 'all var(--transition-normal)',
                  overflow: 'hidden',
                  border: '1px solid rgba(212, 175, 55, 0.1)'
                }}
                whileHover={{ y: -10, boxShadow: '0 15px 30px rgba(10,34,19,0.1)' }}
              >
                <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
                  <img 
                    src={feature.image} 
                    alt={feature.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
                <div style={{ padding: 'var(--space-5)' }}>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: 'var(--space-2)', color: 'var(--color-primary)' }}>{feature.title}</h3>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: '1.6' }}>{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-12" style={{ 
        position: 'relative',
        color: '#fff',
        backgroundImage: 'url("/images/ayurveda_dark.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10, 34, 19, 0.85)', zIndex: 0 }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="grid grid-cols-2 gap-6" style={{ alignItems: 'center' }}>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img src="/images/spa.png" alt="Spa Treatment" style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }} />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{ paddingLeft: 'var(--space-6)' }}
            >
              <h2 style={{ fontSize: '2.5rem', color: '#fff', marginBottom: 'var(--space-4)' }}>Signature Therapies</h2>
              <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: 'var(--space-6)', fontSize: '1.1rem' }}>
                Immerse yourself in our signature therapies designed specifically to alleviate stress, detoxify the body, and restore your natural glow. Experience the profound healing of Shirodhara and Abhyanga.
              </p>
              <Link to="/services" className="btn btn-accent">View All Services <ArrowRight size={18}/></Link>
            </motion.div>
          </div>
        </div>
      </section>
      <Products />
      <FAQ />
      <Reviews />
    </motion.div>
  );
};

export default Home;
