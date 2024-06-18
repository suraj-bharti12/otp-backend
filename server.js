const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Mock database
const otpStore = {};

// Generate a random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

// Endpoint to send OTP
app.post('/api/send-otp', (req, res) => {
  const { phoneNumber } = req.body;
  const otp = generateOTP();
  otpStore[phoneNumber] = otp;
  console.log(`OTP for ${phoneNumber}: ${otp}`);
  res.json({ otp }); // For testing purposes, include OTP in the response
});

// Endpoint to verify OTP
app.post('/api/verify-otp', (req, res) => {
  const { phoneNumber, otp } = req.body;
  const storedOtp = otpStore[phoneNumber];
  if (storedOtp === otp) {
    res.json({ verified: true });
  } else {
    res.json({ verified: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
