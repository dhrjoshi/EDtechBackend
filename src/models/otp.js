const mongoose = require('mongoose');
const mailSender = require('../utils/mainSender');
const verificationTemplate = require('../mailTemplates/emailVerificationEmail');

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60*5
    }
});

async function sendVerificationEmail(email,otp) {
    try {
        const mailResponse = await mailSender(email,"Verification Email",verificationTemplate(otp));
        console.log('Mail sent successfully');
        console.log(mailResponse.response);
    } catch (error) {
        console.log('Error occured while sending email');
        throw error;
    }
}

otpSchema.pre('save', async (next) => {
    await sendVerificationEmail(this.email,this.otp);
    next();
})

const OTP = mongoose.model('OTP', otpSchema);
module.exports = OTP;