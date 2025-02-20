const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");

  console.log("🔹 Token received:", token); // Проверяем, какой токен пришел

  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const tokenWithoutBearer = token.split(" ")[1]; // Убираем "Bearer"
    console.log("🔹 Token after split:", tokenWithoutBearer);

    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    console.log("✅ Token is valid:", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.log("❌ Token verification failed:", err.message);
    res.status(400).json({ message: "Invalid token" });
  }
};
