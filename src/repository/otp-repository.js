const OTP = require('../models/otp');

class OTPRepository {
    async create(data) {
        try {
            const otp = await OTP.create(data);
            return otp;
        } catch (error) {
            console.log('Something went wrong in Repository layer');
            throw error;
        }
    }

    async get(data) {
        try {
            const otp = await OTP.find(data);
            return otp;
        } catch (error) {
            console.log('Something went wrong in Repository layer');
            throw error;
        }
    }

    async findBy(data) {
        try {
            const otp = await OTP.findOne(data);
            return otp;
        } catch (error) {
            console.log('Something went wrong in Repository layer');
            throw error;
        }
    }
}

module.exports = OTPRepository;