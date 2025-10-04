const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// POST - Submit Contact Form
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, country, state, city, service, message } = req.body;

    // Validation
    if (!name || !email || !phone || !country || !state || !city || !service || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newContact = new Contact({ name, email, phone, country, state, city, service, message });
    await newContact.save();

    res.status(201).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error submitting contact form:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// GET - Fetch All Responses
router.get("/", async (req, res) => {
  try {
    const responses = await Contact.find().sort({ createdAt: -1 }); // latest first
    res.status(200).json(responses);
  } catch (error) {
    console.error("Error fetching responses:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;