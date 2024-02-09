const express = require('express');
const app = express();

const connect = require('./config/database');

const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, async () => {
    console.log(`Server started on PORT ${PORT}`);
    await connect();
    console.log('Mongodb Connected');
});