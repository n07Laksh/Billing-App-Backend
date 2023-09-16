const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({

    name:{
        type:String,
        require:true
    },

    email:{
        type:String,
        require:true,
    },
    
    password:{
        type:String,
        require:true,
    },
    deviceName:{
        type:String,
    },
    devicePlatform:{
        type:String,
    },
    deviceType:{
        type:String,
    },
});

module.exports = mongoose.model("users", userSchema);