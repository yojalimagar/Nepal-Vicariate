import { useState } from "react";
import assumptionchurch from "../assets/assumptionchurch.jpg";

export default function UpperHeader() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // Add search functionality here if needed (e.g., filter, API call)
  };

  return (
    <div className="bg-white text-gray-800 py-6 px-4 sm:px-6 lg:px-8 shadow-sm md:order-2">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Text */}
        <div className="flex flex-col sm:flex-row items-center text-center sm:text-left mb-4 md:mb-0">
          <img
            src={assumptionchurch}
            alt="Vicariate Logo"
            className="h-16 w-16 sm:h-20 sm:w-20 object-cover mr-0 sm:mr-4 mb-2 sm:mb-0"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/80";
            }}
          />
          <div className="text-gray-900">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight">
              CATHOLIC APOSTOLIC VICARIATE OF NEPAL
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-700">
              The Catholic Church in Nepal
            </p>
          </div>
        </div>

        {/* Social Media and Search */}
        <div className="flex flex-col items-center space-y-4 w-full sm:w-auto">
          {/* Social Media Icons */}
          <div className="flex space-x-4 sm:space-x-6">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors duration-200"
              aria-label="Facebook"
            >
              <svg
                className="w-5 h-5 text-gray-700 hover:text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.812c-3.238 0-4.188 1.579-4.188 4.004v2.996z" />
              </svg>
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors duration-200"
              aria-label="Twitter"
            >
              <svg
                className="w-5 h-5 text-gray-700 hover:text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.447 0-6.227 2.78-6.227 6.227 0 .486.056.958.164 1.404-5.18-.26-9.77-2.735-12.85-6.49-.53.91-.83 1.96-.83 3.233 0 2.152 1.096 4.05 2.76 5.158-.807-.025-1.56-.248-2.228-.616v.086c0 3.023 2.146 5.544 4.994 6.107-.413.111-.849.17-1.296.17-.318 0-.626-.03-.928-.086.795 2.479 3.102 4.276 5.82 4.327-2.136 1.679-4.816 2.688-7.74 2.688-.504 0-.999-.03-1.487-.087 2.76 1.764 6.035 2.793 9.563 2.793 11.488 0 17.81-9.504 17.81-17.81 0-.272-.006-.543-.014-.813.97-.7 1.81-1.579 2.479-2.574z" />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors duration-200"
              aria-label="Instagram"
            >
              <svg
                className="w-5 h-5 text-gray-700 hover:text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2c3.309 0 3.703.014 5.011.072 1.312.058 2.031.251 2.59.473.619.243 1.085.56 1.513.988.428.428.745.894.988 1.513.222.559.415 1.278.473 2.59.058 1.308.072 1.702.072 5.011s-.014 3.703-.072 5.011c-.058 1.312-.251 2.031-.473 2.59-.243.619-.56 1.085-.988 1.513-.428.428-.894.745-1.513.988-.559.222-1.278.415-2.59.473-1.308.058-1.702.072-5.011.072s-3.703-.014-5.011-.072c-1.312-.058-2.031-.251-2.59-.473-.619-.243-1.085-.56-1.513-.988-.428-.428-.745-.894-.988-1.513-.222-.559-.415-1.278-.473-2.59-.058-1.308-.072-1.702-.072-5.011s.014-3.703.072-5.011c.058-1.312.251-2.031.473-2.59.243-.619.56-1.085.988-1.513.428-.428.894-.745 1.513-.988.559-.222 1.278-.415 2.59-.473c1.308-.058 1.702-.072 5.011-.072zm0-2c-3.359 0-3.774.014-5.091.071-1.17.052-1.805.249-2.319.453-.533.213-.953.473-1.379.899-.426.426-.686.846-.899 1.379-.204.514-.401 1.149-.453 2.319-.057 1.317-.071 1.732-.071 5.091s.014 3.774.071 5.091c.052 1.17.249 1.805.453 2.319.213.533.473.953.899 1.379.426.426.686.846 1.379.899.514.204 1.149.401 2.319.453 1.317.057 1.732.071 5.091.071s3.774-.014 5.091-.071c1.17-.052 1.805-.249 2.319-.453.533-.213.953-.473 1.379-.899.426-.426.686-.846.899-1.379.204-.514.401-1.149.453-2.319.057-1.317.071-1.732.071-5.091s-.014-3.774-.071-5.091c-.052-1.17-.249-1.805-.453-2.319-.213-.533-.473-.953-.899-1.379-.426-.426-.686-.846-1.379-.899-.514-.204-1.149-.401-2.319-.453-1.317-.057-1.732-.071-5.091-.071zm0 5.838c-3.417 0-6.182 2.763-6.182 6.182s2.763 6.182 6.182 6.182 6.182-2.763 6.182-6.182-2.763-6.182-6.182-6.182zm0 10.182c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4zm6.472-10.428c-.79 0-1.43.64-1.43 1.43s.64 1.43 1.43 1.43 1.43-.64 1.43-1.43-.64-1.43-1.43-1.43z" />
              </svg>
            </a>
            <a
              href="https://www.youtube.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors duration-200"
              aria-label="YouTube"
            >
              <svg
                className="w-5 h-5 text-gray-700 hover:text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.5 6.5c-.3-1.1-1.1-1.9-2.2-2.2-2-.5-10.3-.5-10.3-.5s-8.3 0-10.3.5c-1.1.3-1.9 1.1-2.2 2.2-.5 2-.5 6.2-.5 6.2s0 4.2.5 6.2c.3 1.1 1.1 1.9 2.2 2.2 2 .5 10.3.5 10.3.5s8.3 0 10.3-.5c1.1-.3 1.9-1.1 2.2-2.2.5-2 .5-6.2.5-6.2s0-4.2-.5-6.2zm-14.3 9.3v-6.6l6.6 3.3-6.6 3.3z" />
              </svg>
            </a>
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-xs sm:max-w-md lg:max-w-lg ">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full p-2 bg-gray-200 text-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary text-sm sm:text-base"
            />
          </div>
        </div>
      </div>
    </div>
  );
}