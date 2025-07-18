import express from "express";
import { db } from "../db.js";
import validator from "validator";

const router = express.Router();

// POST /api/contact - Save contact form submission
router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate required fields
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate email
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO contact (name, email, subject, message) VALUES (?, ?, ?, ?)",
      [name, email, subject, message]
    );
    res.status(201).json({ message: "Contact message sent successfully", id: result.insertId });
  } catch (err) {
    console.error("Error saving contact message:", err.message, err.stack);
    res.status(500).json({ message: "Error saving contact message", error: err.message });
  }
});

// GET /api/contact - Fetch all contact messages
// This is now a separate, top-level route definition
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM contact ORDER BY created_at DESC");
    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching contact messages:", err.message, err.stack);
    res.status(500).json({ message: "Error fetching contact messages", error: err.message });
  }
});

// DELETE /api/contact/:id - Delete a message by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM contact WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error('Error deleting contact message:', err.message);
    res.status(500).json({ message: 'Error deleting contact message' });
  }
});

export default router;