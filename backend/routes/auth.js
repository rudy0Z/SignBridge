const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Razorpay = require('razorpay');
const authMiddleware = require('./middleware');
const crypto = require('crypto');
const Subscription = require('../models/Subscription');

const razorpay = new Razorpay({
  key_id: 'rzp_test_ISFZvpmbqZTNz9',
  key_secret: '6HxQl8oPKCu8UExHx9su45Rd',
});

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    // Configure your email service provider settings
    // For example, using Gmail SMTP:
    service: 'gmail',
    auth: {
      user: 'sgarvit02@gmail.com',
      pass: 'cvgnfotgslioqwdb',
    },
  });



const sendMail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: 'sgarvit02@gmail.com', // replace with your email
      to,
      subject,
      text
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = sendMail;
// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Signin
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate a JSON Web Token
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      'your-secret-key', // Replace with your own secret key
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/user', async (req, res) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
      }
  
      const decoded = jwt.verify(token, 'your-secret-key');
      const user = await User.findById(decoded.user.id).select('name'); // Add the 'select' option
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Check if the user has an active subscription
      const subscription = await Subscription.findOne({
        userId: user._id,
        expirationDate: { $gt: new Date() },
      });
  
      const isPremiumMember = subscription ? true : false;
  
      res.json({ name: user.name, isPremiumMember });
    } catch (err) {
      console.error(err.message);
      res.status(401).json({ msg: 'Invalid token' });
    }
  });
router.post('/create-order', authMiddleware, async (req, res) => {
  const { amount } = req.body;
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount is in paise
      currency: 'INR',
    });
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.post('/verify-payment', authMiddleware, async (req, res) => {
    try {
      const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, 'your-secret-key');
      const user = await User.findById(decoded.user.id);
  
      // Verify the payment signature
      const body = `${razorpayOrderId}|${razorpayPaymentId}`;
      const expectedSignature = crypto
        .createHmac('sha256', '6HxQl8oPKCu8UExHx9su45Rd')
        .update(body.toString())
        .digest('hex');
  
      if (razorpaySignature === expectedSignature) {
        // Payment is valid, perform necessary actions
        console.log('Payment verified successfully!');
  
        // Create a new subscription record for the user
        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 1); // Set expiration date to 1 month from now
  
        const subscription = new Subscription({
          userId: user._id, // Assign the user._id value to the userId field
          plan: 'Pro Plan', // Update this based on your plan structure
          expirationDate,
        });
  
        await subscription.save();
  
        // Send a response indicating successful subscription
        res.json({ success: true, isPremiumMember: true });
      } else {
        console.error('Invalid payment signature');
        return res.status(400).json({ error: 'Invalid payment signature' });
      }
    } catch (err) {
      console.error('Error verifying payment:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Send OTP
router.post('/send-otp', async (req, res) => {
    try {
      const { amount } = req.body;
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
      }
  
      const decoded = jwt.verify(token, 'your-secret-key');
      const user = await User.findById(decoded.user.id);
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Generate a random OTP
      const otp = Math.floor(100000 + Math.random() * 900000);
  
      // Send the OTP to the user's email
      await sendMail(user.email, 'Payment OTP', `Your OTP for payment is: ${otp}`);
  
      // Store the OTP in the user object or a separate collection
      user.paymentOTP = otp;
      await user.save();
  
      res.json({ otp });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // Verify OTP
  router.post('/verify-otp', async (req, res) => {
    try {
      const { otp } = req.body;
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
      }
  
      const decoded = jwt.verify(token, 'your-secret-key');
      const user = await User.findById(decoded.user.id);
  
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Check if the OTP matches the stored OTP for the user
      if (user.paymentOTP && user.paymentOTP.toString() === otp.toString()) {
        res.json({ isValid: true });
      } else {
        res.json({ isValid: false });
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  
module.exports = router;