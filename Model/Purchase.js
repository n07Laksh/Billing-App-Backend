const mongoose = require("mongoose");
const { Schema } = mongoose;

const purchaseItemSchema = new Schema({
  name: String,
  unit: String,
  quantity: String,
  salePrice: String,
  disc: String,
  gst: String,
  amount: String,
  date: String,
});

const purchaseSchema = new Schema({
  user: String,
  invoiceType: String,
  supplierName: String,
  billNum: String,
  tag: String,
  purchaseItem: [purchaseItemSchema], // Modify purchaseItem to an array of purchaseItemSchema
  payMode: String,
  today: String,
  totalDiscount: String,
  totalGST: String,
  id: String,
});

module.exports = mongoose.model("purchasedatas", purchaseSchema);
