const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const ResumeBackup = require("../models/ResumeBackup");
const {
  createResumeSnapshot,
  restoreResumeSnapshot,
} = require("../services/resumeService");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 1. Validate request
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    // 2. Find user
    // password has select:false, so explicitly select it
    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // 3. Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // 4. If user logs in, create a backup
    if (user.role === "user") {
      const existingBackup = await ResumeBackup.findOne({
        userId: user._id,
      });

      if (!existingBackup) {
        const snapshot = await createResumeSnapshot();

        await ResumeBackup.create({
          userId: user._id,
          backupData: snapshot,
        });
      }
    }

    // 5. Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      },
    );

    // 6. Send response
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed",
    });
  }
};
const logout = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Only restore resume for user
    if (req.user.role === "user") {
      const backup = await ResumeBackup.findOne({
        userId: userId,
      });

      if (backup) {
        await restoreResumeSnapshot(backup);

        await ResumeBackup.findByIdAndDelete(backup._id);
      }
    }

    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);

    return res.status(500).json({
      message: "Logout failed",
    });
  }
};
module.exports = {
  login,
  logout,
};
