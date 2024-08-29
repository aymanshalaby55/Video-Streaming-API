const speakeasy = require("speakeasy");

class EmailOTPServices {
    static generateSecret() {
        return speakeasy.generateSecret({ length: 20 }).base32;
    }

    static generateOTP(secret) {
        return speakeasy.totp({
            secret,
            encoding: "base32",
            digits: 4,
        });
    }

    static verifyOTP(otp, secret) {
        return speakeasy.totp.verify({
            secret,
            encoding: "base32",
            token: otp,
            window: 4,
            digits: 4,
        });
    }
}  

module.exports = EmailOTPServices;
