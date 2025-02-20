const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  product_id: { type: Number, unique: true }, // ✅ Уникальный ID продукта
  name: { type: String, required: true }, // ✅ Общее название продукта
  category: { type: String, required: true }, // ✅ Категория
  size: { type: String, required: false }, // 🟡 Опционально (есть не у всех товаров)
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  brand: { type: String, required: false }, // 🟡 Опционально
  color: { type: String, required: false }, // 🟡 Опционально
  material: { type: String, required: false }, // 🟡 Опционально
  release_date: { type: String, required: false } // 🟡 Опционально
});

module.exports = mongoose.model("Product", productSchema);
