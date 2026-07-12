import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const hashPassword = async (password) => bcrypt.hash(password, 12);

const comparePassword = async (password, hashedPassword) => bcrypt.compare(password, hashedPassword);

const signAccessToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

const verifyAccessToken = (token) => jwt.verify(token, JWT_SECRET);

export { hashPassword, comparePassword, signAccessToken, verifyAccessToken };
