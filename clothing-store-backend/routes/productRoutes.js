const express = require("express");
const Product = require("../models/Product");
const auth = require("../middleware/authMiddleware");
const checkAdmin = require("../middleware/checkAdmin");

const router = express.Router();

// ✅ Все пользователи могут видеть товары
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// 🚨 Только админ может добавить товар
router.post("/", auth, checkAdmin, async (req, res) => {
  try {
    const { name, price, category, stock, size, brand, color, material, release_date } = req.body;

    const product = new Product({
      product_id: Date.now(), // ✅ Генерируем уникальный ID
      name,
      category,
      price,
      stock,
      size: size || null, // 🟡 Опциональные поля
      brand: brand || null,
      color: color || null,
      material: material || null,
      release_date: release_date || null
    });

    await product.save();
    res.status(201).json({ message: "Товар добавлен", product });

  } catch (error) {
    res.status(500).json({ message: "Ошибка добавления товара: " + error.message });
  }
});

// 🚨 Только админ может обновить товар
router.put("/:id", auth, checkAdmin, async (req, res) => {
  try {
    const { name, price, category, stock, size, brand, color, material, release_date } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        category,
        price,
        stock,
        size: size || null, // 🟡 Опциональные поля
        brand: brand || null,
        color: color || null,
        material: material || null,
        release_date: release_date || null
      },
      { new: true } // ✅ Вернёт обновлённый объект
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Товар не найден" });
    }

    res.json({ message: "Товар обновлён", updatedProduct });

  } catch (error) {
    res.status(500).json({ message: "Ошибка обновления товара: " + error.message });
  }
});

// 🚨 Только админ может удалить товар
router.delete("/:id", auth, checkAdmin, async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Товар не найден" });
    }
    res.json({ message: "Товар удалён" });

  } catch (error) {
    res.status(500).json({ message: "Ошибка удаления товара: " + error.message });
  }
});

module.exports = router;
