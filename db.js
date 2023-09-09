const mongoose = require("mongoose");
require("dotenv").config();

const uri = process.env.MONGODB_URL || "mongodb://0.0.0.0:27017/admin";

const dbConnection = () => {
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Connected to the database");
        })
        .catch((error) => {
            console.error("Error connecting to the database:", error);
        });
};

module.exports = dbConnection;
