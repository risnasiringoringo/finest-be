const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

exports.registerUser = async (req, res) => {
  try {
    const { role_id, first_name, last_name, email, no_hp, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      role_id,
      first_name,
      last_name,
      email,
      no_hp,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "User registered successfully", data: newUser });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Akun tidak ditemukan, silahkan daftar" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Email atau password kamu salah, silahkan coba lagi",
      });
    }

    const token = jwt.sign(
      { userId: user.id, roleId: user.role_id },
      "your-secret-key",
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      first_name: user.first_name,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

exports.logoutUser = (req, res) => {
  try {
    res.setHeader("Authorization", "");

    res.clearCookie("token");

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};
