// Backend API Server entrypoint
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const env = require('./src/config/env');

// Load env from backend/.env if present
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));

// Mock auth (development only): set req.user as admin
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    req.user = { id: '000000000000000000000001', role: 'admin' };
  }
  next();
});

// Connect to MongoDB
if (!env.MONGO_URI) {
  console.warn('⚠️ MONGO_URI not set. Set it in backend/.env');
} else {
  connectDB();
}

// Routes
const adminRoutes = require('./src/routes/admin.routes');
const authRoutes = require('./src/routes/auth.routes');

app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', mongo: !!env.MONGO_URI, timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

const PORT = process.env.BACKEND_PORT || process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`✅ Backend API Server running on http://localhost:${PORT}`);
});
