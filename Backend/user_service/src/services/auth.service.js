const { conflictError } = require('../utils/error');
const { generateAndStoreOTP } = require('../utils/otp');
const { sendOtpEmail } = require('../utils/email');
const bcrypt = require('bcrypt');
const { prisma } = require('../prisma/prismaClient');

const sendOTP = async (firstName, lastName, email, password) => {
    const existUser = await prisma.user.findUnique({ where: { email } });
    if (existUser) {
        throw new Error("User already exists");
    }
    const hashed_password = await bcrypt.hash(password, 10);
    const meta = { firstName, lastName, email, hashed_password, }
    const { otp, otpSessionId } = await generateAndStoreOTP(meta);
    await sendOtpEmail(email, otp);
    return { otpSessionId };

}

module.exports = {
    sendOTP
};