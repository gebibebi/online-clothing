const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_id: { type: Number, unique: true }, // ✅ ID пользователя
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },  // 👈 Пароль должен быть обязательным
  gender: { type: String, enum: ["Male", "Female", "Other"], required: false }, // 👤 Пол (опционально)
  phone: { type: String, required: false },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: false },
    zip: { type: String, required: true }
  },
  registration_date: { type: String, required: true }, // 📅 Дата регистрации
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user" // ✅ По умолчанию "user"
  },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }] // ✅ Список заказов пользователя
});

module.exports = mongoose.model("User", userSchema);
