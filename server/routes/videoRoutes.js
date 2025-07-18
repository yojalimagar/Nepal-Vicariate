import express from "express";
import { db } from "../db.js";
import { authenticateToken, verifyRoles } from "../middleware/verifyRoles.js";

const router = express.Router();

// Get all videos
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM videos ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching videos:", err);
    res.status(500).json({ message: "Failed to fetch videos" });
  }
});

// Create a new video
router.post(
  "/",
  authenticateToken,
  verifyRoles(["admin"]),
  async (req, res) => {
    const { title, video_url, description } = req.body;
    const created_by = req.user?.id;

    // Validate required fields
    if (!title || !video_url) {
      return res.status(400).json({ message: "Title and video URL are required" });
    }

    if (!created_by) {
      return res.status(403).json({ message: "User not authenticated" });
    }

    try {
      await db.query(
        "INSERT INTO videos (title, video_url, description, created_by) VALUES (?, ?, ?, ?)",
        [title, video_url, description || null, created_by]
      );
      res.status(201).json({ message: "Video added successfully" });
    } catch (err) {
      console.error("Error adding video:", err.message, err.stack);
      res.status(500).json({ message: "Error adding video", error: err.message });
    }
  }
);

// Update a video
router.put(
  "/:id",
  authenticateToken,
  verifyRoles(["admin"]),
  async (req, res) => {
    const { id } = req.params;
    const { title, video_url, description } = req.body;

    // Validate required fields
    if (!title || !video_url) {
      return res.status(400).json({ message: "Title and video URL are required" });
    }

    try {
      const [result] = await db.query(
        "UPDATE videos SET title = ?, video_url = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [title, video_url, description || null, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Video not found" });
      }

      res.json({ message: "Video updated successfully" });
    } catch (err) {
      console.error("Error updating video:", err);
      res.status(500).json({ message: "Error updating video" });
    }
  }
);

// Delete a video
router.delete("/:id", authenticateToken, verifyRoles(["admin"]), async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM videos WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error("Error deleting video:", err);
    res.status(500).json({ message: "Error deleting video" });
  }
});

export default router;