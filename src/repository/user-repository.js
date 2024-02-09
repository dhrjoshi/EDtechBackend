const User = require('../models/user');

class UserRepository {
    async create(data) {
        try {
            const user = await User.create(data);
            return user;
        } catch (error) {
            console.log('Something went wrong in Repository layer');
            throw error;
        }
    }

    async findBy(data) {
        try {
            const user = await User.findOne(data);
            return user;
        } catch (error) {
            console.log('Something went wrong in Repository layer');
            throw error;
        }
    }

    async get(id) {
        try {
            const user = await User.findById(id);
            return user;
        } catch (error) {
            console.log('Something went wrong in Repository layer');
            throw error;
        }
    }

    async update(id,data) {
        try {
            const user = await User.findByIdAndUpdate(id,data,{new: true});
            return user;
        } catch (error) {
            console.log('Something went wrong in Repository layer');
            throw error;
        }
    }

    async findByAndUpdate(filter,data) {
        try {
            const user = await User.findOneAndUpdate(filter,data);
            return user;
        } catch (error) {
            console.log('Something went wrong in Repository layer');
            throw error;
        }
    }
}

module.exports = UserRepository;