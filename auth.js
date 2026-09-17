const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const User    = require('../models/User');
const Counter = require('../models/counter');

const { cloudinary, upload } = require('../config/cloudinary');

// POST /api/auth/signup

router.post('/signup', upload.single('profileImage'), async (req, res) => {
  try {
    const {
      role, firstName, lastName, email, password,
      specialty,   // doctor only
      dob, phone, bloodGroup, gender   // patient only
    } = req.body;

     // ── Upload image to Cloudinary if provided ──
// AFTER
let profileImageUrl = null;
if (req.file) {
  // Normal file upload → push to Cloudinary
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'neuracare/profiles', transformation: [{ width: 300, height: 300, crop: 'fill' }] },
      (error, result) => { if (error) reject(error); else resolve(result); }
    );
    stream.end(req.file.buffer);
  });
  profileImageUrl = result.secure_url;
} else if (req.body.profileImageUrl) {
  // Google OAuth → use the URL directly
  profileImageUrl = req.body.profileImageUrl;
}

    // ── 1. Check required fields ──
    if (!role || !firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // ── 2. Check if email already exists ──
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // ── 3. Hash the password ──
    const hashedPassword = await bcrypt.hash(password, 10);

    // ── 4. Generate unique userId (PAT1001, DOC1001, etc.) ──
    const prefix = role === 'doctor' ? 'DOC' : 'PAT';
    const counter = await Counter.findByIdAndUpdate(
      role,
      { $inc: { seq: 1 } },
      { returnDocument: 'after', upsert: true }    );
    const userId = `${prefix}${counter.seq + 1000}`;

    // ── 5. Build user object ──
    const newUser = new User({
      userId,
      role,
      firstName: firstName.trim(),
      lastName:  lastName.trim(),
      email:     email.toLowerCase().trim(),
      password:  hashedPassword,
      // doctor-specific
      specialty: role === 'doctor' ? specialty : undefined,
      // patient-specific
      dob:   role === 'patient' ? dob   : undefined,
      phone: role === 'patient' ? phone : undefined,
      bloodGroup: role === 'patient' ? bloodGroup : undefined,
      gender:     role === 'patient' ? gender     : undefined,
      profileImage: profileImageUrl,   // ← Cloudinary URL or null
    });

    // ── 6. Save to MongoDB ──
    await newUser.save();

    // ── 7. Send back success + userId ──
    res.status(201).json({
      message: 'Account created successfully!',
      userId,
      role,
      name: `${firstName} ${lastName}`
    });

  } catch (err) {
    console.error('Signup error:', err);

    // Handle duplicate key error from MongoDB
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { role, userId, name, password } = req.body;

    // 1. Find user by userId and role
    const user = await User.findOne({ userId: userId.toUpperCase(), role });

    if (!user) {
      return res.status(404).json({ message: 'ID not found. Please check your credentials.' });
    }

    // 2. For patient, also check name matches
    if (role === 'patient') {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const inputName = name.trim().toLowerCase();
      if (fullName !== inputName) {
        return res.status(401).json({ message: 'Name does not match our records.' });
      }
    }

    // 3. Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password. Please try again.' });
    }

    // 4. Return success with user info
    res.status(200).json({
      userId: user.userId,
  role: user.role,
  firstName: user.firstName,
  lastName: user.lastName,
  specialty: user.specialty,
  dob: user.dob,
  gender:       user.gender,
  bloodGroup: user.bloodGroup,
  profileImage: user.profileImage
});
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

const passport = require('passport');

// ── Google OAuth: Start ──
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// ── Google OAuth: Callback ──
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/Pages/02-Login.html' }),
  async (req, res) => {
    try {
      const profile   = req.user;
      const email     = profile.emails[0].value;
      const firstName = profile.name.givenName  || '';
      const lastName  = profile.name.familyName || '';
      const picture   = profile.photos?.[0]?.value || '';
      const googleId  = profile.id;

      const existingUser = await User.findOne({ email: email.toLowerCase() });

      if (existingUser) {
        // ✅ FIX: Redirect DIRECTLY to dashboard, skip Google-Complete entirely
        const params = new URLSearchParams({
          existing:     'true',
          userId:       existingUser.userId,
          role:         existingUser.role,
          firstName:    existingUser.firstName,
          lastName:     existingUser.lastName  || '',
          profileImage: existingUser.profileImage || picture,
          dob:          existingUser.dob        || '',
          gender:       existingUser.gender     || '',
          bloodGroup:   existingUser.bloodGroup || ''
        });
        // ✅ Go straight to dashboard — not Google-Complete
        return res.redirect(`/Pages/05-Patient-dashboard.html?${params.toString()}`);
      }

      // 🆕 New user → still go to profile completion form
      const params = new URLSearchParams({ email, firstName, lastName, picture, googleId });
      res.redirect(`/Pages/03-Google-Complete.html?${params.toString()}`);

    } catch (err) {
      console.error('Google callback error:', err);
      res.redirect('/Pages/02-Login.html');
    }
  }
);
// POST /api/auth/google/complete
// Called by 03-Google-Complete.html to finish Google login/signup
router.post('/google/complete', async (req, res) => {
  try {
    const { googleId, email, firstName, lastName, picture } = req.body;

    // 1. Check if user already exists (returning Google user)
    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // ── Existing user → just log them in ──
      return res.status(200).json({
        userId:       user.userId,
        role:         user.role,
        firstName:    user.firstName,
        lastName:     user.lastName,
        specialty:    user.specialty,
        dob:          user.dob,
        gender:       user.gender,
        bloodGroup:   user.bloodGroup,
        profileImage: user.profileImage || picture
      });
    }

    // 2. New user → auto-register as patient
    const prefix  = 'PAT';
    const counter = await Counter.findByIdAndUpdate(
      'patient',
      { $inc: { seq: 1 } },
      { returnDocument: 'after', upsert: true }
    );
    const userId = `${prefix}${counter.seq + 1000}`;

    const newUser = new User({
      userId,
      role:         'patient',
      firstName:    firstName.trim(),
      lastName:     lastName.trim(),
      email:        email.toLowerCase().trim(),
      password:     await bcrypt.hash(googleId, 10), // unusable password
      profileImage: picture || null,
      googleId      // store for reference
    });

    await newUser.save();

    return res.status(201).json({
      userId,
      role:         'patient',
      firstName,
      lastName,
      profileImage: picture || null
    });

  } catch (err) {
    console.error('Google complete error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;