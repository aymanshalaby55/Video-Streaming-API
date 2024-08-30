const speakeasy = require("speakeasy");

class Otp {
    static generateSecret() {
        return speakeasy.generateSecret({ length: 20 }).base32;
    }

    static generateOTP(secret) {
        return speakeasy.totp({
            secret,
            encoding: "base32",
            digits: 6,
            step: 600, // 10 minutes
        });
    }

    static verifyOTP(otp, secret) {
        return speakeasy.totp.verify({
            secret,
            encoding: "base32",
            token: otp,
            window: 0, // No window to ensure OTP is valid for the entire 10 minutes
            digits: 6,
            step: 600, // 10 minutes
        });
    }
}

// const otp = EmailOTPServices.generateOTP();
// console.log(otp)
// console.log(EmailOTPServices.verifyOTP(otp , 123))


module.exports = Otp;
