import express from "express";
import { db } from "../db.js";
import { authenticateToken, verifyRoles } from "../middleware/verifyRoles.js";
import { upload } from "../config/multer.js"; // Ensure your multer config supports multiple files if needed
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Get all gallery items with optional search
router.get("/", async (req, res) => {
  const { search } = req.query;
  try {
    let query = "SELECT * FROM gallery ORDER BY created_at DESC";
    let queryParams = [];

    if (search) {
      query = "SELECT * FROM gallery WHERE title LIKE ? OR description LIKE ? ORDER BY created_at DESC";
      queryParams = [`%${search}%`, `%${search}%`];
    }

    const [rows] = await db.query(query, queryParams);
    console.log("Sending gallery items:", rows);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching gallery items:", err);
    res.status(500).json({ message: "Failed to fetch gallery items" });
  }
});

// Create new gallery item(s) - MODIFIED FOR MULTIPLE UPLOADS
router.post("/", authenticateToken, verifyRoles(["admin"]), upload.array("images", 10), async (req, res) => { // 'images' is the field name, 10 is max count
  const { title, description } = req.body;
  console.log("Received files:", req.files); // Now req.files is an array
  const created_by = req.user?.id;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "At least one image is required" });
  }

  if (!title) {
    return res.status(400).json({ message: "Title is required for all images" });
  }

  if (!req.user) {
    return res.status(403).json({ message: "User not authenticated" });
  }

  try {
    const values = req.files.map(file => [
      title, // Using the same title for all images uploaded at once
      description || null,
      `/Uploads/${file.filename}`,
      created_by
    ]);

    // Construct a query to insert multiple rows
    const query = "INSERT INTO gallery (title, description, image_url, created_by) VALUES ?";
    await db.query(query, [values]);

    res.status(201).json({ message: `${req.files.length} gallery item(s) added successfully` });
  } catch (err) {
    console.error("Error adding gallery item(s):", err.message, err.stack);
    res.status(500).json({ message: "Error adding gallery item(s)", error: err.message });
  }
});

// Update a gallery item - Handles single image update (or keeps old one)
router.put("/:id", authenticateToken, verifyRoles(["admin"]), upload.single("images"), async (req, res) => { // Changed field name to 'images' for consistency
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  const { title, description } = req.body;
  console.log("Received file for update:", req.file);
  // If a new file is uploaded, use its URL, otherwise use the existing image_url from the form
  const image_url = req.file ? `/Uploads/${req.file.filename}` : req.body.image_url;

  if (!title || !image_url) {
    return res.status(400).json({ message: "Title and image are required" });
  }

  try {
    // Only delete old image if a new file is being uploaded
    if (req.file) {
      const [rows] = await db.query("SELECT image_url FROM gallery WHERE id = ?", [id]);
      if (rows.length > 0) {
        const oldImagePath = path.join(__dirname, "..", rows[0].image_url);
        try {
          // Check if file exists before trying to delete
          await fs.access(oldImagePath);
          await fs.unlink(oldImagePath);
          console.log("Old image deleted:", oldImagePath);
        } catch (err) {
          // If file doesn't exist, log a warning but don't stop the update
          if (err.code === 'ENOENT') {
            console.warn("Old image file not found, skipping deletion:", oldImagePath);
          } else {
            console.error("Error deleting old image:", err);
          }
        }
      }
    }

    const [result] = await db.query(
      "UPDATE gallery SET title = ?, description = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [title, description || null, image_url, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    res.json({ message: "Gallery item updated successfully" });
  } catch (err) {
    console.error("Error updating gallery item:", err);
    res.status(500).json({ message: "Error updating gallery item" });
  }
});

// Delete a single gallery item (already correct)
router.delete("/:id", authenticateToken, verifyRoles(["admin"]), async (req, res) => {
  const { id } = req.params;
  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  console.log("Received single delete ID:", id);
  try {
    const [rows] = await db.query("SELECT image_url FROM gallery WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    const imagePath = path.join(__dirname, "..", rows[0].image_url);
    try {
      await fs.access(imagePath); // Check if file exists
      await fs.unlink(imagePath);
      console.log("Image deleted successfully:", imagePath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.warn("Image file not found, skipping deletion:", imagePath);
      } else {
        console.error("Error deleting image file:", err);
      }
    }

    const [result] = await db.query("DELETE FROM gallery WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    res.json({ message: "Gallery item deleted successfully" });
  } catch (err) {
    console.error("Error deleting gallery item:", err);
    res.status(500).json({ message: "Error deleting gallery item" });
  }
});

// Delete multiple gallery items (already correct and robust)
// In galleryRoutes.js, inside your DELETE /bulk route:
// galleryRoutes.js
router.delete("/bulk", authenticateToken, verifyRoles(["admin"]), async (req, res) => {
  const { ids } = req.body;

  // These logs are crucial!
  console.log("\n--- BACKEND BULK DELETE DEBUG ---");
  console.log("Request Body:", JSON.stringify(req.body, null, 2));
  console.log("Received 'ids' array:", ids);

  if (Array.isArray(ids)) {
    console.log("IDs array length:", ids.length);
    ids.forEach((id, index) => {
      const isIdNaN = isNaN(id);
      console.log(`ID[${index}]: Value='${id}', Type='${typeof id}', isNaN=${isIdNaN}`);
      if (isIdNaN) {
        console.error(`PROBLEM DETECTED: Non-numeric ID at index ${index}:`, id);
      }
    });
  } else {
    console.log("ERROR: 'ids' is NOT an array. Type:", typeof ids);
  }
  console.log("--- END BACKEND BULK DELETE DEBUG ---\n");

  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: "No items selected for deletion" });
  }

  if (ids.some(id => isNaN(id))) {
    const problematicId = ids.find(id => isNaN(id));
    console.error(`Backend: Invalid ID format detected! Problematic ID - Value: '${problematicId}', Type: '${typeof problematicId}'`);
    return res.status(400).json({ message: "Invalid ID format in bulk delete" });
  }

  // ... rest of your backend logic ...
});

export default router;