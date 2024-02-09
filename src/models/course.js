const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    courseName: {
        type: String,
		required: true,
		trim: true
    },
    courseDescription: {
        type: String,
		required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    whatYouWillLearn: {
        type: String
    },
    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
        required: true
    }],
    ratingAndReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RatingAndReview'
    }],
    price:{
        type: Number,
        required: true
    },
    thumbnail: {
        type: String
    },
    tag: {
        type: [String],
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    instructions: {
        type: [String]
    },
    status: {
        type: String,
        enum: ['Draft','Published']
    }
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;