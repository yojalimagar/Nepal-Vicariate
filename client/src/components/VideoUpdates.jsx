import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Using axios for consistency with other components

const VideoUpdates = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for video playback modal
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

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/videos'); // Fetch from your video API endpoint
        setVideos(response.data);
      } catch (err) {
        console.error("Error fetching videos:", err);
        setError(err.message || "Failed to fetch videos.");
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Handle playing a video in the modal
  const handlePlayVideo = (videoUrl) => {
    setCurrentPlayingVideoUrl(videoUrl);
    setShowVideoPlayerModal(true);
  };

  if (loading) {
    return (
      <section className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xl text-gray-700">Loading videos...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xl text-red-600">Error: {error}</p>
        <p className="text-md text-red-500">Could not fetch videos. Please try again later.</p>
      </section>
    );
  }

  return (
    <section className="bg-white  py-12 px-4 sm:px-6 lg:px-8 mr-50 ml-50">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12">
          Latest Videos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-30">
          {videos.length > 0 ? (
            videos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col"
              >

                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-4 mb-2 self-center">
                  {video.title}
                </h2>
                {/* Video Thumbnail */}
                <div className="relative w-full h-60 bg-gray-200 rounded-md overflow-hidden cursor-pointer group"
                     onClick={() => handlePlayVideo(video.video_url)}>
                  <img
                    src={getYouTubeThumbnail(video.video_url)}
                    alt={`Thumbnail for ${video.title}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/480x270/cccccc/333333?text=Video+Error"; }}
                  />
                  {/* Play icon overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg className="h-12 w-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                
                {video.description && (
                  <p className="text-sm text-gray-700 mb-4 leading-relaxed line-clamp-3 flex-grow mt-5">
                    {video.description}
                  </p>
                )}
                <p className="text-sm text-gray-600 mt-auto">
                  <span className="font-medium">Published:</span> {new Date(video.created_at).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">No videos available.</p>
          )}
        </div>
      </div>

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
    </section>
  );
};

export default VideoUpdates;
