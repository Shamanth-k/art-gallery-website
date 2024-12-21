// backend/controllers/authController.js
const User = require("../models/user");

exports.login = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "No user found." });
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Invalid password." });
    const token = User.generateToken({ email: user.email, role: user.role });
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.register = async (req, res) => {
  const { email, username, password } = req.body;
  const role = "user"; // Default role for registration
  try {
    await User.createUser(email, username, password, role);
    res.json({ success: true, message: "Registration successful." });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
