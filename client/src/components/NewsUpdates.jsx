import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../utils/api';
import apiEndpoints from '../constants/apiEndpoints';
apiEndpoints
const NewsUpdates = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${getApiUrl()}${apiEndpoints.NEWS}`); // Ensure this matches your backend URL
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setNewsItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <section className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xl text-gray-700">Loading news...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xl text-red-600">Error: {error}</p>
        <p className="text-md text-red-500">Could not fetch news. Please try again later.</p>
      </section>
    );
  }

  return (
    <section className="bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12">
          News & Updates
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.length > 0 ? (
            newsItems.map((news) => (
              <div
                key={news.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 text-center"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {news.title}
                </h3>
                {news.image_url && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={`${getApiUrl()}${news.image_url}`} // Ensure this matches your backend static serve path
                      alt={news.title}
                      className="w-60 h-auto rounded-md object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x70/E0E0E0/333333?text=Image"; }}
                    />
                  </div>
                )}
                <p className="text-sm text-gray-600 mb-4">
                  <span className="font-medium">Date:</span> {new Date(news.publish_date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  {news.content}
                </p>
                {news.link && ( // Only render if a link exists
                  <a
                    href={news.link} // Use the link from the database
                    target="_blank" // Optional: Opens the link in a new tab
                    rel="noopener noreferrer" // Recommended for security with target="_blank"
                    className="inline-block text-primary hover:underline transition-colors duration-200"
                    aria-label={`Read more about ${news.title}`}
                  >
                    Read More
                  </a>
                )}
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">No news updates available.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsUpdates;