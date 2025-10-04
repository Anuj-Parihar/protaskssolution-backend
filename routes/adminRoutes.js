const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
// POST: Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const admin = await Admin.findOne({ email, password });
    if (!admin) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST: Add New Admin (For Testing Purpose)
router.post("/add-admin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newAdmin = new Admin({ email, password });
    await newAdmin.save();

    res.status(201).json({ message: "Admin added successfully!" });
  } catch (error) {
    console.error("Error adding admin:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get current admin details
router.get("/current", authMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id); // Use decoded JWT info
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }
    res.json(admin);
  } catch (error) {
    console.error("Error fetching admin details", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update admin password
router.put("/update-password", authMiddleware, async (req, res) => {
  try {
    const { newPassword } = req.body;

    const admin = await Admin.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    admin.password = newPassword;
    await admin.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;