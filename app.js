const express = require("express");
const app = express();
require("dotenv").config();
require("./config/db");
const cors = require("cors");
const AuthRoutes = require("./routes/auth");
const OrderRoutes = require("./routes/order");
const ProductRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", AuthRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/orders", OrderRoutes);
app.use("/api/cart", cartRoutes);

// creating port
app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
