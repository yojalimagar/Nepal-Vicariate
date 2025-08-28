import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import { getApiUrl } from "../../utils/api";
import apiEndpoints from "../../constants/apiEndpoints";
// Custom Confirmation Modal Component
const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm relative">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Confirm Action</h2>
        <p className="mb-6 text-gray-700">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminDirectory() {
  const [directory, setDirectory] = useState([]);
  const [filteredDirectory, setFilteredDirectory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // For Add/Edit form modal
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    poBox: "",
    tel: "",
    email: "",
    // members is still an array for internal state and display
    members: [],
  });
  // NEW STATE: To hold the raw string typed by the user in the textarea
  const [rawMembersInput, setRawMembersInput] = useState("");

  const [error, setError] = useState("");

  // State for custom confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState("");

  // Fetch directory entries
  useEffect(() => {
    fetchDirectory();
  }, []);

const fetchDirectory = async () => {
  try {
    const res = await axios.get(`${getApiUrl()}${apiEndpoints.DIRECTORY}`);
    // Sort the data by ID in descending order to show newest entries first
    const sortedData = res.data.sort((a, b) => b.id - a.id);
    setDirectory(sortedData);
    setFilteredDirectory(sortedData);
    setLoading(false);
  } catch (err) {
    console.error("Error loading directory", err);
    setError("Failed to load directory");
    setLoading(false);
  }
};

  // Handle search input change
