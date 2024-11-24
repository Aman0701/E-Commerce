import express from 'express';
import OTPController from './otpController.js';

const OTPRouter = express.Router();

const otpController = new OTPController;

OTPRouter.post('/send',(req,res,next) => {
    otpController.getOTP(req,res,next);
});

OTPRouter.post('/verify',(req,res,next) => {
    otpController.verifyOTP(req,res,next);
});

OTPRouter.post('/reset-password',(req,res,next) => {
    otpController.resetPassword(req,res,next);
});

export default OTPRouter;