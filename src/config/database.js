const mongoose = require('mongoose');

const connect = async () => {
    mongoose.connect('mongodb://localhost/majorProject');
}

module.exports = connect;