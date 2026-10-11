import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    initTables();
  }
});

function initTables() {
  db.serialize(() => {
    // Orders table
    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT,
        zip_code TEXT,
        payment_method TEXT NOT NULL,
        payment_status TEXT DEFAULT 'pending',
        order_status TEXT DEFAULT 'processing',
        items_json TEXT NOT NULL,
        subtotal_lkr REAL DEFAULT 0,
        shipping_lkr REAL DEFAULT 300,
        total_lkr REAL NOT NULL,
        slip_data TEXT,
        wallet_number TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Payments table
    db.run(`
      CREATE TABLE IF NOT EXISTS payments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        order_number TEXT,
        gateway TEXT NOT NULL,
        transaction_id TEXT,
        amount_lkr REAL NOT NULL,
        status TEXT NOT NULL,
        raw_response TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders (id)
      )
    `);

    // Bookings table
    db.run(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        booking_code TEXT UNIQUE NOT NULL,
        customer_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        service_name TEXT NOT NULL,
        booking_date TEXT NOT NULL,
        booking_time TEXT NOT NULL,
        notes TEXT,
        status TEXT DEFAULT 'confirmed',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });
}

// Database helper operations
export const dbHelper = {
  createOrder: (order) => {
    return new Promise((resolve, reject) => {
      const orderNumber = 'AYU-' + Math.floor(100000 + Math.random() * 900000);
      const sql = `
        INSERT INTO orders (
          order_number, full_name, email, phone, address, city, state, zip_code,
          payment_method, payment_status, order_status, items_json, subtotal_lkr,
          shipping_lkr, total_lkr, slip_data, wallet_number
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        orderNumber,
        order.fullName || 'Valued Customer',
        order.email || '',
        order.phone || '',
        order.address || '',
        order.city || '',
        order.state || '',
        order.zipCode || '',
        order.paymentMethod || 'cod',
        order.paymentStatus || 'pending',
        order.orderStatus || 'processing',
        JSON.stringify(order.items || []),
        Number(order.subtotalLKR || 0),
        Number(order.shippingLKR || 300),
        Number(order.totalLKR || 0),
        order.slipData || null,
        order.walletNumber || null
      ];

      db.run(sql, params, function (err) {
        if (err) {
          return reject(err);
        }
        resolve({
          id: this.lastID,
          orderNumber,
          ...order
        });
      });
    });
  },

  getAllOrders: () => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM orders ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) return reject(err);
        const parsedRows = (rows || []).map(r => ({
          ...r,
          items: r.items_json ? JSON.parse(r.items_json) : []
        }));
        resolve(parsedRows);
      });
    });
  },

  getOrderById: (id) => {
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM orders WHERE id = ? OR order_number = ?`, [id, id], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        resolve({
          ...row,
          items: row.items_json ? JSON.parse(row.items_json) : []
        });
      });
    });
  },

  updateOrderStatus: (id, paymentStatus, orderStatus) => {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE orders SET payment_status = COALESCE(?, payment_status), order_status = COALESCE(?, order_status) WHERE id = ? OR order_number = ?`,
        [paymentStatus, orderStatus, id, id],
        function (err) {
          if (err) return reject(err);
          resolve({ updated: this.changes });
        }
      );
    });
  },

  logPayment: (paymentData) => {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO payments (order_id, order_number, gateway, transaction_id, amount_lkr, status, raw_response)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      db.run(
        sql,
        [
          paymentData.orderId || null,
          paymentData.orderNumber || null,
          paymentData.gateway || 'stripe',
          paymentData.transactionId || null,
          Number(paymentData.amountLKR || 0),
          paymentData.status || 'success',
          paymentData.rawResponse ? JSON.stringify(paymentData.rawResponse) : null
        ],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID });
        }
      );
    });
  },

  createBooking: (booking) => {
    return new Promise((resolve, reject) => {
      const bookingCode = 'BK-' + Math.floor(100000 + Math.random() * 900000);
      const sql = `
        INSERT INTO bookings (booking_code, customer_name, email, phone, service_name, booking_date, booking_time, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.run(
        sql,
        [
          bookingCode,
          booking.customerName,
          booking.email,
          booking.phone,
          booking.serviceName,
          booking.bookingDate,
          booking.bookingTime,
          booking.notes || ''
        ],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, bookingCode, ...booking });
        }
      );
    });
  },

  getAllBookings: () => {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM bookings ORDER BY created_at DESC`, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    });
  }
};

export default db;
