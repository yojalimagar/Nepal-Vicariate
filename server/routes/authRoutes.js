import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "../db.js";
import { authenticateToken } from "../middleware/verifyRoles.js";

dotenv.config();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// -------------------
// REGISTER
// -------------------
router.post("/register", async (req, res) => {
  const { username, email, password, role = "user" } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const [existingUsers] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, hashedPassword, role]
    );

    res.status(201).json({ message: "User registered successfully", userId: result.insertId });
  } catch (err) {
    console.error("Error during registration:", err.message, err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// -------------------
// LOGIN
// -------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  try {
    const [results] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (results.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error during login:", err.message, err.stack);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// -------------------
// GET CURRENT USER (AUTH ME)
// -------------------
router.get("/me", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

export default router;