import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import { getApiUrl } from "../../utils/api";
import apiEndpoints from "../../constants/apiEndpoints";
export default function Gallery() {
  const [galleryItems, setGalleryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    // Change 'image' to 'images' to hold an array of files
    images: [], // For new uploads
    image_url: "", // For existing image URL in edit mode
  });
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  // Change 'imagePreview' to 'imagePreviews' for multiple URLs
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  // Fetch gallery items
  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await axios.get(`${getApiUrl}${apiEndpoints.GALLERY}`);
      console.log("Fetched gallery items:", res.data);
      const validItems = res.data.filter(item => !isNaN(item.id) && item.id !== "bulk");
      if (validItems.length !== res.data.length) {
        console.warn("Filtered out invalid items:", res.data.filter(item => isNaN(item.id) || item.id === "bulk"));
      }
      setGalleryItems(validItems);
      setFilteredItems(validItems);
      setLoading(false);
    } catch (err) {
      console.error("Error loading gallery items:", err);
      setError("Failed to load gallery items");
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query === "") {
      setFilteredItems(galleryItems);
    } else {
      const filtered = galleryItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
      );
      setFilteredItems(filtered);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") { // Changed name from 'image' to 'images'
      const selectedFiles = Array.from(files); // Convert FileList to Array
      console.log("Selected files:", selectedFiles);
      setForm({ ...form, images: selectedFiles });
      // Create URLs for all selected files for preview
      setImagePreviews(selectedFiles.map(file => URL.createObjectURL(file)));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

 // Gallery.jsx

// ... existing imports and state declarations ...

// Handle checkbox toggle
const handleCheckboxToggle = (id) => {
  // Console log the type and value of id received here
  console.log("Toggling checkbox for ID:", id, "Type:", typeof id); // Add this line for debugging

  // Your existing validation: if (isNaN(id) || id === "bulk") { ... }
  // This check is good but sometimes `id` could be a string like "123" which `isNaN` passes

  setSelectedItems((prev) => {
    const numericId = Number(id); // <--- **CRITICAL CHANGE: Convert to a number**

    // Add a check to prevent adding NaN or non-valid numbers
    if (isNaN(numericId)) {
      console.error("Attempted to toggle checkbox with an invalid numeric ID:", id);
      // Optionally, show a user-friendly error message if this happens unexpectedly
      // setError("Could not select item due to invalid ID format.");
      return prev; // Do not modify selectedItems
    }

    if (prev.includes(numericId)) {
      return prev.filter((itemId) => itemId !== numericId);
    } else {
      return [...prev, numericId];
    }
  });
};

