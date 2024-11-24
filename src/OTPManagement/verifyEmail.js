import nodemailer from 'nodemailer';
import { ApplicationError } from '../error-handler/applicationError.js';


/**
 * VerifyEmail class for sending verification emails
 */
export default class VerifyEmail {
    /**
     * Constructor for VerifyEmail class
     */
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'codingninjas2k16@gmail.com',
                pass: 'slwvvlczduktvhdj',
            },
        });
    }

    /**
     * Send a verification email
     */
    async sendmail(otp,email) {
        const mailOptions = {
            from: 'codingninjas2k16@gmail.com',
            to: email,
            subject: "OTP for Reset Password",
            text:`Your OTP code is ${otp}. It will expire in 10 minutes`,
        };
        try {
            const info = await this.transporter.sendMail(mailOptions);
        } catch (err) {
            throw new ApplicationError("Failed to send email. Please try again later.", 500);
        }
    }
}