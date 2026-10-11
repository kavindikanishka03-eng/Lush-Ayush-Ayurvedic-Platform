import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Play, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.15 } }
};

const cardVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const services = [
  {
    title: 'Abhyanga Massage',
    duration: '60 mins',
    price: '$80',
    desc: 'A full-body massage using warm, medicated herbal oils to nourish the skin, mobilize toxins, and deeply relax the nervous system.',
    image: '/images/spa.png'
  },
  {
    title: 'Shirodhara Treatment',
    duration: '45 mins',
    price: '$95',
    desc: 'A continuous stream of warm herbal oil poured gently over the forehead. Highly effective for stress, insomnia, and mental clarity.',
    image: '/images/herbs.png'
  },
  {
    title: 'Udvartana (Herbal Scrub)',
    duration: '60 mins',
    price: '$85',
    desc: 'An invigorating full-body scrub using dry herbal powders. Excellent for weight loss, improving circulation, and skin exfoliation.',
    image: '/images/hero.png'
  },
  {
    title: 'Nasya Therapy',
    duration: '30 mins',
    price: '$50',
    desc: 'Administration of herbal oils through the nasal passage to cleanse the head region, relieving sinus issues and allergies.',
    image: '/images/herbs.png'
  },
  {
    title: 'Panchakarma Detox',
    duration: 'Multiple Days',
    price: 'Custom',
    desc: 'A comprehensive, personalized detoxification program guided by our expert doctors to cleanse the body at a cellular level.',
    image: '/images/spa.png'
  },
  {
    title: 'Ayurvedic Facial',
    duration: '45 mins',
    price: '$65',
    desc: 'A luxurious facial treatment using organic herbs, floral waters, and pure oils to rejuvenate and restore your natural glow.',
    image: '/images/hero.png'
  }
];

const Services = () => {
  const [isPlayingFull, setIsPlayingFull] = useState(false);

  const toggleFullVideo = () => {
    setIsPlayingFull(prev => !prev);
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      <div className="container py-12">
        
        {/* Video Showcase Section */}
        <div style={{ marginBottom: 'var(--space-12)' }}>
          <div className="text-center mb-8">
            <h1 style={{ fontSize: '3.5rem', marginBottom: 'var(--space-4)', background: 'var(--gradient-dark)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Experience True <span style={{ color: 'var(--color-accent)', WebkitTextFillColor: 'initial' }}>Healing</span>
            </h1>
            <p style={{ color: 'var(--color-text-muted)', maxWidth: '700px', margin: '0 auto', fontSize: '1.2rem' }}>
              Watch to unveil the magical tranquility of our premium Ayurvedic therapies, tailored for absolute rejuvenation.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            style={{ 
              position: 'relative', 
              width: '100%', 
              height: '500px', 
              borderRadius: 'var(--radius-xl)', 
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(10, 34, 19, 0.2)',
              border: '4px solid var(--color-surface)'
            }}
          >
            <iframe 
              src={isPlayingFull 
                ? "https://www.youtube.com/embed/kH_4xZfzLN8?autoplay=1&mute=0&controls=1&showinfo=0"
                : "https://www.youtube.com/embed/kH_4xZfzLN8?autoplay=1&mute=1&loop=1&controls=0&playlist=kH_4xZfzLN8&playsinline=1&showinfo=0&disablekb=1"
              }
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Shirodhara Treatment"
            ></iframe>
            
            {/* Overlay */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'linear-gradient(to top, rgba(10,34,19,0.7) 0%, transparent 50%)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: 'var(--space-6)',
              opacity: isPlayingFull ? 0 : 1,
              pointerEvents: isPlayingFull ? 'none' : 'auto',
              transition: 'opacity 0.3s ease'
            }}>
              <div>
                <span style={{ 
                  display: 'inline-block', padding: '6px 12px', background: 'var(--gradient-gold)', 
                  color: 'var(--color-primary)', borderRadius: '20px', fontWeight: 600, fontSize: '0.8rem',
                  marginBottom: '10px'
                }}>Featured</span>
                <h2 style={{ color: '#fff', fontSize: '2rem', marginBottom: '10px' }}>The Shirodhara Experience</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleFullVideo}
                    style={{
                      width: '50px', height: '50px', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.4)', color: '#fff',
                      cursor: 'pointer'
                    }}
                  >
                    <Play fill="#fff" size={24} />
                  </motion.button>
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>Play Full Video</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="text-center mb-8 mt-12">
          <h2 style={{ fontSize: '2.5rem', color: 'var(--color-primary)' }}>Our Signature Treatments</h2>
          <div style={{ width: '60px', height: '4px', background: 'var(--gradient-gold)', margin: '20px auto', borderRadius: '2px' }}></div>
        </div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-3 gap-6"
        >
          {services.map((service, idx) => (
            <motion.div 
              key={idx}
              variants={cardVariants}
              whileHover={{ y: -12 }}
              style={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-md)',
                transition: 'all var(--transition-normal)',
                border: '1px solid rgba(212, 175, 55, 0.1)'
              }}
            >
              <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={service.image} 
                  alt={service.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform var(--transition-slow)' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.9)', padding: '5px 10px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                   <Star size={14} fill="var(--color-accent)" color="var(--color-accent)" /> Premium
                </div>
              </div>
              <div style={{ padding: 'var(--space-6)' }}>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>{service.title}</h3>
                
                <div style={{ display: 'flex', gap: '15px', marginBottom: 'var(--space-4)', fontSize: '0.9rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-primary-light)', background: '#F1E5AC', padding: '4px 10px', borderRadius: '4px' }}>{service.duration}</span>
                  <span style={{ fontWeight: 600, color: '#FFFFFF', background: 'var(--gradient-dark)', padding: '4px 10px', borderRadius: '4px' }}>{service.price}</span>
                </div>
                
                <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-5)', fontSize: '1rem', lineHeight: 1.6 }}>
                  {service.desc}
                </p>
                <Link to="/booking" className="btn btn-primary" style={{ width: '100%' }}>
                  Book Session <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Call to Action */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div style={{ 
            display: 'inline-block', 
            background: 'var(--gradient-dark)', 
            color: '#fff', 
            padding: 'var(--space-8)', 
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 15px 30px rgba(10, 34, 19, 0.3)',
            maxWidth: '800px',
            width: '100%',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h3 style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-2)', fontSize: '2rem' }}>Need a Custom Wellness Plan?</h3>
              <p style={{ marginBottom: 'var(--space-6)', opacity: 0.9, fontSize: '1.2rem' }}>Consult with our Ayurvedic Doctors for a personalized treatment schedule.</p>
              <Link to="/booking" className="btn btn-accent" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>Schedule Consultation <ArrowRight size={20} /></Link>
            </div>
            {/* Background design elements */}
            <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'var(--color-accent)', filter: 'blur(100px)', opacity: 0.2, zIndex: 0 }}></div>
            <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '200px', height: '200px', background: 'var(--color-primary-light)', filter: 'blur(100px)', opacity: 0.5, zIndex: 0 }}></div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Services;
