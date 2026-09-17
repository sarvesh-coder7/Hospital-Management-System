const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: String,        // e.g. "patient" or "doctor"
  seq: { type: Number, default: 1000 }
});

module.exports = mongoose.model('Counter', counterSchema);