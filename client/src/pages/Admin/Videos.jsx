import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../components/AdminLayout"; // Assuming this path is correct
import { getApiUrl } from "../../utils/api";
import apiEndpoints from "../../constants/apiEndpoints";
export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [videoToDeleteId, setVideoToDeleteId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    video_url: "",
    description: "",
  });
  const [error, setError] = useState("");

  // New states for video playback modal
  const [showVideoPlayerModal, setShowVideoPlayerModal] = useState(false);
  const [currentPlayingVideoUrl, setCurrentPlayingVideoUrl] = useState("");

  // Function to extract YouTube video ID and generate thumbnail URL
  const getYouTubeThumbnail = (url) => {
    if (!url) return "https://placehold.co/480x270/cccccc/333333?text=No+Video"; // Placeholder for missing URL
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`;
    }
    // Fallback for non-YouTube URLs or invalid YouTube URLs
    return "https://placehold.co/480x270/cccccc/333333?text=Video+Thumbnail";
  };

  // Function to get YouTube embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1`;
    }
    return url; // Return original URL if not YouTube, though it might not embed correctly
  };

  // Function to fetch videos from the backend
  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${getApiUrl()}${apiEndpoints.VIDEOS}`);
      setVideos(res.data);
      setFilteredVideos(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading videos:", err);
      setError("Failed to load videos. Please try again.");
      setLoading(false);
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = videos.filter(
      (video) =>
        video.title.toLowerCase().includes(query.toLowerCase()) ||
        (video.description && video.description.toLowerCase().includes(query.toLowerCase()))
    );
    setFilteredVideos(filtered);
  };

  // Clear search input and reset filtered videos
  const clearSearch = () => {
    setSearchQuery("");
    setFilteredVideos(videos);
  };

  // Handle form field changes for add/edit modal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle submission of new or updated video
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");

    if (!form.title || !form.video_url) {
      setError("Title and video URL are required.");
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`${getApiUrl()}${apiEndpoints.VIDEOS}/${editId}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await axios.post(`${getApiUrl()}${apiEndpoints.VIDEOS}`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setShowModal(false);
      setForm({ title: "", video_url: "", description: "" });
      setIsEditing(false);
      setEditId(null);
      setError("");
      setSearchQuery("");
      fetchVideos();
    } catch (err) {
      console.error("Error saving video:", {
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers,
        message: err.message,
      });
      setError(err.response?.data?.message || "Error saving video. Please check your input and try again.");
    }
  };

  // Handle edit button click to populate form and open modal
  const handleEdit = (video) => {
    setForm({
      title: video.title,
      video_url: video.video_url || "",
      description: video.description || "",
    });
    setEditId(video.id);
    setIsEditing(true);
    setShowModal(true);
    setError("");
  };

  // Open delete confirmation modal
  const confirmDelete = (id) => {
    setVideoToDeleteId(id);
    setShowDeleteConfirmModal(true);
  };

  // Execute video deletion after confirmation
  const handleDelete = async () => {
    const id = videoToDeleteId;
    setShowDeleteConfirmModal(false);
    if (!id) return;

    const token = sessionStorage.getItem("token");
    try {
      await axios.delete(`${getApiUrl}${apiEndpoints.VIDEOS}${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVideos(videos.filter((v) => v.id !== id));
      setFilteredVideos(filteredVideos.filter((v) => v.id !== id));
      setError("");
    } catch (err) {
      console.error("Error deleting video:", err);
      setError(err.response?.data?.message || "Error deleting video. Please try again.");
    } finally {
      setVideoToDeleteId(null);
    }
  };

  // Handle playing a video in the modal
  const handlePlayVideo = (videoUrl) => {
    setCurrentPlayingVideoUrl(videoUrl);
    setShowVideoPlayerModal(true);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Manage Videos</h1>
        <div className="flex gap-4 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchQuery}
              onChange={handleSearch}
              className="border p-2 pl-10 rounded w-64 focus:outline-none focus:ring-2 focus:ring-primary text-transform-none"
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
              setForm({ title: "", video_url: "", description: "" });
              setIsEditing(false);
              setShowModal(true);
              setError("");
            }}
          >
            + Add Video
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 mb-4 text-center font-medium">{error}</p>}

      {loading ? (
        <p className="text-center text-gray-600">Loading videos...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredVideos.length === 0 && searchQuery ? (
            <p className="col-span-full text-center text-gray-600">No videos found matching your search.</p>
          ) : filteredVideos.length === 0 ? (
            <p className="col-span-full text-center text-gray-600">No videos available. Click "Add Video" to get started!</p>
          ) : (
            filteredVideos.map((video) => (
              <div key={video.id} className="p-4 border rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col">
                {/* Video Thumbnail */}
                <div className="relative w-full h-40 bg-gray-200 rounded-md overflow-hidden cursor-pointer group"
                     onClick={() => handlePlayVideo(video.video_url)}>
                  <img
                    src={getYouTubeThumbnail(video.video_url)}
                    alt={`Thumbnail for ${video.title}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Play icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                <h2 className="text-xl font-semibold text-primary mt-3 mb-1">{video.title}</h2>
                {video.description && (
                  <p className="text-gray-700 line-clamp-3 text-sm flex-grow">{video.description}</p>
                )}
                <p className="text-gray-500 mt-2 text-xs">
                  Created: {new Date(video.created_at).toLocaleDateString()}
                </p>
                <div className="mt-4 flex gap-3">
                  <button
                    className="text-blue-600 hover:underline font-medium"
                    onClick={() => handleEdit(video)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:underline font-medium"
                    onClick={() => confirmDelete(video.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add/Edit Video Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md relative animate-fade-in-up">
            <h2 className="text-2xl font-bold mb-5 text-gray-800 text-center">
              {isEditing ? "Edit Video" : "Add New Video"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Video Title"
                value={form.title}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
                required
              />
              <input
                type="url"
                name="video_url"
                placeholder="Video URL (e.g., https://youtube.com/watch?v=xyz)"
                value={form.video_url}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
                required
              />
              <textarea
                name="description"
                placeholder="Video Description (optional)"
                value={form.description}
                onChange={handleChange}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200"
                rows="5"
              ></textarea>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setIsEditing(false);
                    setError("");
                    setForm({ title: "", video_url: "", description: "" });
                  }}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition duration-200"
                >
                  {isEditing ? "Update Video" : "Add Video"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm relative animate-fade-in-up">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this video? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  setVideoToDeleteId(null);
                }}
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {showVideoPlayerModal && (
        <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 p-4">
          <div className="bg-white p-2 rounded-xl shadow-2xl w-full max-w-3xl relative animate-fade-in-up">
            <button
              onClick={() => {
                setShowVideoPlayerModal(false);
                setCurrentPlayingVideoUrl("");
              }}
              className="absolute -top-3 -right-3 bg-red-600 text-white rounded-full p-2 text-sm font-bold shadow-lg hover:bg-red-700 transition duration-200 z-10"
              aria-label="Close video player"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <div className="relative pt-[56.25%]"> {/* 16:9 Aspect Ratio */}
              <iframe
                src={getYouTubeEmbedUrl(currentPlayingVideoUrl)}
                title="Video Player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
