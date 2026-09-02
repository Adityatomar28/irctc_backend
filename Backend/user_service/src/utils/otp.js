const { TooManyRequestsError } = require('./error');
const { redis } = require('../cache/redis');
const { config } = require('../config');
const otpGenerator = require('otp-generator');
const crypto = require('node:crypto');
const OTP_TTL = parseInt(config.OTP_TTL || '300', 10);
const OTP_RATE_MAX_PER_HOUR = parseInt(config.OTP_RATE_MAX_PER_HOUR || '5', 10);
const OTP_MAX_VERIFY_ATTEMPTS = parseInt(config.OTP_MAX_VERIFY_ATTEMPTS || '5', 10);
const OTP_HMAC_SECRET = config.OTP_HMAC_SECRET || "09dc0abbb2961391d822610b31b912e3231d4d2745c76b1ef4765af4c62f6079";
const { Hmac } = require('node:crypto');

function hmacfor(email, otp) {
    return crypto.createHmac('sha256', HMAC_SECRET).update(JSON.stringify())
        .update(`${email}:${otp}`)
        .digest('hex');
}

async function generateAndStoreOTP(meta) {
    //how many otp's you can send in an hour

    const rateKey = `otp:rates:${meta.email}`;
    // here we used parse int which will return the integer value of the string
    const sentCount = parseInt(await redis.get(rateKey) || '0', 10);

    if (sentCount >= RATE_MAX) {
        throw new Error("Too many OTP's sent");

    }
    const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false
    });
    const otpSessionId = crypto.randomUUID();
    const hashed = HmacFor(meta.email, otp);
    await redis.set(`otp:session:${otpSessionId}`, JSON.stringify({
        hashedOtp: hashed,
        meta
    }), 'EX', config.OTP_TTL)
        .then(async () => {
            await redis.incr(rateKey);
            await redis.expire(rateKey, 3600);
        });
    return {
        otpSessionId
    };






}

module.exports = { generateAndStoreOTP }
