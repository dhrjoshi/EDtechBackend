const SubSection = require('../models/subsection');

class SubSectionRepository {
    async create(data) {
        try {
            const subsection = await SubSection.create(data);
            return subsection;
        } catch (error) {
            console.log('Something went wrong in Repository layer');
            throw error;
        }
    }

    async get(id) {
        try {
            const subsection = await SubSection.findById(id);
            return subsection;
        } catch (error) {
            console.log('Something went wrong in Repository layer');
            throw error;
        }
    }

    async destroy(id) {
        try {
            const subsection = await SubSection.findByIdAndDelete(id);
            return subsection;
        } catch (error) {
            console.log('Something went wrong in Repository layer');
            throw error;
        }
    }
}

module.exports = SubSectionRepository;