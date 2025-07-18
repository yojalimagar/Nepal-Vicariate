import express from "express";
import { db } from "../db.js";
import { authenticateToken, verifyRoles } from "../middleware/verifyRoles.js";
import { upload } from "../config/multer.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Get all parish entries
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM parishes ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching parish entries:", err);
    res.status(500).json({ message: "Failed to fetch parish entries" });
  }
});

// Create a new parish entry
router.post(
  "/",
  authenticateToken,
  verifyRoles(["admin"]),
  upload.single("image"),
  async (req, res) => {
    const { title, description, additional_info } = req.body;
    const created_by = req.user?.id;
    const image_url = req.file ? `/Uploads/${req.file.filename}` : null;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!created_by) {
      return res.status(403).json({ message: "User not authenticated" });
    }

    try {
      await db.query(
        "INSERT INTO parishes (title, description, additional_info, image_url, created_by) VALUES (?, ?, ?, ?, ?)",
        [title, description || null, additional_info || null, image_url, created_by]
      );
      res.status(201).json({ message: "Parish entry added successfully" });
    } catch (err) {
      console.error("Error adding parish entry:", err.message, err.stack);
      res.status(500).json({ message: "Error adding parish entry", error: err.message });
    }
  }
);

// Update a parish entry
router.put(
  "/:id",
  authenticateToken,
  verifyRoles(["admin"]),
  upload.single("image"),
  async (req, res) => {
    const { id } = req.params;
    const { title, description, additional_info } = req.body;
    const image_url = req.file ? `/Uploads/${req.file.filename}` : req.body.image_url || null;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    try {
      const [result] = await db.query(
        "UPDATE parishes SET title = ?, description = ?, additional_info = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [title, description || null, additional_info || null, image_url, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Parish entry not found" });
      }

      res.json({ message: "Parish entry updated successfully" });
    } catch (err) {
      console.error("Error updating parish entry:", err);
      res.status(500).json({ message: "Error updating parish entry" });
    }
  }
);

// Delete a parish entry
router.delete("/:id", authenticateToken, verifyRoles(["admin"]), async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM parishes WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Parish entry not found" });
    }
    res.json({ message: "Parish entry deleted successfully" });
  } catch (err) {
    console.error("Error deleting parish entry:", err);
    res.status(500).json({ message: "Error deleting parish entry" });
  }
});

export default router;