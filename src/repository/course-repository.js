const Course = require('../models/course');

class CourseRepository {
    async create(data) {
        try {
            const course = await Course.create(data);
            return course;
        } catch (error) {
            console.log('Something went wrong in Repository layer');
            throw error;
        }
    }

    async getAll() {
        try {
            const courses = await Course.find({});
            return courses;
        } catch (error) {
            console.log('Something went wrong in Repository layer');
            throw error;
        }
    }

    async update(id,data) {
        try {
            const course = await Course.findByIdAndUpdate(id,data, {new: true});
            return course;
        } catch (error) {
            console.log('Something went wrong in Repository layer');
            throw error;
        }
    }
}

module.exports = CourseRepository;