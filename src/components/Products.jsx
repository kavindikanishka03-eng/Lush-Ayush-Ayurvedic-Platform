import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: "Pure Ashwagandha Root Extract",
    description: "Premium stress relief and vitality booster. Hand-harvested from organic farms.",
    priceUSD: 24.99,
    priceLKR: 7500,
    image: "/images/product1.jpg"
  },
  {
    id: 2,
    name: "Kumkumadi Night Serum",
    description: "Authentic Ayurvedic recipe with rare saffron for radiant, youthful skin.",
    priceUSD: 45.00,
    priceLKR: 13500,
    image: "/images/product2.jpg"
  },
  {
    id: 3,
    name: "Triphala Digestive Detox",
    description: "Ancient blend of three potent fruits for ultimate gut health and natural cleansing.",
    priceUSD: 19.50,
    priceLKR: 5850,
    image: "/images/product3.jpg"
  },
  {
    id: 4,
    name: "Brahmi Mind Elixir",
    description: "Enhance focus, memory, and cognitive harmony with this sacred organic herb oil.",
    priceUSD: 28.00,
    priceLKR: 8400,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800"
  }
];

export default function Products() {
  const { addToCart } = useCart();
  const [addedMap, setAddedMap] = useState({});

  const handleAddToCart = (product) => {
    addToCart(product);
    
    // Set notification state for this specific product ID
    setAddedMap(prev => ({ ...prev, [product.id]: true }));

    // Automatically hide notification message after 3 seconds
    setTimeout(() => {
      setAddedMap(prev => ({ ...prev, [product.id]: false }));
    }, 3000);
  };

  return (
    <section className="py-12" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="container">
        <div className="text-center mb-8">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>Lush Ayush Products</h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '600px', margin: '0 auto' }}>
            Bring the healing power of our luxury Ayurveda home. 100% natural, potent, and ethically crafted medicines and elixirs.
          </p>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-6)' }}>
          {products.map((product, idx) => {
            const isAdded = addedMap[product.id];

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  transition: 'all var(--transition-normal)'
                }}
                whileHover={{ y: -6, boxShadow: 'var(--shadow-lg)' }}
              >
                <div style={{ height: '240px', overflow: 'hidden' }}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                  />
                </div>
                
                <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-primary)', lineHeight: 1.3 }}>{product.name}</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', flexGrow: 1, lineHeight: 1.5 }}>
                    {product.description}
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '1.25rem', 
                    borderTop: '1px solid rgba(10,34,19,0.08)', 
                    paddingTop: '1rem' 
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: '1.3rem' }}>
                        ${product.priceUSD.toFixed(2)}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#AA8222', fontWeight: 600 }}>
                        LKR {product.priceLKR.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleAddToCart(product)}
                    className="btn btn-primary" 
                    style={{ 
                      width: '100%', 
                      justifyContent: 'center',
                      background: isAdded ? '#166534' : 'var(--color-primary)',
                      color: isAdded ? '#ffffff' : 'var(--color-accent)',
                      border: '1px solid var(--color-accent)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {isAdded ? (
                      <>
                        <CheckCircle2 size={18} color="#D4AF37" /> Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={18} /> Add to Cart
                      </>
                    )}
                  </button>

                  {/* Notification Message Directly Below Product Button */}
                  <AnimatePresence>
                    {isAdded && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -5, height: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{
                          marginTop: '0.75rem',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          backgroundColor: '#FAF6ED',
                          border: '1px solid #D4AF37',
                          color: '#0A2213',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          boxShadow: '0 4px 12px rgba(10,34,19,0.06)'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <CheckCircle2 size={16} color="#166534" />
                            <span>Added to Cart!</span>
                          </div>
                          <Link to="/checkout" style={{ color: '#AA8222', fontWeight: 700, textDecoration: 'underline', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            Checkout <ArrowRight size={13} />
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
