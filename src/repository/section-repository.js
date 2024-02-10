const Section = require('../models/section');

class SectionRepository {
    async create(data) {
        try {
            const section = await Section.create(data);
            return section;
        } catch (error) {
            console.log('Something went wrong in Repository layer');
            throw error;
        }
    }

    async update(id,data) {
        try {
            const section = await Section.findByIdAndUpdate(id,data,{new: true});
            return section;
        } catch (error) {
            console.log('Something went wrong in Repository layer');
            throw error;
        }
    }

    async destroy(id) {
        try {
            const section = await Section.findByIdAndDelete(id);
            return section;
        } catch (error) {
            console.log('Something went wrong in Repository layer');
            throw error;
        }
    }
}

module.exports = SectionRepository;