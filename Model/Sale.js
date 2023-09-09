const mongoose = require("mongoose");
const { Schema } = mongoose;

const saleSchema = new Schema({
    invoiceType: {
        type: String,
    },
    invoiceNum: {
        type: String,
    },
    clientName: {
        type: String,
    },
    clientContact: {
        type: String,
    },
    clientAddress: {
        type: String,
    },
    tag: {
        type: String,
    },
    name: {
        type: String,
    },
    unit: {
        type: String,
    },
    quantity: {
        type: String,
    },
    salePrice: {
        type: String,
    },
    disc: {
        type: String,
    },
    gst: {
        type: String,
    },
    amount: {
        type: String,
    },
    payMode: {
        type: String,
    },
    date: {
        type: String,
    },
    today: {
        type: String,
    },
    totalDiscount: {
        type: String,
    },
    totalGST: {
        type: String,
    },
    id: {
        type: String
    }
});

module.exports = mongoose.model("saleHistory", saleSchema);