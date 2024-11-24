import OTPRepository from "./otpRepository.js";
import OTPModels from "./otpModels.js";
import VerifyEmail from "./verifyEmail.js";
import UserRepository from "../User/User-Repository/userRepository.js";
import { ApplicationError } from "../error-handler/applicationError.js";
import bcrypt from 'bcrypt';

export default class OTPController {
    constructor() {
        this.OTPRepository = new OTPRepository();
    }

    async getOTP(req, res, next) {
        try {
            const otp = this.OTPRepository.generateOTP();
            const { email } = req.body;
            if (!email) {
                return res.status(400).send("Please Send a valid Email");
            }
            const newOTP = new OTPModels(email, otp);
            await this.OTPRepository.addOTP(newOTP);
            const verifyEmail = new VerifyEmail();
            verifyEmail.sendmail(otp, email);

            return res.status(200).send(`OTP sent to email ${email}`);
        } catch (err) {
            next(err);
        }
    }

    async verifyOTP(req, res, next) {
        try {
            const { email, otp } = req.body;
            const user = await this.OTPRepository.getUser(email, otp);
            if (!user) {
                throw new ApplicationError("User not found", 404)
            }
            user.verified = true;
            await user.save();
            return res.status(200).send("Verified Successfully");
        } catch (err) {
            next(err);
        }
    }

    async resetPassword(req, res, next) {
        try {
            const { email, newPassword } = req.body;
            const verifiedUser = await this.OTPRepository.getUser(email);
            if (!verifiedUser.verified) {
                throw new ApplicationError("Verify with OTP first", 400);
            }
            const user = await UserRepository.getUser(email);

            if (!user) {
                throw new ApplicationError("Email is not present", 404);
            }
            const hashedPassword = await bcrypt.hash(newPassword, 12);
            user.password = hashedPassword;
            await user.save();
            await this.OTPRepository.deleteOTP(email);
            return res.status(200).send(user);
        } catch (err) {
            next(err);
        }
    }
}