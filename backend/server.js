const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'zvaigzdziu_user',
  password: process.env.DB_PASSWORD || 'your_password_here',
  database: process.env.DB_NAME || 'zvaigzdziu_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token.' });
    }
    req.user = user;
    next();
  });
};

// Admin Middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  next();
};

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    
    // Check if user exists
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const [result] = await pool.execute(
      'INSERT INTO users (email, password, first_name, last_name, phone, role) VALUES (?, ?, ?, ?, ?, ?)',
      [email, hashedPassword, firstName, lastName, phone, 'user']
    );
    
    // Generate token
    const token = jwt.sign(
      { userId: result.insertId, email, role: 'user' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: result.insertId,
        email,
        firstName,
        lastName,
        phone,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    const user = users[0];
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, email, first_name, last_name, phone, role, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const user = users[0];
    res.json({
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      role: user.role,
      createdAt: user.created_at
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== ACCOMMODATIONS ROUTES ====================

// Get all accommodations
app.get('/api/accommodations', async (req, res) => {
  try {
    const [accommodations] = await pool.execute(
      'SELECT * FROM accommodations ORDER BY name'
    );
    res.json(accommodations);
  } catch (error) {
    console.error('Get accommodations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single accommodation
app.get('/api/accommodations/:id', async (req, res) => {
  try {
    const [accommodations] = await pool.execute(
      'SELECT * FROM accommodations WHERE id = ?',
      [req.params.id]
    );
    
    if (accommodations.length === 0) {
      return res.status(404).json({ error: 'Accommodation not found' });
    }
    
    res.json(accommodations[0]);
  } catch (error) {
    console.error('Get accommodation error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== ACTIVITIES ROUTES ====================

// Get all activities
app.get('/api/activities', async (req, res) => {
  try {
    const [activities] = await pool.execute(
      'SELECT * FROM activities ORDER BY name'
    );
    res.json(activities);
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== BOOKINGS ROUTES ====================

// Create booking
app.post('/api/bookings', authenticateToken, async (req, res) => {
  try {
    const {
      accommodationId,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      extras,
      notes
    } = req.body;
    
    // Create booking
    const [bookingResult] = await pool.execute(
      `INSERT INTO bookings 
       (user_id, accommodation_id, check_in, check_out, guests, total_price, status, notes, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [req.user.userId, accommodationId, checkIn, checkOut, guests, totalPrice, 'pending', notes]
    );
    
    const bookingId = bookingResult.insertId;
    
    // Add extras if any
    if (extras && extras.length > 0) {
      for (const extra of extras) {
        await pool.execute(
          'INSERT INTO booking_extras (booking_id, activity_id, quantity, price) VALUES (?, ?, ?, ?)',
          [bookingId, extra.activityId, extra.quantity, extra.price]
        );
      }
    }
    
    res.status(201).json({
      message: 'Booking created successfully',
      bookingId
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's bookings
app.get('/api/bookings/my', authenticateToken, async (req, res) => {
  try {
    const [bookings] = await pool.execute(
      `SELECT b.*, a.name as accommodation_name, a.image as accommodation_image
       FROM bookings b
       JOIN accommodations a ON b.accommodation_id = a.id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
      [req.user.userId]
    );
    
    // Get extras for each booking
    for (const booking of bookings) {
      const [extras] = await pool.execute(
        `SELECT be.*, act.name as activity_name
         FROM booking_extras be
         JOIN activities act ON be.activity_id = act.id
         WHERE be.booking_id = ?`,
        [booking.id]
      );
      booking.extras = extras;
    }
    
    res.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== ADMIN ROUTES ====================

// Get all bookings (admin only)
app.get('/api/admin/bookings', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [bookings] = await pool.execute(
      `SELECT b.*, 
              a.name as accommodation_name, 
              u.first_name, u.last_name, u.email, u.phone
       FROM bookings b
       JOIN accommodations a ON b.accommodation_id = a.id
       JOIN users u ON b.user_id = u.id
       ORDER BY b.created_at DESC`
    );
    
    res.json(bookings);
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update booking status (admin only)
app.patch('/api/admin/bookings/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    
    await pool.execute(
      'UPDATE bookings SET status = ? WHERE id = ?',
      [status, req.params.id]
    );
    
    res.json({ message: 'Booking status updated' });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users (admin only)
app.get('/api/admin/users', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [users] = await pool.execute(
      'SELECT id, email, first_name, last_name, phone, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get admin dashboard stats
app.get('/api/admin/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    // Total bookings
    const [bookingsResult] = await pool.execute(
      'SELECT COUNT(*) as total, SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as pending, SUM(CASE WHEN status = "paid" THEN 1 ELSE 0 END) as paid FROM bookings'
    );
    
    // Total revenue this month
    const [revenueResult] = await pool.execute(
      'SELECT SUM(total_amount) as total FROM bookings WHERE status = "paid" AND MONTH(created_at) = MONTH(CURRENT_DATE()) AND YEAR(created_at) = YEAR(CURRENT_DATE())'
    );
    
    // Today's arrivals
    const [arrivalsResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM bookings WHERE check_in = CURRENT_DATE() AND status != "cancelled"'
    );
    
    // Recent bookings
    const [recentBookings] = await pool.execute(
      `SELECT b.*, a.name as accommodation_name, u.first_name, u.last_name, u.email 
       FROM bookings b 
       JOIN accommodations a ON b.accommodation_id = a.id 
       JOIN users u ON b.user_id = u.id 
       ORDER BY b.created_at DESC LIMIT 5`
    );
    
    res.json({
      bookings: {
        total: bookingsResult[0].total,
        pending: bookingsResult[0].pending,
        paid: bookingsResult[0].paid
      },
      revenue: revenueResult[0].total || 0,
      todayArrivals: arrivalsResult[0].total,
      recentBookings
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== NEWS ROUTES ====================

// Get all news
app.get('/api/news', async (req, res) => {
  try {
    const [news] = await pool.execute(
      'SELECT * FROM news WHERE is_active = 1 ORDER BY created_at DESC'
    );
    res.json(news);
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create news (admin only)
app.post('/api/news', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, content, image, isSpecialOffer, discountPercent } = req.body;
    
    const [result] = await pool.execute(
      'INSERT INTO news (title, content, image, is_special_offer, discount_percent, is_active, created_at) VALUES (?, ?, ?, ?, ?, 1, NOW())',
      [title, content, image, isSpecialOffer || false, discountPercent || 0]
    );
    
    res.status(201).json({ message: 'News created', id: result.insertId });
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== STRIPE PAYMENT ROUTES ====================

// Create payment intent
app.post('/api/create-payment-intent', authenticateToken, async (req, res) => {
  try {
    const { amount, bookingId } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency: 'eur',
      metadata: {
        bookingId: bookingId.toString(),
        userId: req.user.userId.toString()
      }
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ error: 'Payment processing error' });
  }
});

// Webhook for Stripe events
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const bookingId = paymentIntent.metadata.bookingId;
      
      // Update booking status to paid
      await pool.execute(
        'UPDATE bookings SET status = ?, payment_id = ? WHERE id = ?',
        ['paid', paymentIntent.id, bookingId]
      );
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

// ==================== AVAILABILITY & PRICING ROUTES ====================

// Helper function to get price for a specific date
async function getPriceForDate(accommodationId, date) {
  // Check for custom price first
  const [customPrice] = await pool.execute(
    'SELECT price, is_available FROM accommodation_prices WHERE accommodation_id = ? AND date = ?',
    [accommodationId, date]
  );
  
  if (customPrice.length > 0) {
    return { price: customPrice[0].price, isAvailable: customPrice[0].is_available };
  }
  
  // Fall back to base price + season multiplier
  const [acc] = await pool.execute(
    'SELECT price_low_season, price_high_season, price_weekend FROM accommodations WHERE id = ?',
    [accommodationId]
  );
  
  if (acc.length === 0) return null;
  
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const dayOfWeek = d.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  // Check season
  const [season] = await pool.execute(
    'SELECT price_multiplier FROM seasons WHERE is_active = 1 AND (
      (start_month <= ? AND end_month >= ?) OR
      (start_month > end_month AND (? >= start_month OR ? <= end_month))
    )',
    [month, month, month, month]
  );
  
  const multiplier = season.length > 0 ? season[0].price_multiplier : 1;
  let basePrice = acc[0].price_low_season;
  
  if (isWeekend) {
    basePrice = acc[0].price_weekend;
  } else if (month >= 7 && month <= 8) {
    basePrice = acc[0].price_high_season;
  }
  
  return { price: Math.round(basePrice * multiplier), isAvailable: true };
}

// Get calendar with prices for a month
app.get('/api/calendar', async (req, res) => {
  try {
    const { year, month, accommodationId } = req.query;
    
    if (!year || !month) {
      return res.status(400).json({ error: 'Year and month are required' });
    }
    
    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    
    // Get all accommodations or specific one
    let accommodations;
    if (accommodationId) {
      const [acc] = await pool.execute('SELECT * FROM accommodations WHERE id = ? AND active = 1', [accommodationId]);
      accommodations = acc;
    } else {
      const [acc] = await pool.execute('SELECT * FROM accommodations WHERE active = 1');
      accommodations = acc;
    }
    
    // Generate calendar for each day
    const calendar = [];
    const current = new Date(startDate);
    const end = new Date(endDate);
    
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      const dayOfWeek = current.getDay();
      
      for (const acc of accommodations) {
        const priceInfo = await getPriceForDate(acc.id, dateStr);
        
        // Check if date is booked
        const [bookings] = await pool.execute(
          `SELECT COUNT(*) as count FROM bookings 
           WHERE accommodation_id = ? 
           AND status != 'cancelled'
           AND ? >= check_in AND ? < check_out`,
          [acc.id, dateStr, dateStr]
        );
        
        const isBooked = bookings[0].count > 0;
        
        calendar.push({
          date: dateStr,
          accommodation_id: acc.id,
          accommodation_name: acc.name,
          price: priceInfo?.price || acc.price_low_season,
          is_available: priceInfo?.isAvailable !== false && !isBooked,
          is_weekend: dayOfWeek === 0 || dayOfWeek === 6,
          is_booked: isBooked
        });
      }
      
      current.setDate(current.getDate() + 1);
    }
    
    res.json(calendar);
  } catch (error) {
    console.error('Get calendar error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Check availability with pricing
app.get('/api/availability', async (req, res) => {
  try {
    const { checkIn, checkOut, accommodationId } = req.query;
    
    let query = `
      SELECT a.*, 
             (SELECT COUNT(*) FROM bookings b 
              WHERE b.accommodation_id = a.id 
              AND b.status != 'cancelled'
              AND ((b.check_in <= ? AND b.check_out > ?) 
                   OR (b.check_in < ? AND b.check_out >= ?)
                   OR (b.check_in >= ? AND b.check_out <= ?))) as booked_count
      FROM accommodations a
      WHERE a.active = 1
    `;
    
    const params = [checkOut, checkIn, checkOut, checkIn, checkIn, checkOut];
    
    if (accommodationId) {
      query += ' AND a.id = ?';
      params.push(accommodationId);
    }
    
    query += ' ORDER BY a.name';
    
    const [results] = await pool.execute(query, params);
    
    // Calculate availability and total price for date range
    const availability = await Promise.all(results.map(async (acc) => {
      let totalPrice = 0;
      let isAvailable = acc.booked_count < 1; // Check if not fully booked
      
      if (checkIn && checkOut && isAvailable) {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const current = new Date(start);
        
        while (current < end) {
          const dateStr = current.toISOString().split('T')[0];
          const priceInfo = await getPriceForDate(acc.id, dateStr);
          
          if (!priceInfo || !priceInfo.isAvailable) {
            isAvailable = false;
            break;
          }
          
          totalPrice += priceInfo.price;
          current.setDate(current.getDate() + 1);
        }
      }
      
      return {
        ...acc,
        is_available: isAvailable,
        total_price: totalPrice
      };
    }));
    
    res.json(availability);
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== ADMIN PRICING ROUTES ====================

// Set custom price for a date (admin only)
app.post('/api/admin/prices', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { accommodationId, date, price, isAvailable, note } = req.body;
    
    // Insert or update price
    await pool.execute(
      `INSERT INTO accommodation_prices (accommodation_id, date, price, is_available, note, created_by)
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       price = VALUES(price), 
       is_available = VALUES(is_available), 
       note = VALUES(note), 
       created_by = VALUES(created_by)`,
      [accommodationId, date, price, isAvailable !== false, note || null, req.user.userId]
    );
    
    res.json({ message: 'Price updated successfully' });
  } catch (error) {
    console.error('Set price error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Set prices for date range (admin only)
app.post('/api/admin/prices/range', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { accommodationId, startDate, endDate, price, isAvailable, note } = req.body;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const current = new Date(start);
    
    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      
      await pool.execute(
        `INSERT INTO accommodation_prices (accommodation_id, date, price, is_available, note, created_by)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE 
         price = VALUES(price), 
         is_available = VALUES(is_available), 
         note = VALUES(note), 
         created_by = VALUES(created_by)`,
        [accommodationId, dateStr, price, isAvailable !== false, note || null, req.user.userId]
      );
      
      current.setDate(current.getDate() + 1);
    }
    
    res.json({ message: 'Prices updated for date range' });
  } catch (error) {
    console.error('Set price range error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all custom prices for accommodation (admin only)
app.get('/api/admin/prices/:accommodationId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = 'SELECT * FROM accommodation_prices WHERE accommodation_id = ?';
    const params = [req.params.accommodationId];
    
    if (startDate && endDate) {
      query += ' AND date BETWEEN ? AND ?';
      params.push(startDate, endDate);
    }
    
    query += ' ORDER BY date';
    
    const [prices] = await pool.execute(query, params);
    res.json(prices);
  } catch (error) {
    console.error('Get prices error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete custom price (admin only)
app.delete('/api/admin/prices/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    await pool.execute('DELETE FROM accommodation_prices WHERE id = ?', [req.params.id]);
    res.json({ message: 'Price deleted' });
  } catch (error) {
    console.error('Delete price error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get seasons (admin only)
app.get('/api/admin/seasons', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const [seasons] = await pool.execute('SELECT * FROM seasons ORDER BY start_month');
    res.json(seasons);
  } catch (error) {
    console.error('Get seasons error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update season (admin only)
app.patch('/api/admin/seasons/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { priceMultiplier, isActive } = req.body;
    
    await pool.execute(
      'UPDATE seasons SET price_multiplier = ?, is_active = ? WHERE id = ?',
      [priceMultiplier, isActive, req.params.id]
    );
    
    res.json({ message: 'Season updated' });
  } catch (error) {
    console.error('Update season error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

module.exports = app;
