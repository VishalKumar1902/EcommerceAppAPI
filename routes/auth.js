// No middleware needed since these routes are for login and registration

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check if user already exists in a database
    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // if user do not exists create a user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return res.status(200).json({ message: "user created successfully" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

//login

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Please provide both username and password" });
    }

    // check if user exists or not
    const user = await User.findOne({ username: username });
    // if user does not exists then exit the function
    if (!user) {
      return res.status(404).json({ message: "Invalid credentials" });
    }
    // if user exists then compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    // if password matched then generate a token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    // send a token to frontend
    res.status(200).json({ token, role: user.role });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
