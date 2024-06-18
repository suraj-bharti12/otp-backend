const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Middleware
app.use(cors({
  origin: 'https://extensions.shopifycdn.com' // Allow only requests from Shopify CDN
}));
app.use(bodyParser.json());

// Generate OTP logic
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

// Store OTPs temporarily (in-memory)
const otpMap = new Map();

// API endpoint to send OTP
app.post('/api/send-otp', (req, res) => {
  const { phoneNumber } = req.body;

  // Generate OTP
  const otp = generateOTP();

  // Store OTP (replace with database storage for production)
  otpMap.set(phoneNumber, otp);

  // Simulate sending OTP (replace with actual SMS/email logic)
  console.log(`Sending OTP ${otp} to ${phoneNumber}`);

  // Respond with success
  res.status(200).json({ message: 'OTP sent successfully' });
});

// API endpoint to verify OTP
app.post('/api/verify-otp', (req, res) => {
  const { phoneNumber, otp } = req.body;

  // Retrieve OTP from storage (replace with database retrieval for production)
  const storedOTP = otpMap.get(phoneNumber);

  if (!storedOTP) {
    return res.status(400).json({ error: 'OTP not found. Please request a new OTP.' });
  }

  // Compare OTPs
  if (otp !== storedOTP) {
    return res.status(400).json({ error: 'Incorrect OTP. Please try again.' });
  }

  // Clear OTP from storage (for one-time use, replace with your logic)
  otpMap.delete(phoneNumber);

  // Respond with success
  res.status(200).json({ message: 'OTP verified successfully' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
