import express from "express";
import { db } from "../db.js"; // Assuming this path is correct
import { authenticateToken, verifyRoles } from "../middleware/verifyRoles.js"; // Assuming this path is correct
import validator from "validator";

const router = express.Router();

// Get all directory entries
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM directory ORDER BY title ASC");
    // Convert members string to array for frontend compatibility
    // This now correctly expects a comma-separated string from the DB
    const parsedRows = rows.map(row => ({
      ...row,
      members: row.members ? row.members.split(",").map(m => m.trim()).filter(m => m) : []
    }));
    res.json(parsedRows);
  } catch (err) {
    console.error("Error fetching directory entries:", err);
    res.status(500).json({ message: "Failed to fetch directory entries" });
  }
});

// Create directory entry
router.post(
  "/",
  authenticateToken,
  verifyRoles(["admin"]),
  async (req, res) => {
    // `members` will now be a comma-separated string directly from the frontend
    const { title, subtitle, poBox, tel, email, members } = req.body;
    const created_by = req.user?.id; // Assuming req.user.id is set by authenticateToken

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!created_by) {
      return res.status(403).json({ message: "User not authenticated or ID missing" });
    }

    // Validate email if provided
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    try {
      await db.query(
        "INSERT INTO directory (title, subtitle, poBox, tel, email, members, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)",
        // `members` is now directly passed as a string
        [title, subtitle || null, poBox || null, tel || null, email || null, members || null, created_by]
      );
      res.status(201).json({ message: "Directory entry added successfully" });
    } catch (err) {
      console.error("Error adding directory entry:", err.message, err.stack);
      res.status(500).json({ message: "Error adding directory entry", error: err.message });
    }
  }
);

// Update directory entry
router.put(
  "/:id",
  authenticateToken,
  verifyRoles(["admin"]),
  async (req, res) => {
    const { id } = req.params;
    // `members` will now be a comma-separated string directly from the frontend
    const { title, subtitle, poBox, tel, email, members } = req.body;
    const updated_by = req.user?.id; // Get the user ID from the token

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!updated_by) {
      return res.status(403).json({ message: "User not authenticated for update" });
    }

    // Validate email if provided
    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    try {
      const [result] = await db.query(
        "UPDATE directory SET title = ?, subtitle = ?, poBox = ?, tel = ?, email = ?, members = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        // `members` is now directly passed as a string, and `updated_by` is added
        [title, subtitle || null, poBox || null, tel || null, email || null, members || null, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Directory entry not found" });
      }

      res.json({ message: "Directory entry updated successfully" });
    } catch (err) {
      console.error("Error updating directory entry:", err);
      res.status(500).json({ message: "Error updating directory entry" });
    }
  }
);

// Delete directory entry
router.delete("/:id", authenticateToken, verifyRoles(["admin"]), async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM directory WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Directory entry not found" });
    }
    res.json({ message: "Directory entry deleted successfully" });
  } catch (err) {
    console.error("Error deleting directory entry:", err);
    res.status(500).json({ message: "Error deleting directory entry" });
  }
});

export default router;
