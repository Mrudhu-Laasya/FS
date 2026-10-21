require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./src/models/Admin");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const passwordHash = await bcrypt.hash("admin123", 12);
    
    const admin = await Admin.create({
      name: "Admin",
      email: "admin@example.com",
      passwordHash,
    });

    console.log("Admin created:", admin);
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

seedAdmin();