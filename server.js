const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(bodyParser.json());

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
}

const otpMap = new Map();

app.post('/api/send-otp', (req, res) => {
  const { phoneNumber } = req.body;

  const otp = generateOTP();
  const otpId = uuidv4();

  otpMap.set(otpId, { phoneNumber, otp });

  console.log(`OTP ${otp} sent to ${phoneNumber} with OTP ID: ${otpId}`);

  res.status(200).json({ otpId, otp }); // Include the OTP in the response for debugging
});

app.post('/api/verify-otp', (req, res) => {
  const { otpId, otp } = req.body;

  const storedOtpData = otpMap.get(otpId);

  if (!storedOtpData) {
    return res.status(400).json({ success: false, message: 'OTP not found. Please request a new OTP.' });
  }

  if (otp !== storedOtpData.otp) {
    return res.status(400).json({ success: false, message: 'Incorrect OTP. Please try again.' });
  }

  otpMap.delete(otpId);

  res.status(200).json({ success: true, message: 'OTP verified successfully' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
