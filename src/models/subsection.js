const mongoose = require("mongoose");

const subsectionSchema = new mongoose.Schema({
	title: {
        type: String
    },
    timeDuration: {
        type: String
    },
    description: {
        type: String
    },
    videoUrl: {
        type: String
    }
});

const SubSection = mongoose.model("SubSection", subsectionSchema);
module.exports = SubSection;