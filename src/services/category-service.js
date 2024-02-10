const CategoryRepository = require('../repository/category-repository');

const categoryRepository = new CategoryRepository();

class CategoryService {
    async createCategory(data) {
        try {
            //Validate
            if(!data){
                throw {
                    message: 'All fields are required'
                }
            }
            const category = await categoryRepository.create(data);
            return category;
        } catch (error) {
            console.log('Something went wrong in Service layer');
            throw error;
        }
    }

    async getAllCategories() {
        try {
            ///this might create a problem later
            const categories = await categoryRepository.getAll();
            return categories;
        } catch (error) {
            console.log('Something went wrong in Service layer');
            throw error;
        }
    }

    //Category page details:-
    async getCategory(id) {
        try {
            const category = await categoryRepository.get(id).populate('courses').exec();
            //Validate
            if(!category){
                throw {
                    message: 'Data not Found...'
                }
            }
            //get courses for different categories:-
            const differentCategories = await categoryRepository.getAll({_id: {$ne: id}}).populate('courses').exec();
            return {category, differentCategories};
        } catch (error) {
            console.log('Something went wrong in Service layer');
            throw error;
        }
    }
}

module.exports = CategoryService;