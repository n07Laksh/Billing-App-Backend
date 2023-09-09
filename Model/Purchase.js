const mongoose = require("mongoose");
const { Schema } = mongoose;

const purchaseSchema = new Schema({
    invoiceType:{
        type:String,       
    },
    supplierName:{
        type:String,
    },
    billNum:{
        type:String,
    },
    tag:{
        type:String,
    },
    name:{
        type:String,
    },
    unit:{
        type:String,
    },
    quantity:{
        type:String,
    },
    salePrice:{
        type:String,
    },
    disc:{
        type:String,
    },
    gst:{
        type:String,
    },
    amount:{
        type:String,
    },
    payMode:{
    type:String,
    },
    date: {
        type:String,
    },
    today: {
        type:String,
    },
    totalDiscount:{
        type:String,
    },
    totalGST:{
        type: String,
    },
    id:{
        type:String
    }

});

module.exports = mongoose.model("parchasedatas", purchaseSchema);