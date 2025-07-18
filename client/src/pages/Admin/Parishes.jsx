import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";

export default function Parishes() {
  const [parishes, setParishes] = useState([]);
  const [filteredParishes, setFilteredParishes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    additional_info: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  // Fetch parish entries
  useEffect(() => {
    fetchParishes();
  }, []);

  const fetchParishes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/parishes");
      setParishes(res.data);
      setFilteredParishes(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading parish entries", err);
      setError("Failed to load parish entries");
      setLoading(false);
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = parishes.filter(
      (entry) =>
        entry.title.toLowerCase().includes(query) ||
        (entry.description && entry.description.toLowerCase().includes(query)) ||
        (entry.additional_info && entry.additional_info.toLowerCase().includes(query))
    );
    setFilteredParishes(filtered);
  };

  // Clear search input
  const clearSearch = () => {
    setSearchQuery("");
    setFilteredParishes(parishes);
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setForm({ ...form, image: file });
      setImagePreview(file ? URL.createObjectURL(file) : null);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Submit new or updated parish entry
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("additional_info", form.additional_info);
    if (form.image) {
      formData.append("image", form.image);
    }
    if (isEditing && !form.image) {
      formData.append("image_url", form.image_url || "");
    }

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/parishes/${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post("http://localhost:5000/api/parishes", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      setShowModal(false);
      setForm({ title: "", description: "", additional_info: "", image: null });
      setImagePreview(null);
      setIsEditing(false);
      setEditId(null);
      setError("");
      setSearchQuery("");
      fetchParishes();
    } catch (err) {
      console.error("Error saving parish entry:", {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers,
        message: err.message,
      });
      setError(err.response?.data?.message || "Error saving parish entry");
    }
  };

  // Handle edit button click
  const handleEdit = (entry) => {
    setForm({
      title: entry.title,
      description: entry.description || "",
      additional_info: entry.additional_info || "",
      image: null,
      image_url: entry.image_url || "",
    });
    setImagePreview(entry.image_url ? `http://localhost:5000${entry.image_url}` : null);
    setEditId(entry.id);
    setIsEditing(true);
    setShowModal(true);
  };

  // Delete parish entry
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this parish entry?")) return;
    const token = sessionStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/parishes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setParishes(parishes.filter((p) => p.id !== id));
      setFilteredParishes(filteredParishes.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting parish entry", err);
      setError(err.response?.data?.message || "Error deleting parish entry");
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Manage About Parish</h1>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title, description, or additional info..."
              value={searchQuery}
              onChange={handleSearch}
              className="border p-2 pl-10 rounded w-64 focus:outline-none focus:ring-2 focus:ring-primary text-transform-none"
              style={{ textTransform: "none" }}
              key="search-input"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                aria-label="Clear search"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <button
            className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90"
            onClick={() => {
              setForm({ title: "", description: "", additional_info: "", image: null });
              setImagePreview(null);
              setIsEditing(false);
              setShowModal(true);
            }}
          >
            + Add About Parish
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p>Loading parish entries...</p>
      ) : (
        <div className="grid gap-4">
          {filteredParishes.length === 0 && searchQuery ? (
            <p>No parish entries found.</p>
          ) : (
            filteredParishes.map((entry) => (
              <div key={entry.id} className="p-4 border rounded bg-white shadow">
                <h2 className="text-xl font-semibold text-primary">{entry.title}</h2>
                {entry.image_url && (
                  <img
                    src={`http://localhost:5000${entry.image_url}`}
                    alt={entry.title}
                    className="mt-2 h-32 object-cover rounded"
                  />
                )}
                {entry.description && (
                  <p className="text-gray-600 mt-2 line-clamp-3">{entry.description}</p>
                )}
                {entry.additional_info && (
                  <p className="text-gray-600 mt-2 line-clamp-3">{entry.additional_info}</p>
                )}
                
                <div className="mt-2 flex gap-2">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleEdit(entry)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDelete(entry.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal without Backdrop */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {isEditing ? "Edit About Parish" : "Add New About Parish"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3" encType="multipart/form-data">
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                rows="5"
              ></textarea>
              <textarea
                name="additional_info"
                placeholder="Additional Information"
                value={form.additional_info}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                rows="3"
              ></textarea>
              <input
                type="file"
                name="image"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2 h-32 object-cover rounded"
                />
              )}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setImagePreview(null);
                    setError("");
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