import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, RefreshCw, ShieldCheck, CheckCircle2 } from 'lucide-react';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4242'}/api/orders`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to load orders.');
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
      setError('Unable to fetch database records. Make sure backend server is running (`npm run dev:server`).');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newPaymentStatus, newOrderStatus) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4242'}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentStatus: newPaymentStatus,
          orderStatus: newOrderStatus
        })
      });
      if (response.ok) {
        fetchOrders();
        if (selectedOrder && (selectedOrder.id === orderId || selectedOrder.order_number === orderId)) {
          setSelectedOrder(prev => prev ? { ...prev, payment_status: newPaymentStatus, order_status: newOrderStatus } : null);
        }
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const filteredOrders = orders.filter(o =>
    (o.order_number || '').toLowerCase().includes(search.toLowerCase()) ||
    (o.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (o.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (o.payment_method || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '60px', backgroundColor: '#FAF8F3' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
              <div style={{ background: '#0A2213', color: '#D4AF37', border: '1px solid #D4AF37', padding: '6px', borderRadius: '10px' }}><Database size={22} /></div>
              <h1 style={{ fontSize: '2rem', color: '#0A2213', margin: 0, fontWeight: 800 }}>SQLite Database Admin</h1>
            </div>
            <p style={{ color: '#536A5B', margin: 0 }}>View and manage customer orders automatically saved into database</p>
          </div>

          <button onClick={fetchOrders} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#0A2213', border: '1px solid #D4AF37', color: '#D4AF37', padding: '10px 18px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
            <RefreshCw size={16} /> Refresh Records
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(212,175,55,0.2)', boxShadow: '0 4px 14px rgba(10,34,19,0.04)' }}>
            <div style={{ color: '#536A5B', fontSize: '0.9rem', marginBottom: '0.3rem' }}>Total Database Orders</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0A2213' }}>{orders.length}</div>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(212,175,55,0.2)', boxShadow: '0 4px 14px rgba(10,34,19,0.04)' }}>
            <div style={{ color: '#536A5B', fontSize: '0.9rem', marginBottom: '0.3rem' }}>Database File</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#AA8222' }}>server/database.sqlite</div>
          </div>
          <div style={{ backgroundColor: '#ffffff', padding: '1.25rem 1.5rem', borderRadius: '16px', border: '1px solid rgba(212,175,55,0.2)', boxShadow: '0 4px 14px rgba(10,34,19,0.04)' }}>
            <div style={{ color: '#536A5B', fontSize: '0.9rem', marginBottom: '0.3rem' }}>Database Status</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#166534', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><ShieldCheck size={18} /> Active & Connected</div>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
          <Search size={18} color="#AA8222" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by Order #, Name, Email, or Payment Method..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.3)', backgroundColor: '#ffffff', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }}
          />
        </div>

        {/* Table Container */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid rgba(212,175,55,0.25)', boxShadow: '0 10px 25px rgba(10,34,19,0.05)', overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#536A5B' }}>Loading orders from SQLite database...</div>
          ) : error ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#b91c1c' }}>{error}</div>
          ) : filteredOrders.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#536A5B' }}>No database orders found. Place an order on the Checkout page to see it recorded here automatically!</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ backgroundColor: '#0A2213', borderBottom: '1px solid #D4AF37', color: '#D4AF37' }}>
                    <th style={{ padding: '14px 16px', fontWeight: 700 }}>Order #</th>
                    <th style={{ padding: '14px 16px', fontWeight: 700 }}>Customer</th>
                    <th style={{ padding: '14px 16px', fontWeight: 700 }}>Payment Method</th>
                    <th style={{ padding: '14px 16px', fontWeight: 700 }}>Total (Rs)</th>
                    <th style={{ padding: '14px 16px', fontWeight: 700 }}>Payment Status</th>
                    <th style={{ padding: '14px 16px', fontWeight: 700 }}>Created Date</th>
                    <th style={{ padding: '14px 16px', fontWeight: 700, textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid rgba(212,175,55,0.15)', transition: 'background-color 0.2s' }}>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#AA8222' }}>{order.order_number}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#0A2213' }}>{order.full_name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#536A5B' }}>{order.email}</div>
                      </td>
                      <td style={{ padding: '14px 16px', textTransform: 'uppercase', fontWeight: 600, color: '#1C2D22' }}>
                        {order.payment_method}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: 700, color: '#0A2213' }}>
                        Rs.{Number(order.total_lkr).toLocaleString()}.00
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          backgroundColor: order.payment_status === 'paid' ? '#DCFCE7' : (order.payment_status === 'slip_submitted' ? '#FEF3C7' : '#FAF6ED'),
                          color: order.payment_status === 'paid' ? '#166534' : (order.payment_status === 'slip_submitted' ? '#92400E' : '#AA8222'),
                          border: '1px solid rgba(212,175,55,0.2)'
                        }}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', color: '#536A5B', fontSize: '0.82rem' }}>
                        {order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <button onClick={() => setSelectedOrder(order)} style={{ background: '#0A2213', border: '1px solid #D4AF37', color: '#D4AF37', padding: '6px 12px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal for viewing order details */}
        {selectedOrder && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(10,34,19,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
            <div style={{ backgroundColor: '#ffffff', borderRadius: '24px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', border: '1px solid #D4AF37' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(212,175,55,0.2)', paddingBottom: '1rem' }}>
                <h3 style={{ margin: 0, color: '#0A2213', fontSize: '1.4rem' }}>Order Details: <span style={{ color: '#AA8222' }}>{selectedOrder.order_number}</span></h3>
                <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#0A2213' }}>✕</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', fontSize: '0.9rem', color: '#1C2D22' }}>
                <div><strong>Full Name:</strong> {selectedOrder.full_name}</div>
                <div><strong>Email:</strong> {selectedOrder.email}</div>
                <div><strong>Phone:</strong> {selectedOrder.phone}</div>
                <div><strong>City:</strong> {selectedOrder.city}</div>
                <div style={{ gridColumn: '1 / -1' }}><strong>Address:</strong> {selectedOrder.address}, {selectedOrder.state} {selectedOrder.zip_code}</div>
              </div>

              <div style={{ backgroundColor: '#FAF6ED', padding: '1rem', borderRadius: '14px', marginBottom: '1.5rem', border: '1px solid rgba(212,175,55,0.2)' }}>
                <h4 style={{ margin: '0 0 0.5rem', color: '#0A2213' }}>Purchased Items:</h4>
                {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px dashed rgba(212,175,55,0.3)' }}>
                    <span>{item.name} (x{item.quantity})</span>
                    <strong>Rs.{(item.priceLKR || 1899) * item.quantity}.00</strong>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', fontWeight: 800, color: '#AA8222', fontSize: '1.1rem' }}>
                  <span>Total Amount:</span>
                  <span>Rs.{Number(selectedOrder.total_lkr).toLocaleString()}.00</span>
                </div>
              </div>

              {selectedOrder.slip_data && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem', color: '#0A2213' }}>Bank Slip Image:</h4>
                  <img src={selectedOrder.slip_data} alt="Bank Slip" style={{ width: '100%', maxHeight: '250px', objectFit: 'contain', borderRadius: '12px', border: '1px solid #D4AF37' }} />
                </div>
              )}

              <div style={{ borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '1rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button onClick={() => handleUpdateStatus(selectedOrder.order_number, 'paid', 'confirmed')} style={{ backgroundColor: '#166534', color: '#ffffff', border: 'none', padding: '10px 16px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
                  Mark as Paid
                </button>
                <button onClick={() => setSelectedOrder(null)} style={{ backgroundColor: '#0A2213', color: '#D4AF37', border: '1px solid #D4AF37', padding: '10px 16px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
                  Close
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
};

export default AdminOrders;
