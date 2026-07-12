import User from "../models/User.js";
import { comparePassword, hashPassword, signAccessToken } from "../utils/auth.js";

const register = async (req, res) => {
  try {
    const { email, password, name } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: "User already exists." });
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({ email: email.toLowerCase(), passwordHash, name: name || "" });

    const token = signAccessToken({ id: user._id.toString(), email: user.email, role: user.role });

    return res.status(201).json({
      message: "User registered successfully.",
      token,
      user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("register error", error);
    return res.status(500).json({ error: "Failed to register user." });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isValid = await comparePassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = signAccessToken({ id: user._id.toString(), email: user.email, role: user.role });

    return res.json({
      message: "Login successful.",
      token,
      user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("login error", error);
    return res.status(500).json({ error: "Failed to login." });
  }
};

export { register, login };