const handleSearch = (e) => {
  const query = e.target.value.toLowerCase();
  setSearchQuery(query);
  const filtered = directory.filter(
    (entry) =>
      entry.title.toLowerCase().includes(query) ||
      (entry.subtitle && entry.subtitle.toLowerCase().includes(query)) ||
      (entry.email && entry.email.toLowerCase().includes(query)) ||
      entry.members.some((member) => member.toLowerCase().includes(query))
  );
  // Sort filtered results by ID in descending order
  setFilteredDirectory(filtered.sort((a, b) => b.id - a.id));
};

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // UPDATED: Now just sets the raw input string
  const handleRawMembersInputChange = (e) => {
    setRawMembersInput(e.target.value);
  };

  // Submit new or updated directory entry
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    const token = sessionStorage.getItem("token");
    if (!token) {
      setError("Authentication required. Please log in.");
      setShowModal(false); // Close modal if no token
      return;
    }

    // NEW: Parse the raw input string into the members array here for submission
    const processedMembers = rawMembersInput.split(",").map((m) => m.trim()).filter(m => m);

    // Prepare data as a plain object for JSON
    const dataToSend = {
      title: form.title,
      subtitle: form.subtitle,
      poBox: form.poBox,
      tel: form.tel,
      email: form.email,
      members: processedMembers.join(", "), // Send as comma-separated string to backend
    };

    try {
      if (isEditing) {
        const idToEdit = parseInt(editId, 10);
        await axios.put(`${getApiUrl()}${apiEndpoints.DIRECTORY}${idToEdit}`, dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post(`${getApiUrl()}${apiEndpoints.DIRECTORY}`, dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setShowModal(false);
      // Reset form and raw input
      setForm({ title: "", subtitle: "", poBox: "", tel: "", email: "", members: [] });
      setRawMembersInput(""); // IMPORTANT: Reset raw input too
      setIsEditing(false);
      setEditId(null);
      setSearchQuery(""); // Clear search to see new/updated entry
      fetchDirectory(); // Re-fetch all data to ensure UI is up-to-date
    } catch (err) {
      console.error("Error saving directory entry:", {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers,
        message: err.message,
      });
      setError(err.response?.data?.message || "Error saving directory entry");
    }
  };

  // Handle edit button click
  const handleEdit = (entry) => {
    setForm({
      title: entry.title || "",
      subtitle: entry.subtitle || "",
      poBox: entry.poBox || "",
      tel: entry.tel || "",
      email: entry.email || "",
      // form.members should still be an array for display/internal logic
      members: Array.isArray(entry.members) ? entry.members : (entry.members ? entry.members.split(',').map(m => m.trim()) : []),
    });
    // NEW: Set rawMembersInput for editing
    setRawMembersInput(Array.isArray(entry.members) ? entry.members.join(", ") : (entry.members || ""));
    
    setEditId(entry.id);
    setIsEditing(true);
    setShowModal(true);
  };

  // Trigger custom confirmation modal for deletion
  const handleDeleteClick = (id) => {
    setConfirmMessage("Are you sure you want to delete this directory entry?");
    setConfirmAction(() => () => deleteEntry(id)); // Store the action to be performed
    setShowConfirmModal(true);
  };

  // Actual deletion logic
  const deleteEntry = async (id) => {
    setShowConfirmModal(false); // Close confirmation modal
    setError(""); // Clear previous errors

    const token = sessionStorage.getItem("token");
    if (!token) {
      setError("Authentication required. Please log in.");
      return;
    }

    try {
      await axios.delete(`${getApiUrl()}${apiEndpoints.DIRECTORY}${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Optimistically update the UI
      setDirectory(directory.filter((e) => e.id !== id));
      setFilteredDirectory(filteredDirectory.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Error deleting directory entry", err);
      setError(err.response?.data?.message || "Error deleting directory entry");
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Manage Directory</h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search directory..."
            value={searchQuery}
            onChange={handleSearch}
            className="border p-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90"
            onClick={() => {
              // Reset form and raw input when adding new entry
              setForm({ title: "", subtitle: "", poBox: "", tel: "", email: "", members: [] });
              setRawMembersInput(""); 
              setIsEditing(false);
              setShowModal(true);
            }}
          >
            + Add Entry
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p>Loading directory...</p>
      ) : filteredDirectory.length === 0 ? (
        <p>No directory entries found.</p>
      ) : (
        <div className="grid gap-4">
          {filteredDirectory.map((entry) => (
            <div key={entry.id} className="p-4 border rounded bg-white shadow">
              <h2 className="text-xl font-semibold text-primary">{entry.title}</h2>
              {entry.subtitle && <h3 className="text-lg font-medium text-gray-700">{entry.subtitle}</h3>}
              <p className="text-gray-600">P.O. Box: {entry.poBox || "N/A"}</p>
              <p className="text-gray-600">Tel: {entry.tel || "N/A"}</p>
              <p className="text-gray-600">
                Email: <a href={`mailto:${entry.email}`} className="text-blue-600 hover:underline">{entry.email || "N/A"}</a>
              </p>
              <ul className="list-disc list-inside text-gray-600 mt-2">
                {/* Ensure members is an array before mapping */}
                {Array.isArray(entry.members) && entry.members.map((member, idx) => (
                  <li key={idx}>{member}</li>
                ))}
              </ul>
              <div className="mt-2 flex gap-2">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => handleEdit(entry)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => handleDeleteClick(entry.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Add/Edit Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {isEditing ? "Edit Directory Entry" : "Add New Directory Entry"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                name="title"
                placeholder="Vicariate Office Title"
                value={form.title}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="text"
                name="subtitle"
                placeholder="Subtitle"
                value={form.subtitle}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="text"
                name="poBox"
                placeholder="P.O. Box"
                value={form.poBox}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="tel"
                name="tel"
                placeholder="Telephone"
                value={form.tel}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <textarea
                name="members"
                placeholder="Members with roles (comma-separated, e.g., John Doe - Director, Jane Smith - Coordinator)"
                value={rawMembersInput} // BIND TO NEW RAW INPUT STATE
                onChange={handleRawMembersInputChange} // USE NEW HANDLER
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setError("");
                    setRawMembersInput(""); // Ensure raw input is cleared on cancel
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

      {/* Custom Confirmation Modal */}
      {showConfirmModal && (
        <ConfirmModal
          message={confirmMessage}
          onConfirm={confirmAction}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </AdminLayout>
  );
}
