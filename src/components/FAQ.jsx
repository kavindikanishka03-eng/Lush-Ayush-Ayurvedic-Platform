import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqData = [
  {
    question: "What should I expect during my first Ayurvedic consultation?",
    answer: "Your first visit includes a comprehensive assessment of your Dosha (body type) through pulse diagnosis (Nadi Pariksha) and lifestyle evaluation. Our experts will then recommend a personalized diet and treatment plan."
  },
  {
    question: "Are your ingredients 100% natural and organic?",
    answer: "Yes, all our herbs and oils are 100% organic, sustainably sourced, and prepared according to authentic Ayurvedic traditions to ensure maximum purity and potency."
  },
  {
    question: "How long does a typical treatment session last?",
    answer: "Most of our signature therapies last between 60 to 90 minutes. However, full-day retreat packages and specific Panchakarma treatments may vary in duration."
  },
  {
    question: "Do I need to follow a specific diet before coming?",
    answer: "While not strictly required, we recommend a light vegetarian meal at least 2 hours before your session. Avoid caffeine and alcohol for optimal relaxation."
  }
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <section className="py-12" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container">
        <div className="text-center mb-8">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
            <HelpCircle size={32} color="var(--color-accent)" />
            Queries We Can Answer
          </h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Find answers to common questions about our therapies and approach.
          </p>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {faqData.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              style={{
                marginBottom: '1rem',
                backgroundColor: 'var(--color-surface)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)',
                overflow: 'hidden',
                border: '1px solid rgba(212, 175, 55, 0.1)'
              }}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                style={{
                  width: '100%',
                  padding: 'var(--space-4)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '1.2rem',
                  fontWeight: 500,
                  color: 'var(--color-primary)'
                }}
              >
                {faq.question}
                <motion.div
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown color="var(--color-accent)" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div style={{ 
                      padding: '0 var(--space-4) var(--space-4) var(--space-4)', 
                      color: 'var(--color-text-muted)',
                      lineHeight: 1.6
                    }}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
