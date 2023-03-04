
const mongoose = require('mongoose')
require("dotenv").config();
const { MONGO_URL} = process.env;

const connectDb = () => {
    try {
        mongoose
        .connect(MONGO_URL, {
          useUnifiedTopology: true,
          useNewUrlParser: true,
        })
        console.log("Database connection established")
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = connectDb