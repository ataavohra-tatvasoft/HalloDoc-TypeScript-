"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const admin_1 = __importDefault(require("../Models/admin"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const Op = sequelize_1.default.Op;
// import SparkPostTransport from 'nodemailer-sparkpost-transport';
// import uuid from 'uuid';
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield admin_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: "Invalid email address" });
        }
        // const resetToken = uuid();
        const resetToken = crypto.createHash("sha256").update(email).digest("hex");
        const expireTime = Date.now() + 60 * 60 * 1000; // 1 hour
        console.log(resetToken, expireTime, user.firstname);
        // Update user with reset token and expiry
        yield admin_1.default.update({ reset_token: resetToken, reset_token_expiry: expireTime }, { where: { email } });
        // Create email content
        const resetUrl = `http://localhost:7000/forgotresetpassword/resetpassword`;
        const mailContent = `
      <html>
      <form action = "${resetUrl}" method="POST"> 
      <p>You requested a password reset for your account.</p>
      <p>Click the link below to reset your password:</p>
      <p>Your token is: ${resetToken}</p>
      <label for="ResetToken">Token:</label>
      <input type="text" id="ResetToken" name="ResetToken" required>
      <br>
      <label for="Password">Password:</label>
      <input type="password" id="Password" name="Password" required>
      <br>
      <button type = "submit">Reset Password</button>
      <p>This link will expire in 1 hour.</p>
      </form>
      </html>
    `;
        // const transportOptions: SparkPostTransport.Options = {
        //   apiKey: process.env.SPARKPOST_API_KEY,
        // };
        // const transporter = nodemailer.createTransport(SparkPostTransport(transportOptions));
        const transporter = nodemailer_1.default.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false, // Adjust based on your SMTP server
            debug: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        console.log("Test", {
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            secure: false, // Adjust based on your SMTP server
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const info = yield transporter.sendMail({
            from: "vohraatta@gmail.com",
            to: email,
            subject: "Password Reset Request",
            html: mailContent,
        });
        console.log("Email sent: %s", info.messageId);
        res.status(200).json({ message: "Reset password link sent to your email" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending reset password link" });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ResetToken, Password } = req.body;
        console.log(ResetToken, Password);
        // Validate reset token and expiry
        const user = yield admin_1.default.findOne({
            where: {
                reset_token: ResetToken,
                reset_token_expiry: { [Op.gt]: Date.now() }, // Ensure token is not expired
            },
        });
        if (!user) {
            return res
                .status(400)
                .json({ message: "Invalid or expired reset token", });
        }
        // Hash the new password securely (consider using bcryptjs v5 for updated algorithms)
        const hashedPassword = yield bcrypt_1.default.hash(Password, 10); // Adjust cost factor as needed
        // Update user password and clear reset token
        yield admin_1.default.update({ password: hashedPassword, reset_token: null, reset_token_expiry: null }, { where: { adminid: user.adminid } });
        res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error resetting password" });
    }
});
exports.resetPassword = resetPassword;
