import mongoose from "mongoose";
import { OTPSchema } from "./OTPSchema.js";


const otpModel = mongoose.model('OTP', OTPSchema);
export default class OTPRepository {

    generateOTP() {
        const otp = Math.floor(100000 + Math.random() * 900000);
        return otp.toString();
    }

    async addOTP(newOtp) {
        try {
            const user = await otpModel.findOne({ email: newOtp.email });
            if (user) {
                user.OTP = newOtp.OTP;
                await user.save();
                return user;
            } else {
                const user = new otpModel(newOtp);
                await user.save();
                return user;
            }
        } catch (err) {
            throw new ApplicationError("Something went wrong with database",500);

        }
    }
    async getUser(email,otp) {
        try {
            const user = await otpModel.findOne({ email: email ,otp:otp});
            return user;

        } catch (err) {
            throw new ApplicationError("Something went wrong with database",500);

        }
    }
    async getUser(email) {
        try {
            const user = await otpModel.findOne({ email: email});
            return user;

        } catch (err) {
            throw new ApplicationError("Something went wrong with database",500);

        }
    }

    async deleteOTP(email){
        try {
            const user = await otpModel.findOneAndDelete({ email: email});
            return user;

        } catch (err) {
            throw new ApplicationError("Something went wrong with database",500);

        }
    }
}