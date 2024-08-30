const nodemailer = require('nodemailer');
const OTP = require('./OTP');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.username;
    this.url = url;
    this.from = `${process.env.ADMINEMAIL}`;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.ADMINEMAIL,
        pass: process.env.ADMINPASSWORD
      }
    });
  }

  // Send the actual email
  async sendOTP(subject, otp) {
    // generate otp
    const messaeg = `your otp is ${otp} , verify Your Email Know ${this.url}`
    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: messaeg
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.sendOTP('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for only 10 minutes)'
    );
  }
};
