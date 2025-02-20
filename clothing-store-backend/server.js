const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const Product = require("./models/Product");
const Order = require("./models/Order");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());  // ✅ Ensures JSON is parsed
app.use(express.urlencoded({ extended: true })); // ✅ Handles form data

// Middleware to handle empty JSON requests
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON format" });
  }
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", async () => {
  console.log("✅ MongoDB connected, создаём индексы...");

  try {
    await Product.createIndexes(); // ✅ Автоматически создаёт индекс по category
    await Order.createIndexes();   // ✅ Автоматически создаёт индекс по user_id
    console.log("✅ Индексы успешно созданы!");
  } catch (error) {
    console.error("❌ Ошибка создания индексов:", error);
  }
});
db.on("error", (err) => console.error("❌ MongoDB error:", err));

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));

console.log("✅ Routes loaded: /api/users, /api/products, /api/orders");

app.get("/", (req, res) => {
  res.send("🚀 API is running! Available routes: /api/users, /api/products, /api/orders");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
