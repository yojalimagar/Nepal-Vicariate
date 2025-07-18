import express from "express";
import { db } from "../db.js";
import { authenticateToken, verifyRoles } from "../middleware/verifyRoles.js";
import { upload } from "../config/multer.js"; // Import Multer configuration
import path from "path";

const router = express.Router();

// Get all events
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM events ORDER BY event_date DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ message: "Failed to fetch events" });
  }
});

// Create event with image upload
router.post(
  "/",
  authenticateToken,
  verifyRoles(["admin"]),
  upload.single("image"), // Handle single image upload
  async (req, res) => {
    const { title, description, event_date, location } = req.body;
    const created_by = req.user?.id;
    const image_url = req.file ? `/Uploads/${req.file.filename}` : null; // Store relative path

    // Validate required fields
    if (!title || !event_date) {
      return res.status(400).json({ message: "Title and event date are required" });
    }

    if (!created_by) {
      return res.status(403).json({ message: "User not authenticated" });
    }

    try {
      await db.query(
        "INSERT INTO events (title, description, event_date, location, image_url, created_by) VALUES (?, ?, ?, ?, ?, ?)",
        [title, description, event_date, location, image_url, created_by]
      );
      res.status(201).json({ message: "Event added successfully" });
    } catch (err) {
      console.error("Error adding event:", err.message, err.stack);
      res.status(500).json({ message: "Error adding event", error: err.message });
    }
  }
);

// Update event with image upload
router.put(
  "/:id",
  authenticateToken,
  verifyRoles(["admin"]),
  upload.single("image"), // Handle single image upload
  async (req, res) => {
    const { id } = req.params;
    const { title, description, event_date, location } = req.body;
    const image_url = req.file ? `/Uploads/${req.file.filename}` : req.body.image_url || null;

    // Validate required fields
    if (!title || !event_date) {
      return res.status(400).json({ message: "Title and event date are required" });
    }

    try {
      const [result] = await db.query(
        "UPDATE events SET title = ?, description = ?, event_date = ?, location = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [title, description, event_date, location, image_url, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json({ message: "Event updated successfully" });
    } catch (err) {
      console.error("Error updating event:", err);
      res.status(500).json({ message: "Error updating event" });
    }
  }
);

// Delete event
router.delete("/:id", authenticateToken, verifyRoles(["admin"]), async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM events WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ message: "Error deleting event" });
  }
});

export default router;