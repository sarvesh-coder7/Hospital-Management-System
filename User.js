const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId:    { type: String, unique: true, required: true },
  role:      { type: String, enum: ['patient', 'doctor'], required: true },
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true },
  specialty: { type: String, default: null },
  dob:       { type: String, default: null },
  phone:     { type: String, default: null },
  gender:       { type: String, default: null },
  bloodGroup: { type: String, default: null },
  profileImage: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  googleId: { type: String, default: null }
});

module.exports = mongoose.model('User', userSchema);