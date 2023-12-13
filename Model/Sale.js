const mongoose = require("mongoose");
const { Schema } = mongoose;

const saleItemSchema = new Schema({
  name: String,
  unit: String,
  quantity: String,
  salePrice: String,
  disc: String,
  gst: String,
  amount: String,
  date: String,
});

const saleSchema = new Schema({
  user: String,
  invoiceType: String,
  invoiceNum: String,
  clientName: String,
  clientContact: String,
  clientAddress: String,
  saleItem: [saleItemSchema], // Modify saleItem to an array of saleItemSchema
  tag: String,
  payMode: String,
  today: String,
  totalDiscount: String,
  totalGST: String,
  id: String,
});

module.exports = mongoose.model("saleHistory", saleSchema);
