// const express = require("express");
// const router = express.Router();
// const Admin = require("../models/Admin");

// // POST: Admin Login
// router.post("/login", async (req, res) => {
//     try {
//       const { email, password } = req.body;
  
//       console.log("Received Login Request:", email, password); // Debugging
  
//       if (!email || !password) {
//         return res.status(400).json({ error: "All fields are required" });
//       }
  
//       const admin = await Admin.findOne({ email });
  
//       console.log("Found Admin in DB:", admin); // Debugging
  
//       if (!admin || admin.password !== password) {
//         return res.status(401).json({ error: "Invalid email or password" });
//       }
  
//       res.status(200).json({ message: "Login successful" });
//     } catch (error) {
//       console.error("Error during login:", error);
//       res.status(500).json({ error: "Server error" });
//     }
//   });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");

// POST: Admin Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if admin exists in DB
    const admin = await Admin.findOne({ email, password });

    if (!admin) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.status(200).json({ message: "Login successful" });
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
router.get("/current", async (req, res) => {
  try {
    const admin = await Admin.findOne(); // Fetch first admin (Modify if needed)
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
router.put("/update-password", async (req, res) => {
  try {
    const { email, password, newPassword } = req.body;

    const admin = await Admin.findOne({ email, password });

    if (!admin) {
      return res.status(401).json({ error: "Incorrect email or password" });
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

