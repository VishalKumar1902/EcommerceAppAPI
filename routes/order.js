const express = require("express");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User"); // Import the User model
const { verifyToken, verifyRole } = require("../middleware/auth");
const router = express.Router();

// Place an order (Authenticated Users Only)
// Place an order (Authenticated Users Only)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { items, totalprice, paymentMethod, paid, deliveryAddress } =
      req.body;
    const userId = req.user.id;

    // Ensure all required fields are provided
    if (!paymentMethod || !deliveryAddress || typeof paid !== "boolean") {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log("Order data:", req.body);

    // Create the order
    const order = new Order({
      userId,
      products: items, // Assuming each item is an object with productId and quantity
      totalprice,
      status: "processing", // Default status
      paymentMethod, // New field
      paid, // New field
      deliveryAddress, // New field
    });

    // Save the order
    const savedOrder = await order.save();

    // After the order is saved, update the user:
    await User.findByIdAndUpdate(userId, {
      $push: { orders: savedOrder._id }, // Add the order ID to the user's orders array
      $set: { cart: [] }, // Clear the cart after placing the order
    });

    // Respond with success message
    res
      .status(201)
      .json({ message: "Order placed successfully", order: savedOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});
// admin can view all orders

router.get("/", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// User can view their own orders (Authenticated Users Only)
router.get("/mine", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user ID is set in req.user by the verifyToken middleware
    const orders = await Order.find({ userId }); // Find orders for the logged-in user
    return res.status(200).json(orders);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Route to update the order status (Admin only)
// Route to update the order status (Admin only)
router.put("/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Check if the status is valid
    if (!["pending", "processing", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Find the order by ID and update the status
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
