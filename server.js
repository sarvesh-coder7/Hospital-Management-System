const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const dotenv   = require('dotenv');
const path     = require('path');
const session  = require('express-session');
const passport = require('passport');

dotenv.config();

// ── Passport Google Strategy ──
require('./config/passport'); // we'll create this file next

const app = express();

app.use(express.static('Frontend'));

// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Frontend')));

// ── Session (required for Passport) ──
app.use(session({
  secret: process.env.SESSION_SECRET || 'neuracare_secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// ── Test route ──
app.get('/api/health', (req, res) => {
  res.json({ status: '✅ Server is running', routes: 'auth loaded' });
});

// ── Auth Routes ──
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const chatRoutes = require('./routes/chat');
app.use('/api/chat', chatRoutes);
const appointmentRoutes = require('./routes/appointments');
app.use('/api/appointments', appointmentRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend/Pages/01-Index.html'));
});

app.use((req, res) => {
  console.log('❌ 404 - Route not found:', req.method, req.url);
  res.status(404).json({ message: `Route not found: ${req.method} ${req.url}` });
});

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB - Neuracare-DB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB error:', err.message));