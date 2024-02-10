const CourseRepository = require('../repository/course-repository');
const UserRepository = require('../repository/user-repository');
const CategoryRepository = require('../repository/category-repository');
const uploadImageToCloudinary = require('../utils/imageUploader');

const courseRepository = new CourseRepository();
const userRepository = new UserRepository();
const categoryRepository = new CategoryRepository();

class CourseService {
    async createCourse(userId,data,thumbnail) {
        try {
            //Validation:-
            if(!data || !thumbnail){
                throw {
                    message: 'All Fields are mandatory'
                }
            }
            if (!data.status || data.status === undefined){
                data.status = "Draft";
            }
            
            //check if user is an instructor or not:-
            const instructorDetails = await userRepository.get(userId, {accountType: 'Instructor'});
            if(!instructorDetails){
                throw {
                    message: 'Instructor details not found'
                }
            }
            
            //check if given category tag is valid:-
            const categoryDetails = await categoryRepository.get(data.category);
            if(!categoryDetails){
                throw {
                    message: 'Category details not found'
                }
            }
            
            //upload thumbnail image to cloudinary
            const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
            
            //Now create a new course
            data.instructor = instructorDetails._id;
            data.category = categoryDetails._id;
            data.thumbnail = thumbnailImage.secure_url;
            const newCourse = await courseRepository.create(data);
            
            //Add new course to user-schema of instructor
            await userRepository.update(instructorDetails._id,{$push: {course: newCourse._id}});
            
            //Add new course to the category schema
            await categoryRepository.update(data.category,{$push: {course: newCourse._id}});
            
            //Return courseData
            return newCourse;
        } catch (error) {
            console.log('Something went wrong in Service layer');
            throw error;
        }
    }

    async getAllCourses() {
        try {
            const courses = await courseRepository.getAll().populate('instructor').exec();
            return courses;
        } catch (error) {
            console.log('Something went wrong in Service layer');
            throw error;
        }
    }

    async getCourseDetails(courseId) {
        try {
            const courseDetails = await courseRepository.getAll({_id: courseId})
            .populate(
                {
                    path:"instructor",
                    populate:{
                        path:"additionalDetails",
                    },
                }
            )
            .populate("category")
            //.populate("ratingAndreviews")
            .populate({
                path:"courseContent",
                populate:{
                    path:"subSection",
                },
            })
            .exec();
            
            //Validate
            if(!courseDetails){
                throw {
                    message: `Could not find the course with ${courseId}`
                }
            }
            //return course details
            return courseDetails;
        } catch (error) {
            console.log('Something went wrong in Service layer');
            throw error;
        }
    }
}

module.exports = CourseService;