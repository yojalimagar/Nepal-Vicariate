import express from "express";
import { db } from "../db.js";
import { authenticateToken, verifyRoles } from "../middleware/verifyRoles.js";
import { upload } from "../config/multer.js"; // Import Multer configuration
import path from "path";

const router = express.Router();

// Get all news articles (no change needed here for fetching)
router.get("/", async (req, res) => {
  try {
    // Make sure 'link' is selected, which it will be with SELECT *
    const [rows] = await db.query("SELECT * FROM news ORDER BY publish_date DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching news:", err);
    res.status(500).json({ message: "Failed to fetch news articles" });
  }
});

// Create a new news article with image upload and now, link
router.post(
  "/",
  authenticateToken,
  verifyRoles(["admin"]),
  upload.single("image"), // Handle single image upload
  async (req, res) => {
    // Add 'link' to the destructuring
    const { title, content, publish_date, author, link } = req.body;
    const created_by = req.user?.id;
    const image_url = req.file ? `/Uploads/${req.file.filename}` : null;

    // Validate required fields (link is optional)
    if (!title || !publish_date) {
      return res.status(400).json({ message: "Title and publish date are required" });
    }

    if (!created_by) {
      return res.status(403).json({ message: "User not authenticated" });
    }

    try {
      await db.query(
        "INSERT INTO news (title, content, publish_date, author, image_url, link, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)", // Add 'link' here
        [title, content, publish_date, author || null, image_url, link || null, created_by] // Add 'link' here
      );
      res.status(201).json({ message: "News article added successfully" });
    } catch (err) {
      console.error("Error adding news article:", err.message, err.stack);
      res.status(500).json({ message: "Error adding news article", error: err.message });
    }
  }
);

// Update a news article with image upload and now, link
router.put(
  "/:id",
  authenticateToken,
  verifyRoles(["admin"]),
  upload.single("image"), // Handle single image upload
  async (req, res) => {
    const { id } = req.params;
    // Add 'link' to the destructuring
    const { title, content, publish_date, author, link } = req.body;
    const image_url = req.file ? `/Uploads/${req.file.filename}` : req.body.image_url || null;

    // Validate required fields
    if (!title || !publish_date) {
      return res.status(400).json({ message: "Title and publish date are required" });
    }

    try {
      const [result] = await db.query(
        "UPDATE news SET title = ?, content = ?, publish_date = ?, author = ?, image_url = ?, link = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", // Add 'link = ?' here
        [title, content, publish_date, author || null, image_url, link || null, id] // Add 'link' here
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "News article not found" });
      }

      res.json({ message: "News article updated successfully" });
    } catch (err) {
      console.error("Error updating news article:", err);
      res.status(500).json({ message: "Error updating news article" });
    }
  }
);

// Delete a news article (no change needed)
router.delete("/:id", authenticateToken, verifyRoles(["admin"]), async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM news WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "News article not found" });
    }
    res.json({ message: "News article deleted successfully" });
  } catch (err) {
    console.error("Error deleting news article:", err);
    res.status(500).json({ message: "Error deleting news article" });
  }
});

export default router;