const express = require('express');
const router = express.Router();
const { sendOTP } = require('../services/auth.service');

router.post('/send-otp', async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const { otpSessionId } = await sendOTP(firstName, lastName, email, password);
        res.json({ otpSessionId });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
