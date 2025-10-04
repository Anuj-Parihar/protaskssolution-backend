require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const bodyParser = require("body-parser");

const app = express();

// Middleware
// app.use(cors({
//   origin: ['https://www.protaskssolution.com','https://protaskssolution.com']
// }));
app.use(cors());
// app.use(bodyParser.json());
app.use(express.json());
// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// Import Routes
const contactRoutes = require("./routes/contactRoutes");
const adminRoutes = require("./routes/adminRoutes"); // New admin login route

app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes); // New API route for admin authentication

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));