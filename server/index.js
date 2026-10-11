import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbHelper } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20'
});

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  'http://127.0.0.1:5176',
  'http://127.0.0.1:5177'
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin) {
      callback(null, true);
      return;
    }

    const isAllowedOrigin = allowedOrigins.includes(origin) ||
      /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);

    if (isAllowedOrigin) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use('/api/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '10mb' })); // Support image base64 for bank slip upload

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'lush-ayush-payments', database: 'sqlite' });
});

// --- ORDERS API (SQLite Database) ---

// Create Order (Cash on Delivery, Bank Transfer, Mobile Wallet, Stripe)
app.post('/api/orders', async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      paymentMethod,
      items,
      subtotalLKR,
      shippingLKR,
      totalLKR,
      slipData,
      walletNumber
    } = req.body || {};

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty. Please add items to checkout.' });
    }

    // Payment status logic based on gateway method
    let initialPaymentStatus = 'pending';
    let initialOrderStatus = 'processing';

    if (paymentMethod === 'cod') {
      initialPaymentStatus = 'cash_on_delivery';
      initialOrderStatus = 'confirmed';
    } else if (paymentMethod === 'transfer') {
      initialPaymentStatus = 'slip_submitted';
      initialOrderStatus = 'pending_verification';
    } else if (paymentMethod === 'wallet') {
      initialPaymentStatus = 'wallet_paid';
      initialOrderStatus = 'confirmed';
    }

    const savedOrder = await dbHelper.createOrder({
      fullName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: initialPaymentStatus,
      orderStatus: initialOrderStatus,
      items,
      subtotalLKR,
      shippingLKR: shippingLKR || 300,
      totalLKR,
      slipData,
      walletNumber
    });

    console.log(`Order ${savedOrder.orderNumber} successfully saved to SQLite Database.`);
    return res.json({ success: true, order: savedOrder });
  } catch (err) {
    console.error('Failed to save order to SQLite database:', err);
    return res.status(500).json({ error: 'Failed to record order in database.' });
  }
});

// Get all orders from SQLite database (Admin endpoint)
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await dbHelper.getAllOrders();
    return res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    console.error('Error fetching orders:', err);
    return res.status(500).json({ error: 'Failed to fetch orders from database.' });
  }
});

// Get single order details
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await dbHelper.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    return res.json({ success: true, order });
  } catch (err) {
    console.error('Error fetching order by ID:', err);
    return res.status(500).json({ error: 'Failed to fetch order.' });
  }
});

// Update order status (Admin endpoint)
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { paymentStatus, orderStatus } = req.body || {};
    const result = await dbHelper.updateOrderStatus(req.params.id, paymentStatus, orderStatus);
    return res.json({ success: true, updated: result.updated });
  } catch (err) {
    console.error('Failed to update order status:', err);
    return res.status(500).json({ error: 'Failed to update order status.' });
  }
});

// --- BOOKINGS API ---

app.post('/api/bookings', async (req, res) => {
  try {
    const booking = await dbHelper.createBooking(req.body || {});
    return res.json({ success: true, booking });
  } catch (err) {
    console.error('Failed to save booking:', err);
    return res.status(500).json({ error: 'Failed to save booking.' });
  }
});

app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await dbHelper.getAllBookings();
    return res.json({ success: true, count: bookings.length, bookings });
  } catch (err) {
    console.error('Failed to fetch bookings:', err);
    return res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
});

// --- STRIPE CHECKOUT API ---

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { items = [], customerEmail, shippingDetails } = req.body || {};

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items were provided for checkout.' });
    }

    const totalUSD = items.reduce((sum, item) => {
      const unitPrice = Number(item.priceUSD || 0);
      const quantity = Number(item.quantity || 0);
      return sum + unitPrice * quantity;
    }, 0);

    const totalLKR = items.reduce((sum, item) => {
      const unitPrice = Number(item.priceLKR || 1899);
      const quantity = Number(item.quantity || 1);
      return sum + unitPrice * quantity;
    }, 0) + 300; // include shipping

    if (!Number.isFinite(totalUSD) || totalUSD <= 0) {
      return res.status(400).json({ error: 'Checkout total must be greater than zero.' });
    }

    // Save order in SQLite DB first as pending
    const dbOrder = await dbHelper.createOrder({
      fullName: shippingDetails?.fullName || 'Guest Customer',
      email: customerEmail || shippingDetails?.email || '',
      phone: shippingDetails?.phone || '',
      address: shippingDetails?.address || '',
      city: shippingDetails?.city || '',
      state: shippingDetails?.state || '',
      zipCode: shippingDetails?.zipCode || '',
      paymentMethod: 'stripe',
      paymentStatus: 'pending_stripe',
      orderStatus: 'processing',
      items,
      subtotalLKR: totalLKR - 300,
      shippingLKR: 300,
      totalLKR
    });

    const line_items = items.map((item) => ({
      price_data: {
        currency: 'usd',
        unit_amount: Math.round(Number(item.priceUSD || 0) * 100),
        product_data: {
          name: String(item.name || 'Ayurveda Treatment'),
          images: item.image ? [String(item.image)] : undefined
        }
      },
      quantity: Math.max(1, Number(item.quantity || 1))
    }));

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      success_url: `${frontendUrl}/checkout?payment=success&order=${dbOrder.orderNumber}`,
      cancel_url: `${frontendUrl}/checkout?payment=cancelled`,
      customer_email: customerEmail && customerEmail.includes('@') ? customerEmail : undefined,
      metadata: {
        source: 'lush-ayush',
        orderNumber: dbOrder.orderNumber,
        orderId: String(dbOrder.id),
        itemCount: String(items.length),
        totalUSD: String(totalUSD)
      },
      billing_address_collection: 'auto',
      allow_promotion_codes: true
    });

    return res.json({ url: session.url, orderNumber: dbOrder.orderNumber });
  } catch (error) {
    console.error('Failed to create Stripe checkout session:', error);
    return res.status(500).json({
      error: 'Unable to create Stripe checkout session. Please try again.'
    });
  }
});

app.post('/api/webhook', async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET in environment variables.');
    return res.status(500).json({ error: 'Webhook secret is not configured.' });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    console.log('Payment successful:', {
      sessionId: session.id,
      customerEmail: session.customer_details?.email,
      amountTotal: session.amount_total,
      metadata: session.metadata
    });

    if (session.metadata?.orderNumber) {
      await dbHelper.updateOrderStatus(session.metadata.orderNumber, 'paid', 'confirmed');
      await dbHelper.logPayment({
        orderId: session.metadata.orderId,
        orderNumber: session.metadata.orderNumber,
        gateway: 'stripe',
        transactionId: session.id,
        amountLKR: session.amount_total,
        status: 'completed',
        rawResponse: session
      });
    }
  }

  return res.json({ received: true });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

const port = Number(process.env.PORT || 4242);
app.listen(port, () => {
  console.log(`Lush Ayush payment server running on http://localhost:${port} with SQLite DB`);
});
