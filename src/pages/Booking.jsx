import { motion } from 'framer-motion';
import { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, CheckCircle } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4 } }
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid #E2E8F0',
  outline: 'none',
  fontSize: '1rem',
  fontFamily: 'var(--font-body)',
  backgroundColor: '#F8FAFC',
  transition: 'border-color var(--transition-fast)'
};

const Booking = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, integrate with backend here
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ paddingTop: '100px', minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      <div className="container py-12">
        <div className="grid grid-cols-2 gap-6" style={{ alignItems: 'flex-start' }}>
          
          {/* Info Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{ paddingRight: 'var(--space-6)' }}
          >
            <h1 style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>Book Your Journey to <span style={{ color: 'var(--color-accent)' }}>Wellness</span></h1>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-8)', fontSize: '1.1rem' }}>
              Reserve your appointment at Lush Ayush. Whether you need a relaxing massage or a comprehensive detox, our experts are here to help.
            </p>
            
            <img src="/images/herbs.png" alt="Ayurveda Herbs" style={{ width: '100%', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', marginBottom: 'var(--space-6)' }} />
            
            <div style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
              <h4 style={{ color: 'var(--color-primary)', marginBottom: '10px' }}>Opening Hours</h4>
              <ul style={{ listStyle: 'none', color: 'var(--color-text-muted)', fontSize: '0.95rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}><span>Monday - Friday</span> <span>09:00 AM - 08:00 PM</span></li>
                <li style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}><span>Saturday - Sunday</span> <span>10:00 AM - 06:00 PM</span></li>
              </ul>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ backgroundColor: 'var(--color-surface)', padding: 'var(--space-8)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' }}
          >
            {submitted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: 'var(--space-8) 0' }}
              >
                <CheckCircle size={64} color="var(--color-accent)" style={{ margin: '0 auto var(--space-4)' }} />
                <h2 style={{ marginBottom: 'var(--space-2)' }}>Booking Confirmed!</h2>
                <p style={{ color: 'var(--color-text-muted)' }}>Thank you for choosing Lush Ayush. We will send you a confirmation email shortly.</p>
                <button className="btn btn-primary mt-12" onClick={() => setSubmitted(false)}>Book Another Session</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ marginBottom: 'var(--space-6)', fontSize: '1.5rem', color: 'var(--color-primary)' }}>Reservation Form</h3>
                
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94A3B8' }} />
                    <input type="text" style={{ ...inputStyle, paddingLeft: '40px' }} placeholder="John Doe" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6" style={{ marginBottom: 'var(--space-4)' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Phone</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94A3B8' }} />
                      <input type="tel" style={{ ...inputStyle, paddingLeft: '40px' }} placeholder="+94 XX XXX XXXX" required />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Email</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94A3B8' }} />
                      <input type="email" style={{ ...inputStyle, paddingLeft: '40px' }} placeholder="john@example.com" required />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Select Treatment</label>
                  <select style={inputStyle} required>
                    <option value="">-- Choose a service --</option>
                    <option value="abhyanga">Abhyanga Massage</option>
                    <option value="shirodhara">Shirodhara Treatment</option>
                    <option value="udvartana">Udvartana (Herbal Scrub)</option>
                    <option value="nasya">Nasya Therapy</option>
                    <option value="panchakarma">Panchakarma Detox</option>
                    <option value="consultation">Doctor Consultation</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6" style={{ marginBottom: 'var(--space-6)' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Date</label>
                    <div style={{ position: 'relative' }}>
                      <Calendar size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94A3B8' }} />
                      <input type="date" style={{ ...inputStyle, paddingLeft: '40px' }} required />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, fontSize: '0.9rem' }}>Preferred Time</label>
                    <div style={{ position: 'relative' }}>
                      <Clock size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: '#94A3B8' }} />
                      <input type="time" style={{ ...inputStyle, paddingLeft: '40px' }} required />
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '16px', fontSize: '1.1rem' }}>
                  Confirm Booking
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Booking;
