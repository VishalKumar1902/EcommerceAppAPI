const express = require("express");
const Product = require("../models/Product");

const { verifyToken, verifyRole } = require("../middleware/auth");

const router = express.Router();

// get all products

router.get("/", async (req, res) => {
  try {
    // get all products from database
    const products = await Product.find();
    // send all products to the frontend
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json("Internal server error");
  }
});

// Admin can add a new product

router.post("/", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || !description || !price) {
      return res
        .status(404)
        .json({ message: "provide name,price and description of the book" });
    }

    const product = {
      name,
      description,
      price,
    };
    const newProduct = new Product(product);
    await newProduct.save();
    res.status(200).json({ message: "book saved successfully" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

// Admin can update a product

router.put("/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const { name, description, price } = req.body;
    // get the id from req.params
    const { id } = req.params;

    // check if any field is empty
    if (!name || !description || !price) {
      return res
        .status(404)
        .json("please provide name, description and price of the book");
    }
    // update the book if everything is ok
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Admin can delete a product
router.delete("/:id", verifyToken, verifyRole("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    return res.status(200).json({ message: "product deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
});

module.exports = router;
