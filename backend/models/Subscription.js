const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: String, required: true },
  expirationDate: { type: Date, required: true },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;