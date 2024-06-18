const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Middleware
app.use(cors());
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
  const otp = generateOTP();
  const otpId = uuidv4();

  // Store OTP with its ID
  otpMap.set(otpId, { phoneNumber, otp });

  console.log(`OTP ${otp} sent to ${phoneNumber} with OTP ID ${otpId}`);

  res.status(200).json({ otpId, message: 'OTP sent successfully' });
});

// API endpoint to verify OTP
app.post('/api/verify-otp', (req, res) => {
  const { otpId, otp } = req.body;

  const storedOTP = otpMap.get(otpId);

  if (!storedOTP) {
    return res.status(400).json({ success: false, message: 'OTP not found. Please request a new OTP.' });
  }

  if (otp !== storedOTP.otp) {
    return res.status(400).json({ success: false, message: 'Incorrect OTP. Please try again.' });
  }

  otpMap.delete(otpId); // Clear OTP from storage after verification

  res.status(200).json({ success: true, message: 'OTP verified successfully' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
