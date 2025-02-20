const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const auth = require("../middleware/authMiddleware");
const checkAdmin = require("../middleware/checkAdmin");

const router = express.Router();

/**
 * ✅ 1. Получить все заказы (🔒 Только админ)
 */
router.get("/", auth, checkAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Ошибка получения заказов: " + error.message });
  }
});

/**
 * ✅ 2. Получить заказ по ID (🔒 Пользователь видит только свои заказы)
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Проверяем валидность ID заказа
    if (isNaN(id)) {
      return res.status(400).json({ message: "Некорректный ID заказа" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Заказ не найден" });
    }

    // Обычный пользователь может видеть только свои заказы
    if (req.user.role !== "admin" && order.user_id.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Доступ запрещён" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Ошибка получения заказа: " + error.message });
  }
});

/**
 * ✅ 3. Создать заказ (🔒 Только аутентифицированные пользователи)
 */
router.post("/", auth, async (req, res) => {
  try {
    const { products, shipping_address, payment_method } = req.body;

    // Проверяем, что `products` - массив чисел (product_id)
    if (!Array.isArray(products) || products.some(id => typeof id !== "number")) {
      return res.status(400).json({ message: "Некорректный формат product_id" });
    }

    // Получаем информацию о товарах по `product_id`
    const productDetails = await Product.find({ product_id: { $in: products } });

    if (productDetails.length !== products.length) {
      return res.status(400).json({ message: "Некоторые товары не найдены" });
    }

    // Формируем массив товаров
    const orderedProducts = productDetails.map(product => ({
      product_id: product.product_id, // Используем product_id, а не _id
      name: product.name || "Название отсутствует",
      price: product.price || 0,
      quantity: products.filter(id => id === product.product_id).length,
    }));

    // Рассчитываем общую сумму заказа
    const total_price = orderedProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);

    // Создаём заказ
    const order = new Order({
      user_id: req.user.userId,
      products: orderedProducts,
      total_price,
      status: "Pending",
      shipping_address,
      payment_method,
    });

    await order.save();
    res.status(201).json({ message: "Заказ создан", order });
  } catch (error) {
    res.status(500).json({ message: "Ошибка создания заказа: " + error.message });
  }
});

/**
 * ✅ 4. Обновить статус заказа (🔒 Только админ)
 */
router.put("/:id", auth, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ message: "Некорректный ID заказа" });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status }, // ✅ Только статус может изменять админ
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Заказ не найден" });
    }

    res.json({ message: "Статус заказа обновлён", updatedOrder });
  } catch (error) {
    res.status(500).json({ message: "Ошибка обновления заказа: " + error.message });
  }
});

/**
 * ✅ 5. Удалить заказ (🔒 Только админ)
 */
router.delete("/:id", auth, checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).json({ message: "Некорректный ID заказа" });
    }

    await Order.findByIdAndDelete(id);
    res.json({ message: "Заказ удалён" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка удаления заказа: " + error.message });
  }
});

module.exports = router;
