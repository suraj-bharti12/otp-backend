const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid'); // Import UUID library

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Store OTPs temporarily (in-memory)
const otpMap = new Map();

// API endpoint to send OTP
app.post('/api/send-otp', (req, res) => {
  const { phoneNumber } = req.body;

  // Generate OTP
  const otp = generateOTP();

  // Generate OTP ID
  const otpId = uuidv4(); // Generate a unique OTP ID

  // Store OTP and OTP ID
  otpMap.set(otpId, { phoneNumber, otp });

  // Simulate sending OTP (replace with actual SMS/email logic)
  console.log(`Sending OTP ${otp} to ${phoneNumber}. OTP ID: ${otpId}`);

  // Respond with success and OTP ID
  res.status(200).json({ message: 'OTP sent successfully', otpId });
});

// API endpoint to verify OTP
app.post('/api/verify-otp', (req, res) => {
  const { otpId, otp } = req.body;

  // Retrieve OTP and phoneNumber from storage using OTP ID
  const storedData = otpMap.get(otpId);

  if (!storedData) {
    return res.status(400).json({ error: 'Invalid OTP ID. Please request a new OTP.' });
  }

  const { phoneNumber: storedPhoneNumber, otp: storedOTP } = storedData;

  // Compare OTPs
  if (otp !== storedOTP) {
    return res.status(400).json({ error: 'Incorrect OTP. Please try again.' });
  }

  // Clear OTP from storage (for one-time use, replace with your logic)
  otpMap.delete(otpId);

  // Respond with success
  res.status(200).json({ message: 'OTP verified successfully' });
});

// Generate OTP logic
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