// ... rest of your component
  // Submit new or updated gallery item
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);

    // If editing and no new image is selected, keep the old image_url
    if (isEditing && form.images.length === 0 && form.image_url) {
      formData.append("image_url", form.image_url);
    }

    // Append all selected images for new additions or updates where images are selected
    if (form.images.length > 0) {
      form.images.forEach((image, index) => {
        formData.append(`images`, image); // Append each image with the same field name
        console.log(`Sending file ${index + 1}:`, image);
      });
    }

    try {
      if (isEditing) {
        // For editing, we still send a single update request for one item
        // The backend will handle if a new image is provided or the old one is kept
        const res = await axios.put(`${getApiUrl}${apiEndpoints.GALLERY}${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Update response:", res.data);
      } else {
        // For new additions, we send a single request but expect multiple files on the backend
        const res = await axios.post(`${getApiUrl}${apiEndpoints.GALLERY}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Post response:", res.data);
      }
      setShowModal(false);
      setForm({ title: "", description: "", images: [], image_url: "" }); // Reset images
      setImagePreviews([]); // Clear image previews
      setIsEditing(false);
      setEditId(null);
      setError("");
      setSearchQuery("");
      setSelectedItems([]);
      fetchGallery();
    } catch (err) {
      console.error("Error saving gallery item:", err);
      setError(err.response?.data?.message || "Error saving gallery item");
    }
  };

  // Handle edit button click
  const handleEdit = (item) => {
    if (isNaN(item.id) || item.id === "bulk") {
      console.error("Invalid edit ID:", item.id);
      setError("Invalid item ID");
      return;
    }
    setForm({
      title: item.title,
      description: item.description || "",
      images: [], // No new images selected initially for edit
      image_url: item.image_url,
    });
    setImagePreviews([item.image_url]); // Show the current image for preview
    setEditId(item.id);
    setIsEditing(true);
    setShowModal(true);
  };

  // Delete single gallery item
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this gallery item?")) return;
    if (isNaN(id) || id === "bulk") {
      console.error("Invalid ID for single delete:", id);
      setError("Invalid item ID");
      return;
    }
    console.log("Deleting single item ID:", id);
    const token = sessionStorage.getItem("token");
    try {
      await axios.delete(`${getApiUrl}${apiEndpoints.GALLERY}${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchGallery();
      setSelectedItems([]);
      setError("");
    } catch (err) {
      console.error("Error deleting gallery item:", err);
      setError(err.response?.data?.message || "Error deleting gallery item");
    }
  };

  // Delete multiple selected gallery items
  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      setError("No items selected for deletion");
      return;
    }
    if (selectedItems.some(id => isNaN(id) || id === "bulk")) {
      console.error("Invalid IDs in bulk delete:", selectedItems);
      setError("Invalid item IDs selected");
      return;
    }
    console.log("Deleting selected item IDs:", selectedItems);
    if (!window.confirm(`Delete ${selectedItems.length} selected gallery item(s)?`)) return;
    const token = sessionStorage.getItem("token");
    try {
      await axios.delete(`${getApiUrl}${apiEndpoints.GALLERY}/bulk`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids: selectedItems },
      });
      await fetchGallery();
      setSelectedItems([]);
      setError("");
    } catch (err) {
      console.error("Error deleting selected gallery items:", err);
      setError(err.response?.data?.message || "Error deleting selected gallery items");
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Manage Gallery</h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by title or description..."
            value={searchQuery}
            onChange={handleSearch}
            className="border p-2 rounded w-64"
          />
          <button
            className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90"
            onClick={() => {
              setForm({ title: "", description: "", images: [], image_url: "" }); // Reset images
              setImagePreviews([]); // Clear image previews
              setIsEditing(false);
              setEditId(null);
              setShowModal(true);
            }}
          >
            + Add Image(s)
          </button>
          <button
            className={`px-4 py-2 rounded ${
              selectedItems.length > 0
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            onClick={handleBulkDelete}
            disabled={selectedItems.length === 0}
          >
            Delete Selected
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p>Loading gallery...</p>
      ) : filteredItems.length === 0 ? (
        <p>No gallery items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            console.log("Rendering item with ID:", item.id);
            return (
              <div key={item.id} className="p-4 border rounded bg-white shadow relative">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleCheckboxToggle(item.id)}
                  className="absolute top-2 left-2 h-5 w-5"
                />
                <img
                  src={`${getApiUrl}${item.image_url}`}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded"
                  onError={() => console.error("Image failed to load:", item.image_url)}
                />
                <h2 className="text-lg font-semibold text-primary mt-2">{item.title}</h2>
                {item.description && (
                  <p className="text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                )}
                <div className="mt-2 flex gap-2">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => {
                      console.log("Clicked Delete for ID:", item.id);
                      handleDelete(item.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal with White Shadow Box */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Gallery Item" : "Add New Gallery Item(s)"}</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="file"
                name="images" // Changed name to 'images'
                accept="image/jpeg,image/png,image/gif"
                multiple={!isEditing} // Allow multiple files only when adding new items
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required={!isEditing && form.images.length === 0} // Required only if not editing and no images selected
              />
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {imagePreviews.map((src, index) => (
                    <img
                      key={index}
                      src={isEditing && !form.images.length ? `${getApiUrl}${src}` : src}
                      alt={`Preview ${index + 1}`}
                      className="h-32 object-cover rounded"
                    />
                  ))}
                </div>
              )}
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                rows="4"
              ></textarea>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setError("");
                    setImagePreviews([]); // Clear previews on cancel
                    setForm({ title: "", description: "", images: [], image_url: "" }); // Reset form
                  }}
                  className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
                >
                  {isEditing ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}