import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import {getApiUrl} from "../../utils/api";
import apiEndpoints from "../../constants/apiEndpoints";
export default function News() {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    publish_date: "",
    author: "",
    link: "", // Added link field here
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  // Fetch news articles
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await axios.get(`${getApiUrl()}${apiEndpoints.NEWS}`);
      setNews(res.data);
      setFilteredNews(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading news", err);
      setError("Failed to load news articles");
      setLoading(false);
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = news.filter(
      (newsItem) =>
        newsItem.title.toLowerCase().includes(query.toLowerCase()) ||
        (newsItem.author && newsItem.author.toLowerCase().includes(query.toLowerCase())) ||
        (newsItem.content && newsItem.content.toLowerCase().includes(query.toLowerCase())) // Also search in content
    );
    setFilteredNews(filtered);
  };

  // Clear search input
  const clearSearch = () => {
    setSearchQuery("");
    setFilteredNews(news);
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

  // Submit new or updated news article
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    const formData = new FormData();

    // Append all form fields
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("publish_date", form.publish_date);
    formData.append("author", form.author);
    formData.append("link", form.link); // Append the new link field

    if (form.image) {
      formData.append("image", form.image);
    }
    // Only send image_url if not uploading a new image during edit
    if (isEditing && !form.image && form.image_url) {
      formData.append("image_url", form.image_url);
    }

    try {
      if (isEditing) {
        await axios.put(`${getApiUrl()}${apiEndpoints.NEWS}${editId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.post(`${getApiUrl()}${apiEndpoints.NEWS}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      setShowModal(false);
      // Reset form fields, including link
      setForm({ title: "", content: "", publish_date: "", author: "", link: "", image: null });
      setImagePreview(null);
      setIsEditing(false);
      setEditId(null);
      setError("");
      setSearchQuery(""); // Clear search to show updated list
      fetchNews(); // Re-fetch all news to show changes
    } catch (err) {
      console.error("Error saving news:", {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers,
        message: err.message,
      });
      setError(err.response?.data?.message || "Error saving news article");
    }
  };

  // Handle edit button click
  const handleEdit = (newsItem) => {
    setForm({
      title: newsItem.title,
      content: newsItem.content || "",
      publish_date: newsItem.publish_date, // This needs to be 'YYYY-MM-DD' for date input
      author: newsItem.author || "",
      link: newsItem.link || "", // Set the link for editing
      image: null, // Don't set image directly, it's a file input
      image_url: newsItem.image_url || "", // Store current image URL for display/re-submission if no new image
    });
    // For date input, ensure format is 'YYYY-MM-DD'
    const formattedDate = newsItem.publish_date ? new Date(newsItem.publish_date).toISOString().split('T')[0] : '';
    setForm(prevForm => ({ ...prevForm, publish_date: formattedDate }));

    setImagePreview(newsItem.image_url ? `${getApiUrl()}${newsItem.image_url}` : null);
    setEditId(newsItem.id);
    setIsEditing(true);
    setShowModal(true);
  };

  // Delete news article
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this news article?")) return;
    const token = sessionStorage.getItem("token");
    try {
      await axios.delete(`${getApiUrl()}${apiEndpoints.NEWS}${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNews(news.filter((n) => n.id !== id));
      setFilteredNews(filteredNews.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error deleting news", err);
      setError(err.response?.data?.message || "Error deleting news article");
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Manage News</h1>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title, author, or content..."
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
              // Reset form and modal state for adding new news
              setForm({ title: "", content: "", publish_date: "", author: "", link: "", image: null }); // Reset link here
              setImagePreview(null);
              setIsEditing(false);
              setShowModal(true);
              setError(""); // Clear previous errors
            }}
          >
            + Add News
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p>Loading news...</p>
      ) : (
        <div className="grid gap-4">
          {filteredNews.length === 0 && searchQuery ? (
            <p>No news articles found matching your search.</p>
          ) : (
            filteredNews.map((newsItem) => (
              <div key={newsItem.id} className="p-4 border rounded bg-white shadow">
                <h2 className="text-xl font-semibold text-primary">{newsItem.title}</h2>
                <p className="text-gray-600">
                  {new Date(newsItem.publish_date).toLocaleDateString()} | {newsItem.author || "No author"}
                </p>
                {newsItem.content && (
                  <p className="text-gray-600 mt-2 line-clamp-3">{newsItem.content}</p>
                )}
                {newsItem.image_url && (
                  <img
                    src={`${getApiUrl()}${newsItem.image_url}`}
                    alt={newsItem.title}
                    className="mt-2 h-32 object-cover rounded"
                  />
                )}
                {newsItem.link && ( // Display the link if it exists
                  <p className="text-gray-600 mt-2 truncate">
                    Link: <a href={newsItem.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{newsItem.link}</a>
                  </p>
                )}
                <div className="mt-2 flex gap-2">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => handleEdit(newsItem)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDelete(newsItem.id)}
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
              {isEditing ? "Edit News" : "Add New News"}
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
                name="publish_date"
                value={form.publish_date}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="text"
                name="author"
                placeholder="Author"
                value={form.author}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {/* New input field for link */}
              <input
                type="url" // Use type="url" for better validation on supported browsers
                name="link"
                placeholder="External Link (e.g., https://example.com/news-detail)"
                value={form.link}
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
                name="content"
                placeholder="Content"
                value={form.content}
                onChange={handleChange}
                className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                rows="5"
              ></textarea>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setImagePreview(null);
                    setError("");
                    setForm({ title: "", content: "", publish_date: "", author: "", link: "", image: null }); // Reset form on cancel
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