const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// 🔥 Регистрация нового пользователя
// 🔥 Регистрация нового пользователя
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password, role, gender, phone, address, registration_date } = req.body;

    console.log("🔹 Регистрация:", email);

    if (!password) {
      return res.status(400).json({ message: "Пароль обязателен!" });
    }

    // Проверяем, существует ли пользователь с таким email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ Email уже используется:", email);
      return res.status(400).json({ message: "Email уже используется" });
    }

    // 🚨 Проверяем, есть ли админ в базе
    const adminExists = await User.findOne({ role: "admin" });

    // Если поле "role" не указано, по умолчанию "user"
    let userRole = role || "user";

    // 🚨 Запрещаем создавать второго админа
    if (userRole === "admin" && adminExists) {
      console.log("❌ Администратор уже существует");
      return res.status(403).json({ message: "Администратор уже существует" });
    }

    // ✅ Хешируем пароль перед сохранением (если не пустой)
    console.log("🔍 Оригинальный пароль:", password);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("🔍 Хешированный пароль:", hashedPassword);

    // ✅ Создаём пользователя со всеми полями
    const user = new User({
      first_name,
      last_name,
      email,
      password: hashedPassword, // 👈 Теперь точно хешируем!
      role: userRole,
      gender: gender || null,
      phone: phone || null,
      address: address || {
        street: null,
        city: null,
        state: null,
        zip: null
      },
      registration_date: registration_date || new Date().toISOString().split("T")[0]
    });

    await user.save();
    console.log("✅ Пользователь зарегистрирован:", email);
    res.status(201).json({ message: "Пользователь зарегистрирован", user });

  } catch (error) {
    console.log("❌ Ошибка регистрации:", error.message);
    res.status(500).json({ message: "Ошибка регистрации: " + error.message });
  }
});


// 🔥 Логин пользователя
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔹 Логин:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("✅ User found:", user.email);
    console.log("🔍 Stored hashed password:", user.password);
    console.log("🔍 Entered password:", password);

    // ✅ Проверяем пароль с `bcrypt.compare`
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔍 Password match result:", isMatch);

    if (!isMatch) {
      console.log("❌ Password does not match for:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("✅ Password matches!");

    // ✅ Генерируем JWT-токен
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });

  } catch (error) {
    console.log("❌ Ошибка входа:", error.message);
    res.status(500).json({ message: "Ошибка входа: " + error.message });
  }
});

module.exports = router;
