import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import { getApiUrl } from "../../utils/api";
import apiEndpoints from "../../constants/apiEndpoints";

export default function Event() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  // Fetch events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${getApiUrl()}${apiEndpoints.EVENTS}`);
      setEvents(res.data);
      setFilteredEvents(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading events", err);
      setError("Failed to load events");
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = events.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        (event.description && event.description.toLowerCase().includes(query)) ||
        (event.location && event.location.toLowerCase().includes(query))
    );
    setFilteredEvents(filtered);
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

  // Submit new or updated event
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("event_date", form.event_date);
    formData.append("location", form.location);
    if (form.image) {
      formData.append("image", form.image);
    }
    if (isEditing && !form.image) {
      formData.append("image_url", form.image_url || "");
    }

    try {
      if (isEditing) {
        console.log("Sending PUT to:", `${getApiUrl()}${apiEndpoints.EVENTS}${editId}`);
        await axios.put(`${getApiUrl()}${apiEndpoints.EVENTS}${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        console.log("Sending POST to:", `${getApiUrl()}${apiEndpoints.EVENTS}`);
        await axios.post(`${getApiUrl()}${apiEndpoints.EVENTS}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      setShowModal(false);
      setForm({ title: "", description: "", event_date: "", location: "", image: null });
      setImagePreview(null);
      setIsEditing(false);
      setEditId(null);
      setError("");
      setSearchQuery("");
      fetchEvents();
    } catch (err) {
      console.error("Error saving event:", {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers,
        message: err.message,
      });
      setError(err.response?.data?.message || "Error saving event");
    }
  };

  // Handle edit button click
  const handleEdit = (event) => {
    setForm({
      title: event.title,
      description: event.description || "",
      event_date: event.event_date,
      location: event.location || "",
      image: null,
      image_url: event.image_url || "",
    });
    setImagePreview(event.image_url || null);
    setEditId(event.id);
    setIsEditing(true);
    setShowModal(true);
  };

  // Delete event
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;
    const token = sessionStorage.getItem("token");

    try {
      await axios.delete(`${getApiUrl()}${apiEndpoints.EVENTS}${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((e) => e.id !== id));
      setFilteredEvents(filteredEvents.filter((e) => e.id !== id));
    } catch (err) {
      console.error("Error deleting event", err);
      setError(err.response?.data?.message || "Error deleting event");
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Manage Events</h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={handleSearch}
            className="border p-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            className="bg-secondary text-white px-4 py-2 rounded hover:bg-secondary/90"
            onClick={() => {
              setForm({ title: "", description: "", event_date: "", location: "", image: null });
              setImagePreview(null);
              setIsEditing(false);
              setShowModal(true);
            }}
          >
            + Add Event
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p>Loading events...</p>
      ) : filteredEvents.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="grid gap-4">
          {filteredEvents.map((event) => (
            <div key={event.id} className="p-4 border rounded bg-white shadow">
              <h2 className="text-xl font-semibold text-primary">{event.title}</h2>
              <p className="text-gray-600">
                {new Date(event.event_date).toLocaleDateString()} | {event.location || "No location"}
              </p>
              {event.image_url && (
                <img
                  src={`${getApiUrl()}${event.image_url}`}
                  alt={event.title}
                  className="mt-2 h-32 object-cover rounded"
                />
              )}
              {event.description && (
                <p className="text-gray-600 mt-2">{event.description}</p>
              )}
              <div className="mt-2 flex gap-2">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => handleEdit(event)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => handleDelete(event.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal without Backdrop */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              {isEditing ? "Edit Event" : "Add New Event"}
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
              <input
                type="date"
                name="event_date"
                value={form.event_date}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={form.location}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
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
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              ></textarea>

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