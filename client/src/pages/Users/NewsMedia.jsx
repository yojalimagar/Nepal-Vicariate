import React from 'react'
import UpperHeader from '../../components/UpperHeader'
import LowerHeader from '../../components/LowerHeader'
import Footer from '../../components/Footer'

const NewsMedia = () => {
  return (
    <>
    <UpperHeader/>
    <LowerHeader/>
     <div className="font-inter bg-gray-100 min-h-screen pb-12">
        {/* Top Section: NEWS, EVENTS, PHOTO ALBUMS, VIDEOS PLAYLIST */}
        <section className="bg-white py-8 shadow-sm">
          <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-3 gap-6 text-center">
            {/* News Block */}
            <div className="flex flex-col items-center p-4 rounded-lg hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
              {/* SVG for Newspaper icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-blue-800 mb-2">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625.75a.75.75 0 0 0-1.06 1.06l2.755 2.754a.75.75 0 0 0 1.06-1.06l-2.755-2.754ZM6.264 6.263a.75.75 0 0 0-1.06 1.06l2.755 2.754a.75.75 0 0 0 1.06-1.06L6.264 6.263Zm10.913 10.913a.75.75 0 0 0 1.06-1.06l-2.755-2.754a.75.75 0 0 0-1.06 1.06l2.755 2.754ZM14.75 12a.75.75 0 0 0 1.06-1.06l-2.755-2.754a.75.75 0 0 0-1.06 1.06l2.755 2.754ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
              </svg>
              <p className="text-lg font-semibold text-gray-800">NEWS</p>
            </div>

            {/* Events Block */}
            <div className="flex flex-col items-center p-4 rounded-lg hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
              {/* SVG for Calendar icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-blue-800 mb-2">
                <path d="M12.75 12.75a.75.75 0 0 1 1.06 0l7.22 7.22H3.75v-7.575c0-.124.021-.245.06-.358A7.498 7.498 0 0 1 12 7.5a7.498 7.498 0 0 1 7.34 6.75.75.75 0 0 1-1.49.178A5.998 5.998 0 0 0 12 9a5.998 5.998 0 0 0-5.85 5.25.75.75 0 0 1-1.49-.178A7.498 7.498 0 0 1 12.75 12.75Z" />
                <path d="M12 2.25a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V3A.75.75 0 0 1 12 2.25ZM12 17.25a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V18a.75.75 0 0 1 .75-.75ZM21.75 12a.75.75 0 0 1-.75.75h-4.5a.75.75 0 0 1 0-1.5h4.5a.75.75 0 0 1 .75.75ZM3 12a.75.75 0 0 1-.75.75H.75a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 3 12ZM18.75 5.25a.75.75 0 0 1 0 1.06L14.06 11.06a.75.75 0 0 1-1.06-1.06l4.69-4.69a.75.75 0 0 1 1.06 0ZM5.25 5.25a.75.75 0 0 1 1.06 0L11.06 9.94a.75.75 0 0 1-1.06 1.06L5.25 6.31a.75.75 0 0 1 0-1.06Zm13.44 13.44a.75.75 0 0 1 0 1.06l-4.69 4.69a.75.75 0 0 1-1.06-1.06l4.69-4.69a.75.75 0 0 1 1.06 0ZM5.25 18.75a.75.75 0 0 1 1.06 0l4.69 4.69a.75.75 0 0 1-1.06 1.06l-4.69-4.69a.75.75 0 0 1 0-1.06Z" />
              </svg>
              <p className="text-lg font-semibold text-gray-800">EVENTS</p>
            </div>

            {/* Photo Albums Block */}
            <div className="flex flex-col items-center p-4 rounded-lg hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
              {/* SVG for Camera icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-blue-800 mb-2">
                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0L9.47 17.345a1.5 1.5 0 0 1-2.12 0L3 12.53V16.06Zm10.5-7.5a.75.75 0 0 0 0-1.5H7.5a.75.75 0 0 0 0 1.5h6Z" clipRule="evenodd" />
              </svg>
              <p className="text-lg font-semibold text-gray-800">PHOTO ALBUMS</p>
            </div>

           
          </div>
        </section>

        {/* Social Media Section */}
        <section className="bg-blue-900 py-12 mt-8">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">FOLLOW US ON SOCIAL MEDIA</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Facebook Embed Placeholder */}
              <div className="bg-white rounded-lg shadow-lg p-4 flex items-center justify-center h-64">
                <p className="text-gray-600 text-lg">Facebook Feed Placeholder</p>
              </div>

              {/* Instagram Embed Placeholder */}
              <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center justify-center h-64">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 text-purple-600 mb-4">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625.75a.75.75 0 0 0-1.06 1.06l2.755 2.754a.75.75 0 0 0 1.06-1.06l-2.755-2.754ZM6.264 6.263a.75.75 0 0 0-1.06 1.06l2.755 2.754a.75.75 0 0 0 1.06-1.06L6.264 6.263Zm10.913 10.913a.75.75 0 0 0 1.06-1.06l-2.755-2.754a.75.75 0 0 0-1.06 1.06l2.755 2.754ZM14.75 12a.75.75 0 0 0 1.06-1.06l-2.755-2.754a.75.75 0 0 0-1.06 1.06l2.755 2.754ZM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                </svg>
                <a href="https://www.instagram.com/yourprofile" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  View this profile on Instagram
                </a>
              </div>

              {/* Twitter Embed Placeholder */}
              <div className="bg-white rounded-lg shadow-lg p-4 flex items-center justify-center h-64">
                <p className="text-gray-600 text-lg">Tweets by @yourtwitterhandle</p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Past Events Section */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-blue-900 text-center mb-8">MAIN PAST EVENTS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pope Francis Event Card */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <img
                src="https://placehold.co/600x400/D0E0F0/1A202C?text=Pope+Francis+in+UAE+2019"
                alt="Pope Francis in UAE 2019"
                className="w-full h-64 object-cover rounded-t-xl"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/D0E0F0/1A202C?text=Image+Not+Found"; }}
              />
              <div className="p-6 text-center">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">POPE FRANCIS IN UAE 2019</h3>
                <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md">
                  View Details
                </button>
              </div>
            </div>

            {/* Jubilee of St. Arethas Event Card */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
              <img
                src="https://placehold.co/600x400/D0E0F0/1A202C?text=Jubilee+of+St+Arethas+2023-2024"
                alt="Jubilee of St Arethas 2023-2024"
                className="w-full h-64 object-cover rounded-t-xl"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/D0E0F0/1A202C?text=Image+Not+Found"; }}
              />
              <div className="p-6 text-center">
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">JUBILEE OF ST ARETHAS 2023-2024</h3>
                <button className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

    <Footer/>
    </>
    
  )
}

export default NewsMedia
