const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  paymentOTP: { type: String, default: null }, // Add this line
  paymentOTPExpiry: { type: Date, default: null }, // Add this line
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Include the 'name' field in the toObject and toJSON methods
userSchema.set('toObject', { getters: true, virtuals: true });
userSchema.set('toJSON', { getters: true, virtuals: true });

const User = mongoose.model('User', userSchema);
module.exports = User;