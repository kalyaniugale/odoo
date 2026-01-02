import User from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import generateToken from "../config/token.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "empty fields" });
    }
    let isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({ message: "user already exists" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "enter valid email" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "password must have 8 characters" });
    }

    let hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: `signup error ${error}` });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "empty fields" });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "user does not exist , register first !" });
    }

    if (!user.password) {
      return res.status(400).json({
        message: "Use Google login for this account",
      });
    }

    let isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "something went wrong" });
    }

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Login error ${error}` });
  }
};

export const googleSuccess = async (req, res) => {
  try {
    const user = req.user;

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(process.env.CLIENT_URL || "http://localhost:5173");
  } catch (error) {
    return res.redirect("/login");
  }
};

export const logout = async (req, res) => {
  try {
    await res.clearCookie("token");
    return res.status(201).json({ message: "logout successfully" });
  } catch (error) {
    return res.status(500).json({ message: "logout error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("name email role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};
