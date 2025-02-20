const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product_id: { type: Number, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1 },
    }
  ],
  total_price: { type: Number, required: true },
  order_date: { type: String, default: () => new Date().toISOString().split("T")[0] },
  status: { type: String, enum: ["Pending", "Shipped", "Delivered", "Cancelled"], default: "Pending" },
  shipping_address: { type: String, required: true },
  payment_method: { type: String, enum: ["visa", "mastercard", "paypal", "cash"], required: true }
});


module.exports = mongoose.model("Order", orderSchema);
