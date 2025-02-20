const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");

dotenv.config();

// Подключение к MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const importData = async () => {
  try {
    console.log("🟡 Deleting old data...");
    await Product.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();

    console.log("🟡 Reading JSON files...");
    const products = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/products.json"), "utf-8"));
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/users.json"), "utf-8"));
    const orders = JSON.parse(fs.readFileSync(path.join(__dirname, "../data/orders.json"), "utf-8"));

    console.log("🟢 Importing data...");
    await Product.insertMany(products);
    await User.insertMany(users);
    await Order.insertMany(orders);

    console.log("✅ Data imported successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error importing data:", error);
    process.exit(1);
  }
};

importData();
