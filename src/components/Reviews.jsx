import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, User } from 'lucide-react';

const initialReviews = [
  {
    id: 1,
    name: "Elena Richardson",
    rating: 5,
    comment: "An absolute sanctuary! The Shirodhara treatment was deeply transformative. The therapists are highly intuitive and the ambiance is pure luxury.",
    date: "March 15, 2026"
  },
  {
    id: 2,
    name: "David Chen",
    rating: 5,
    comment: "I came in with chronic back pain, and after a week of personalized Abhyanga sessions, I feel completely renewed. The organic oils smell divine.",
    date: "April 2, 2026"
  }
];

export default function Reviews() {
  const [reviews, setReviews] = useState(initialReviews);
  const [newReview, setNewReview] = useState({ name: '', comment: '', rating: 5 });
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;
    
    const review = {
      ...newReview,
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
    
    setReviews([review, ...reviews]);
    setNewReview({ name: '', comment: '', rating: 5 });
    setHoverRating(0);
  };

  return (
    <section className="py-12" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}>
      <div className="container">
        <div className="text-center mb-8">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Guest Experiences</h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Read how Lush Ayush has transformed the well-being of our guests, and share your own journey.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6" style={{ alignItems: 'start' }}>
          
          {/* Reviews List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <AnimatePresence>
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  style={{
                    backgroundColor: 'var(--color-background)',
                    border: '1px solid rgba(212, 175, 55, 0.2)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-4)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ 
                        width: '40px', height: '40px', borderRadius: '50%', 
                        backgroundColor: 'var(--color-primary)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--color-accent)'
                      }}>
                        <User size={20} />
                      </div>
                      <div>
                        <h4 style={{ color: 'var(--color-primary)', fontSize: '1.1rem', margin: 0 }}>{review.name}</h4>
                        <span style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{review.date}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          fill={i < review.rating ? 'var(--color-accent)' : 'transparent'} 
                          color={i < review.rating ? 'var(--color-accent)' : 'rgba(10,34,19,0.1)'} 
                        />
                      ))}
                    </div>
                  </div>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6, fontStyle: 'italic' }}>
                    "{review.comment}"
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Add Review Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              backgroundColor: 'var(--color-primary)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-5)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <h3 style={{ color: 'var(--color-accent)', fontSize: '1.5rem', marginBottom: '1rem' }}>Share Your Experience</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff', fontWeight: 500 }}>Your Rating</label>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      style={{ padding: '5px' }}
                    >
                      <Star 
                        size={24} 
                        fill={(hoverRating || newReview.rating) >= star ? 'var(--color-accent)' : 'transparent'} 
                        color={(hoverRating || newReview.rating) >= star ? 'var(--color-accent)' : 'rgba(255,255,255,0.3)'} 
                        style={{ transition: 'all 0.2s' }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff', fontWeight: 500 }}>Your Name</label>
                <input 
                  type="text" 
                  required
                  value={newReview.name}
                  onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontFamily: 'inherit',
                    fontSize: '1rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#fff', fontWeight: 500 }}>Your Message</label>
                <textarea 
                  required
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Tell us about your treatment..."
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    color: '#fff',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: '0.5rem' }}>
                Submit Review <Send size={18} />
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
