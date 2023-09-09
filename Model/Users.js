const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({

    name:{
        type:String,
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
});

module.exports = mongoose.model("users", userSchema);