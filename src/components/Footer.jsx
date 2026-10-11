import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-surface)', paddingTop: 'var(--space-12)', paddingBottom: 'var(--space-4)' }}>
      <div className="container">
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)' }}>
              <Leaf size={28} color="var(--color-accent)" />
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 600 }}>
                Lush <span style={{ color: 'var(--color-accent)' }}>Ayush</span>
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', marginBottom: 'var(--space-4)' }}>
              Experience the ancient healing art of Ayurveda in a luxurious, modern setting. Restore your natural balance and vitality.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-4)' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><a href="#" style={{ color: 'rgba(255,255,255,0.7)' }}>About Us</a></li>
              <li><a href="/services" style={{ color: 'rgba(255,255,255,0.7)' }}>Treatments</a></li>
              <li><a href="/booking" style={{ color: 'rgba(255,255,255,0.7)' }}>Book Appointment</a></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: 'var(--color-accent)', marginBottom: 'var(--space-4)' }}>Contact</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <li style={{ display: 'flex', gap: '10px', color: 'rgba(255,255,255,0.7)' }}><Phone size={20} /> +94 11 234 5678</li>
              <li style={{ display: 'flex', gap: '10px', color: 'rgba(255,255,255,0.7)' }}><Mail size={20} /> info@lushayush.com</li>
              <li style={{ display: 'flex', gap: '10px', color: 'rgba(255,255,255,0.7)' }}><MapPin size={20} /> 123 Ayurveda Retreat Rd, Colombo, Sri Lanka</li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 'var(--space-4)', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
          &copy; {new Date().getFullYear()} Lush Ayush Ayurveda. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
