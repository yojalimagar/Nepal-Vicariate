import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../utils/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${getApiUrl()}/events`);
        const data = response.data;

        const formattedEvents = data.map(event => ({
          ...event,
          date: new Date(event.event_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          time: 'See description', // Placeholder, update if you add a time column
        }));
        setEvents(formattedEvents);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section className="bg-white py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-700">Loading events...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-8 px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-red-600">{error}</p>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="bg-white py-8 px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12 sm:mb-8">
          Upcoming Events
        </h2>
        <p className="text-gray-700">No upcoming events found.</p>
      </section>
    );
  }

  return (
    <section className="bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl ">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12 sm:mb-8">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-gray-50 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow duration-200 flex items-start justify-between"
            >
              <div className="flex-1 text-left"> {/* Align all text content to the left */}
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-2">
                  {event.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  <span className="font-medium">Date:</span> {event.date}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  <span className="font-medium">Time:</span> {event.time}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  <span className="font-medium">Location:</span> {event.location}
                </p>
                <p className="text-xs sm:text-sm text-gray-700 mb-3 sm:mb-4 leading-relaxed">
                  {event.description}
                </p>
                <a
                  href="#"
                  className="inline-block bg-blue-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm sm:text-base"
                  aria-label={`Learn more about ${event.title}`}
                >
                  Learn More
                </a>
              </div>
              {event.image_url && (
                <img
                  src={`http://localhost:5000${event.image_url}`}
                  alt={event.title}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover flex-shrink-0 ml-0" // Margin-left to separate from text
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;