const mongoose = require("mongoose");
const { Schema } = mongoose;

const subscriptionSchema = new Schema({

    userId:{
        type:String,
    },

    startDate:{
        type:String,
        require:true,
    },
    
    endDate:{
        type:String,
        require:true,
    }
});

module.exports = mongoose.model("subscription", subscriptionSchema);