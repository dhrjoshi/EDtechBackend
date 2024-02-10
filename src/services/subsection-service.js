const SubSectionRepository = require('../repository/subsection-repository');
const SectionRepository = require('../repository/section-repository');
const uploadImageToCloudinary = require('../utils/imageUploader');
const dotenv = require('dotenv');
dotenv.config();

const subSectionRepository = new SubSectionRepository();
const sectionRepository = new SectionRepository();

class SubSectionService {
    async createSubSection(data,sectionId,video) {
        try {
            //Validate:-
            if(!data || !sectionId || !video){
                throw {
                    message: 'All fields are required'
                }
            }
            
            //Upload video to cloudinary
            const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
            
            //create subsection
            data.timeDuration = `${uploadDetails.duration}`;
            data.videoUrl = uploadDetails.secure_url;
            const newSubSection = await subSectionRepository.create(data);

            //update section:-
            const updatedSection = await sectionRepository.update(sectionId,{$push: {subSection: newSubSection._id}}).populate('subSection');
            return updatedSection;
        } catch (error) {
            console.log('Something went wrong in Service layer');
            throw error;
        }
    }

    // async updateSubSection()    ---> will see this later

    async deleteSubSection(data) {
        try {
            //remove this subsection from section
            await sectionRepository.update(data.sectionId, {$pull: {subSection: data.subSectionId}});
            const subSection = await subSectionRepository.destroy(data.subSectionId);
            //Validate
            if(!subSection){
                throw {
                    message: 'SubSection not found'
                }
            }
            return true;
        } catch (error) {
            console.log('Something went wrong in Service layer');
            throw error;
        }
    }
}

module.exports = SubSectionService;