const Category = require('../models/category');

class CategoryRepository {
    async create(data) {
        try {
            const category = await Category.create(data);
            return category;
        } catch (error) {
            console.log('Something went wrong in Repository layer');
            throw error;
        }
    }

    async get(id) {
        try {
            const category = await Category.findById(id);
            return category;
        } catch (error) {
            console.log('Something went wrong in Repository layer');
            throw error;
        }
    }

    async getAll() {
        try {
            const categories = await Category.find({});
            return categories;
        } catch (error) {
            console.log('Something went wrong in Repository layer');
            throw error;
        }
    }

    async update(id,data) {
        try {
            const category = await Category.findByIdAndUpdate(id,data,{new: true});
            return category;
        } catch (error) {
            console.log('Something went wrong in Repository layer');
            throw error;
        }
    }
}

module.exports = CategoryRepository;