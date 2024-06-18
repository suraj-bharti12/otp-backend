const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins

// Body parser middleware to parse JSON bodies
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
  const otpId = uuidv4(); // Generate unique OTP ID

  // Store OTP (replace with database storage for production)
  otpMap.set(otpId, { phoneNumber, otp });

  // Simulate sending OTP (replace with actual SMS/email logic)
  console.log(`Sending OTP ${otp} to ${phoneNumber}`);

  // Respond with success
  res.status(200).json({ otpId });
});

// API endpoint to verify OTP
app.post('/api/verify-otp', (req, res) => {
  const { otpId, otp } = req.body;

  // Retrieve OTP from storage (replace with database retrieval for production)
  const storedOtpData = otpMap.get(otpId);

  if (!storedOtpData) {
    return res.status(400).json({ success: false, message: 'OTP not found. Please request a new OTP.' });
  }

  // Compare OTPs
  if (otp !== storedOtpData.otp) {
    return res.status(400).json({ success: false, message: 'Incorrect OTP. Please try again.' });
  }

  // Clear OTP from storage (for one-time use, replace with your logic)
  otpMap.delete(otpId);

  // Respond with success
  res.status(200).json({ success: true, message: 'OTP verified successfully' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
