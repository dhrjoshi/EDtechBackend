const Profile = require('../models/profile');

class ProfileRepository {
    async create(data) {
        try {
            const profile = await Profile.create(data);
            return profile;
        } catch (error) {
            console.log('Something went wrong in Repository layer');
            throw error;
        }
    }
}

module.exports = ProfileRepository;