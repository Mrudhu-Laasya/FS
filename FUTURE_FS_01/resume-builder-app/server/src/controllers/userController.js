const bcrypt = require("bcrypt");
const User = require("../models/User");

const createUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const createUserResponse = await User.create({
      username: req.body.username,
      password: hashedPassword,
    });
    res.json(createUserResponse);
    console.log("User created successfully");
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { createUser };
