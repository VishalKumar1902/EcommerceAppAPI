const express = require("express");
const User = require("../models/User");
const Product = require("../models/Product");
const { verifyToken } = require("../middleware/auth");

const router = express.Router();

// Add product to cart (Authenticated Users Only)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        message: "Invalid quantity. Quantity must be a positive integer.",
      });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const cartItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (cartItem) {
      // If item exists, update the quantity
      cartItem.quantity += quantity;
    } else {
      // Add new item to the cart
      user.cart.push({ productId, quantity });
    }

    // Save updated user document
    await user.save();

    res.status(200).json({ message: "Item added to cart", cart: user.cart });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

// Get user's cart (Authenticated Users Only)
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // user ID is set in req.user by the verifyToken middleware
    const user = await User.findById(userId).populate("cart.productId"); // Populate product details

    res.status(200).json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

// Remove product from cart (Authenticated Users Only)
router.delete("/:productId", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Assuming the user ID is set in req.user by the verifyToken middleware
    const { productId } = req.params;

    // Find the user and remove the item from the cart
    const user = await User.findById(userId);
    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    // Save the updated user
    await user.save();

    res
      .status(200)
      .json({ message: "Item removed from cart", cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
});

// Update product quantity in the cart (Authenticated Users Only)
router.put("/:productId", verifyToken, async (req, res) => {
  try {
    const { quantity } = req.body;
    const userId = req.user.id;
    const { productId } = req.params;

    // Validate quantity
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({
        message: "Invalid quantity. Quantity must be a positive integer.",
      });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });

    const cartItem = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart." });
    }

    // Update the quantity
    cartItem.quantity = quantity;

    // Save updated user document
    await user.save();

    res.status(200).json({ message: "Item quantity updated", cart: user.cart });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error", error });
  }
});

module.exports = router;
