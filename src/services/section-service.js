const SectionRepository = require('../repository/section-repository');
const CourseRepository = require('../repository/course-repository');

const sectionRepository = new SectionRepository();
const courseRepository = new CourseRepository();

class SectionService {
    async createSection(data,courseId) {
        try {
            //Validate:-
            if(!data || !courseId){
                throw {
                    message: 'Missing required properties'
                }
            }
            const newSection = await sectionRepository.create(data);
            
            //Now update course section array:-
            const updatedCourse = await courseRepository.update(courseId,{$push: {courseContent: newSection._id}}).populate({path: 'courseContent', populate: {path: 'subSection'}}).exec();

            //Return 
            return updatedCourse;
        } catch (error) {
            console.log('Something went wrong in Service layer');
            throw error;
        }
    }

    async updateSection(id,data) {
        try {
            const section = await sectionRepository.update(id,data);
            return section;
        } catch (error) {
            console.log('Something went wrong in Service layer');
            throw error;
        }
    }

    async deleteSection(id) {
        try {
            const section = await sectionRepository.destroy(id);
            return section;
        } catch (error) {
            console.log('Something went wrong in Service layer');
            throw error;
        }
    }
}

module.exports = SectionService;