const { BadRequestError } = require("../utils/error");
const asyncHandler = require('../middlewares/asyncHandler');
const { config } = require("../config");
const authService = require("../services/auth.service");
const { User } = require("../prisma/generated/client");


exports.sendOTP = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        throw new BadRequestError("All fields are required");
    }
    if (password !== confirmPassword) {
        throw new BadRequestError("Passwords do not match");
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
        throw new Error("User already exists");
    }
    const { otpSessionId } = await authService.sendOTP(firstName, lastName, email, password);
    res.cookie("otp_session", otpSessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: config.OTP_TTL * 1000,
    }).status(200).json({
        success: true,
        message: "OTP sent successfully",
        otpSessionId,


    })


})  