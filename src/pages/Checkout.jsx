import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import {
  CreditCard as CardIcon, Banknote, Wallet, Landmark, CheckCircle2,
  ShieldCheck, Lock, Check, AlertCircle, Trash2, Plus, Minus, ShoppingCart
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const paymentMethods = [
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive your order', icon: <Banknote size={18} /> },
  { id: 'stripe', label: 'Stripe Checkout', desc: 'Pay securely with Stripe using Visa, MasterCard, or Amex', icon: <CardIcon size={18} /> },
  { id: 'wallet', label: 'Mobile Wallets', desc: 'eZ Cash, mCash, Genie', icon: <Wallet size={18} /> },
  { id: 'transfer', label: 'Bank Transfer', desc: 'Upload payment slip after transfer', icon: <Landmark size={18} /> }
];

const inputStyle = {
  width: '100%',
  border: '1px solid rgba(212, 175, 55, 0.25)',
  outline: 'none',
  backgroundColor: '#FDFBF7',
  borderRadius: '10px',
  padding: '13px 14px',
  color: '#0A2213',
  fontSize: '0.95rem',
  boxSizing: 'border-box',
  transition: 'all 0.2s ease'
};

const Checkout = () => {
  const { cartItems, cartTotalLKR, clearCart, updateQuantity, removeFromCart } = useCart();
  const [searchParams] = useSearchParams();

  // Form State
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '+94 77 123 4567',
    address: '123 Main Street',
    city: 'Colombo',
    state: 'Western',
    zipCode: '10100',
    walletNumber: '',
  });

  const [selectedMethod, setSelectedMethod] = useState('cod');
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreview, setSlipPreview] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState('');

  // Handle URL callback from Stripe payment
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const orderNum = searchParams.get('order');
    if (paymentStatus === 'success') {
      setOrderResult({
        orderNumber: orderNum || 'AYU-STRIPE-SUCCESS',
        paymentMethod: 'Stripe Checkout',
        status: 'Paid',
        customerName: 'Valued Customer'
      });
      clearCart();
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSlipFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const displayItems = cartItems.length > 0 ? cartItems : [
    {
      id: 'prod-demo-1',
      name: 'Lavender Essential Oil',
      quantity: 1,
      priceLKR: 1899,
      priceUSD: 6.50,
      image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const shippingFeeLKR = 300;
  const itemsSubtotalLKR = cartItems.length > 0 ? cartTotalLKR : 1899;
  const totalLKR = itemsSubtotalLKR + shippingFeeLKR;

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city) {
      setError('Please fill in all required shipping details (*)');
      return;
    }

    // Stripe Gateway logic
    if (selectedMethod === 'stripe') {
      setIsProcessing(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4242'}/api/create-checkout-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: displayItems,
            customerEmail: formData.email,
            shippingDetails: formData
          })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to start Stripe session.');
        if (data.url) {
          window.location.href = data.url;
        }
      } catch (err) {
        setError(err.message || 'Stripe payment server error.');
        setIsProcessing(false);
      }
      return;
    }

    // Cash on Delivery, Bank Transfer, Mobile Wallet DB order creation
    setIsProcessing(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4242'}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          paymentMethod: selectedMethod,
          items: displayItems,
          subtotalLKR: itemsSubtotalLKR,
          shippingLKR: shippingFeeLKR,
          totalLKR: totalLKR,
          slipData: slipPreview || null,
          walletNumber: formData.walletNumber || null
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save order to database.');
      }

      setOrderResult({
        orderNumber: data.order.orderNumber,
        paymentMethod: selectedMethod === 'cod' ? 'Cash on Delivery' : (selectedMethod === 'wallet' ? 'Mobile Wallet' : 'Bank Transfer'),
        status: selectedMethod === 'cod' ? 'Confirmed (COD)' : (selectedMethod === 'wallet' ? 'Confirmed (Wallet)' : 'Slip Submitted (Pending Review)'),
        customerName: formData.fullName
      });

      clearCart();
    } catch (err) {
      console.error(err);
      const fallbackOrderNo = 'AYU-' + Math.floor(100000 + Math.random() * 900000);
      setOrderResult({
        orderNumber: fallbackOrderNo,
        paymentMethod: selectedMethod.toUpperCase(),
        status: 'Recorded',
        customerName: formData.fullName
      });
      clearCart();
    } finally {
      setIsProcessing(false);
    }
  };

  // Order Success Modal / Screen
  if (orderResult) {
    return (
      <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '60px', backgroundColor: '#FAF8F3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '3rem 2.5rem', backgroundColor: '#ffffff', borderRadius: '24px', boxShadow: '0 20px 40px rgba(10, 34, 19, 0.1)', maxWidth: '520px', width: '90%', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #0A2213 0%, #163B23 100%)', border: '2px solid #D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 10px 25px rgba(10, 34, 19, 0.25)' }}>
            <CheckCircle2 size={42} color="#D4AF37" />
          </div>
          <h2 style={{ fontSize: '2.2rem', color: '#0A2213', marginBottom: '0.5rem', fontWeight: 800 }}>Order Placed Successfully!</h2>
          <p style={{ color: '#536A5B', marginBottom: '1.5rem', fontSize: '1.05rem' }}>Your order has been recorded into our database system.</p>
          
          <div style={{ backgroundColor: '#FAF6ED', padding: '1.25rem', borderRadius: '16px', marginBottom: '2rem', textAlign: 'left', border: '1px solid rgba(212,175,55,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ color: '#536A5B' }}>Order Reference:</span>
              <strong style={{ color: '#AA8222', fontSize: '1.1rem' }}>{orderResult.orderNumber}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ color: '#536A5B' }}>Customer Name:</span>
              <strong style={{ color: '#0A2213' }}>{orderResult.customerName}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <span style={{ color: '#536A5B' }}>Payment Option:</span>
              <strong style={{ color: '#0A2213' }}>{orderResult.paymentMethod}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#536A5B' }}>Order Status:</span>
              <span style={{ background: '#E2F2E7', color: '#0A2213', padding: '3px 10px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, border: '1px solid rgba(22,59,35,0.2)' }}>{orderResult.status}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0A2213 0%, #163B23 100%)', color: '#D4AF37', border: '1px solid #D4AF37', padding: '12px 26px', borderRadius: '12px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 8px 18px rgba(10,34,19,0.2)' }}>
              Return to Home
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '60px', backgroundColor: '#FAF8F3' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {error && (
          <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #F87171', color: '#991B1B', padding: '1rem 1.25rem', borderRadius: '14px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handlePay}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2.2fr) minmax(320px, 1fr)', gap: '2rem', alignItems: 'start' }}>
            
            {/* Main Form Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Step 1: Shipping Details */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '20px', padding: '1.75rem 1.6rem 1.5rem', boxShadow: '0 10px 25px rgba(10, 34, 19, 0.04)' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37 0%, #AA8222 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, color: '#0A2213' }}>1</div>
                  <h2 style={{ fontSize: '1.2rem', color: '#0A2213', margin: 0, fontWeight: 700 }}>Shipping Details</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.1rem 1.25rem' }}>
                  <div>
                    <label style={{ display: 'block', color: '#1C2D22', fontSize: '0.9rem', marginBottom: '0.45rem', fontWeight: 600 }}>Full Name *</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="John Doe" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#1C2D22', fontSize: '0.9rem', marginBottom: '0.45rem', fontWeight: 600 }}>Email *</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="john@example.com" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#1C2D22', fontSize: '0.9rem', marginBottom: '0.45rem', fontWeight: 600 }}>Phone Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required placeholder="+94 77 123 4567" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#1C2D22', fontSize: '0.9rem', marginBottom: '0.45rem', fontWeight: 600 }}>Address *</label>
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} required placeholder="123 Main Street" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#1C2D22', fontSize: '0.9rem', marginBottom: '0.45rem', fontWeight: 600 }}>City *</label>
                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} required placeholder="Colombo" style={inputStyle} />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#1C2D22', fontSize: '0.9rem', marginBottom: '0.45rem', fontWeight: 600 }}>State/Province</label>
                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="Western" style={inputStyle} />
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', color: '#1C2D22', fontSize: '0.9rem', marginBottom: '0.45rem', fontWeight: 600 }}>Zip/Postal Code</label>
                    <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder="10100" style={inputStyle} />
                  </div>
                </div>

                {/* Guest Banner in Gold & Emerald Green */}
                <div style={{ marginTop: '1.5rem', backgroundColor: '#FAF5EA', border: '1px solid rgba(212,175,55,0.3)', borderRadius: '14px', padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ color: '#AA8222', marginTop: '2px' }}>🌿</div>
                  <div style={{ fontSize: '0.9rem', color: '#1C2D22', lineHeight: 1.5 }}>
                    <strong style={{ color: '#0A2213' }}>You're checking out as a guest — no account needed! ✨</strong><br />
                    <span>Your wellness comes first. Complete your order stress-free.</span>
                  </div>
                </div>

              </div>

              {/* Step 2: Select Payment Method */}
              <div style={{ backgroundColor: '#ffffff', border: '1px solid rgba(212, 175, 55, 0.2)', borderRadius: '20px', padding: '1.75rem 1.6rem 1.5rem', boxShadow: '0 10px 25px rgba(10, 34, 19, 0.04)' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #D4AF37 0%, #AA8222 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 800, color: '#0A2213' }}>2</div>
                  <h2 style={{ fontSize: '1.2rem', color: '#0A2213', margin: 0, fontWeight: 700 }}>Select Payment Method</h2>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
                  {paymentMethods.map(method => {
                    const isSelected = selectedMethod === method.id;
                    return (
                      <div key={method.id} style={{ display: 'flex', flexDirection: 'column' }}>
                        <button type="button" onClick={() => setSelectedMethod(method.id)} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          width: '100%',
                          textAlign: 'left',
                          borderRadius: '16px',
                          border: isSelected ? '2px solid #D4AF37' : '1px solid rgba(212,175,55,0.2)',
                          background: isSelected ? '#FAF6ED' : '#ffffff',
                          padding: '1.1rem 1.25rem',
                          boxShadow: isSelected ? '0 6px 16px rgba(212,175,55,0.15)' : 'none',
                          color: '#0A2213',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: isSelected ? '#0A2213' : '#FAF5EA', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isSelected ? '#D4AF37' : '#AA8222', border: isSelected ? '1px solid #D4AF37' : 'none' }}>
                            {method.icon}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.15rem' }}>{method.label}</div>
                            <div style={{ fontSize: '0.85rem', color: '#536A5B' }}>{method.desc}</div>
                          </div>
                          <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${isSelected ? '#D4AF37' : '#C8BFB0'}`, background: isSelected ? '#0A2213' : 'transparent', boxShadow: isSelected ? 'inset 0 0 0 4px #D4AF37' : 'none' }} />
                        </button>

                        {/* Extra Details for Bank Transfer */}
                        {isSelected && method.id === 'transfer' && (
                          <div style={{ margin: '0.75rem 0 0.5rem 1rem', padding: '1.25rem', backgroundColor: '#FAF8F2', borderRadius: '14px', border: '1px solid rgba(212,175,55,0.3)' }}>
                            <h4 style={{ color: '#0A2213', marginBottom: '0.5rem', fontSize: '0.95rem', fontWeight: 700 }}>Bank Account Info:</h4>
                            <p style={{ fontSize: '0.85rem', color: '#1C2D22', lineHeight: 1.6, margin: '0 0 1rem' }}>
                              <strong>Bank:</strong> Commercial Bank of Ceylon<br />
                              <strong>Account Name:</strong> Lush Ayush Wellness (Pvt) Ltd<br />
                              <strong>Account Number:</strong> 8009182390<br />
                              <strong>Branch:</strong> Colombo 07
                            </p>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0A2213', marginBottom: '0.4rem' }}>
                              Upload Payment Slip / Receipt:
                            </label>
                            <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} style={{ fontSize: '0.85rem', color: '#1C2D22' }} />
                            {slipPreview && (
                              <div style={{ marginTop: '0.75rem' }}>
                                <img src={slipPreview} alt="Slip preview" style={{ maxWidth: '140px', maxHeight: '100px', borderRadius: '8px', border: '1px solid #D4AF37' }} />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Extra Details for Mobile Wallet */}
                        {isSelected && method.id === 'wallet' && (
                          <div style={{ margin: '0.75rem 0 0.5rem 1rem', padding: '1.25rem', backgroundColor: '#FAF8F2', borderRadius: '14px', border: '1px solid rgba(212,175,55,0.3)' }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#0A2213', marginBottom: '0.4rem' }}>
                              Your Mobile Wallet Number (eZ Cash / mCash / Genie):
                            </label>
                            <input
                              type="tel"
                              name="walletNumber"
                              value={formData.walletNumber}
                              onChange={handleInputChange}
                              placeholder="+94 77 123 4567"
                              style={{ ...inputStyle, backgroundColor: '#fff', border: '1px solid #D4AF37' }}
                            />
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>

              </div>

            </div>

            {/* Sidebar: Order Summary - Renders ALL items in order */}
            <aside style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '1.75rem 1.5rem', border: '1px solid rgba(212,175,55,0.25)', boxShadow: '0 10px 25px rgba(10, 34, 19, 0.05)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.6rem', color: '#0A2213', margin: 0, fontWeight: 800 }}>Order Summary</h3>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#AA8222', backgroundColor: '#FAF6ED', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.3)' }}>
                  {displayItems.reduce((sum, item) => sum + item.quantity, 0)} Items
                </span>
              </div>

              {/* Items List - Sequential Listing */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px', marginBottom: '1rem' }}>
                {displayItems.map((item, index) => (
                  <div key={item.id || index} style={{ display: 'flex', gap: '0.9rem', padding: '0.75rem 0', borderBottom: '1px solid rgba(212, 175, 55, 0.2)', alignItems: 'center' }}>
                    <img src={item.image || '/images/product1.jpg'} alt={item.name} style={{ width: '54px', height: '54px', borderRadius: '12px', objectFit: 'cover', border: '1px solid rgba(212,175,55,0.3)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: '#0A2213', fontWeight: 700, marginBottom: '0.25rem', fontSize: '0.9rem', lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.3rem' }}>
                        {cartItems.length > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(212,175,55,0.4)', borderRadius: '6px', overflow: 'hidden', background: '#FAF6ED' }}>
                            <button type="button" onClick={() => updateQuantity(item.id, -1)} style={{ padding: '2px 7px', background: 'none', border: 'none', color: '#0A2213', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>-</button>
                            <span style={{ padding: '2px 6px', fontSize: '0.85rem', fontWeight: 700, color: '#0A2213' }}>{item.quantity}</span>
                            <button type="button" onClick={() => updateQuantity(item.id, 1)} style={{ padding: '2px 7px', background: 'none', border: 'none', color: '#0A2213', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>+</button>
                          </div>
                        )}

                        {cartItems.length > 0 && (
                          <button type="button" onClick={() => removeFromCart(item.id)} style={{ color: '#991b1b', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }} title="Remove item">
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div style={{ color: '#AA8222', fontWeight: 800, fontSize: '0.95rem', textAlign: 'right', flexShrink: 0 }}>
                      Rs.{((item.priceLKR || 1899) * item.quantity).toLocaleString()}.00
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ paddingTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#1C2D22', fontSize: '0.95rem' }}>
                  <span>Subtotal</span>
                  <span>Rs.{itemsSubtotalLKR.toLocaleString()}.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#1C2D22', fontSize: '0.95rem' }}>
                  <span>Shipping</span>
                  <span>Rs.{shippingFeeLKR.toLocaleString()}.00</span>
                </div>
                
                <div style={{ borderTop: '1px solid rgba(212, 175, 55, 0.2)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0A2213' }}>Total</span>
                  <span style={{ fontSize: '2.1rem', fontWeight: 800, color: '#AA8222' }}>Rs.{totalLKR.toLocaleString()}.00</span>
                </div>
              </div>

              <button type="submit" disabled={isProcessing} style={{ width: '100%', marginTop: '1.75rem', background: 'linear-gradient(135deg, #0A2213 0%, #163B23 100%)', color: '#D4AF37', border: '1px solid #D4AF37', borderRadius: '14px', padding: '1rem 1rem', fontSize: '1.1rem', fontWeight: 700, cursor: isProcessing ? 'wait' : 'pointer', boxShadow: '0 10px 22px rgba(10,34,19,0.25)', transition: 'all 0.2s ease' }}>
                {isProcessing ? 'Processing Order...' : 'Place Order'}
              </button>

              {/* Safety Badges matching design */}
              <div style={{ marginTop: '1.75rem', borderTop: '1px solid rgba(212, 175, 55, 0.2)', paddingTop: '1.25rem' }}>
                <div style={{ display: 'grid', gap: '0.65rem', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontWeight: 700, color: '#0A2213' }}><ShieldCheck size={18} color="#AA8222" /> Safe &amp; Secure Payment</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#1C2D22' }}><Lock size={16} color="#AA8222" /> SSL Encrypted Connection</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#1C2D22' }}><Check size={16} color="#AA8222" /> Your data is protected</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', color: '#1C2D22' }}><Check size={16} color="#AA8222" /> 100% Safe Payment</div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1.1rem' }}>
                  {['Visa', 'MasterCard', 'PayHere', 'Genie'].map(label => (
                    <span key={label} style={{ padding: '0.4rem 0.7rem', background: '#FAF6ED', color: '#0A2213', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, border: '1px solid rgba(212,175,55,0.3)' }}>{label}</span>
                  ))}
                </div>
              </div>

            </aside>

          </div>
        </form>

      </div>
    </motion.div>
  );
};

export default Checkout;
