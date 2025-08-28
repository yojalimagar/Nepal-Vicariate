import React from 'react';
import UpperHeader from '../../components/UpperHeader'; 
import LowerHeader from '../../components/LowerHeader';// এই উপাদানটি খুঁজে পাওয়া যায়নি, তাই এটি মন্তব্য করা হয়েছে। import LowerHeader from '../../components/LowerHeader'; // এই উপাদানটি খুঁজে পাওয়া যায়নি, তাই এটি মন্তব্য করা হয়েছে।
import ParishSidebar from '../../components/ParishSidebar'; // এই আমদানির পথটি সঠিক কিনা নিশ্চিত করুন
import Footer from '../../components/Footer'; // এই উপাদানটি খুঁজে পাওয়া যায়নি, তাই এটি মন্তব্য করা হয়েছে।

const parishes = [
  {
    id: 1,
    name: 'Assumption of the Blessed Virgin Mary Cathedral',
    location: 'Dhobighat, Lalitpur (Kathmandu)',
    address: 'GPO Box 8975, EPC‑1099 Kathmandu',
    phone: '+977 1 5526732',
    email: 'nepcvm@hons.com.np',
    masses: [
      { day: 'Weekdays', time: '06:30 AM (Nepali)' },
      { day: 'Saturday', time: '09:00 AM (Nepali)' },
      { day: 'Sunday', time: '09:00 AM (English)' },
    ],
    notes:
      'Largest Catholic church in Nepal (~2,290 Catholics); bombed in 2009; seat of Apostolic Vicariate since 1995 dedicated by Cardinal Jozef Tomko.',
    image: {
      src: 'https://tse1.mm.bing.net/th/id/OIP.G4hw4VOjLMfqQoz8OeIpoQHaFc?rs=1&pid=ImgDetMain&o=7&rm=3',
      link: 'https://en.wikipedia.org/wiki/Assumption_of_the_Blessed_Virgin_Mary_Cathedral,_Kathmandu',
      alt: 'Assumption Cathedral Kathmandu',
    },
  },
  {
    id: 2,
    name: 'St. Francis Xavier (Jesuit) Church',
    location: 'Jawalakhel, Lalitpur (Kathmandu Valley)',
    address: 'Next to St. Xavier’s School, GPO Box 50, Kathmandu',
    phone: '+977 1 5535464',
    email: 'sxjcn@ccsl.com.np',
    masses: [{ day: 'Sunday', time: 'Check locally – often English & Nepali' }],
    notes:
      'Run by Jesuit missionaries since 1951; closely linked with St. Xavier’s School & College.',
    image: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/St._Xavier%27s_School%2C_Jawalakhel.jpg/640px-St._Xavier%27s_School%2C_Jawalakhel.jpg',
      link: 'https://en.wikipedia.org/wiki/St._Xavier%27s_School,_Jawalakhel',
      alt: 'St. Xavier\'s School Jawalakhel',
    },
  },
];

const Parishes = () => (
  <>
     <UpperHeader />  {/* This component was not found in previous compilation, so it's removed. */}
    <LowerHeader />  {/* This component was not found in previous compilation, so it's removed. */}
    <div className="bg-gray-50 py-10"> {/* Lighter background for the entire section */}
      {/* Main content wrapper: flex-col on small screens, flex-row on medium and larger */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        
        {/* ParishSidebar component */}
        {/* On small screens, ParishSidebar's internal logic will handle its visibility and toggle.
            On medium and larger screens, it will be a block element (sidebar). */}
        <ParishSidebar />

        {/* Main content area */}
        <div className="flex-1 min-w-0"> {/* flex-1 allows it to take remaining space, min-w-0 prevents overflow */}
          {/* Introduction about Parishes in Nepal */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-blue-800 mb-4">Catholic Parishes in Nepal</h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              Discover the vibrant Catholic community across Nepal through its parishes and quasi-parishes. These centers of faith serve as spiritual homes, offering mass services, community gatherings, and various ministries to the faithful. Each parish plays a unique role in fostering spiritual growth and supporting local communities. Below, you'll find detailed information on some of the key parishes, including their locations, contact details, mass schedules, and significant historical notes.
            </p>
          </div>
          <h1 className="text-3xl font-extrabold text-blue-800 mb-12"> Main Parishes</h1>
          <div className="space-y-10"> {/* Increased space between parish cards */}
            {parishes.map((p) => (
              <div
                key={p.id}
                className="bg-white shadow-xl rounded-lg overflow-hidden border-t-8 border-blue-600 transform hover:scale-105 transition duration-300 ease-in-out" // Added hover effect and thicker border
              >
                <a href={p.image.link} target="_blank" rel="noopener noreferrer" className="block">
                  <img
                    src={p.image.src}
                    alt={p.image.alt}
                    className="w-full h-72 object-cover object-center" // Slightly taller image, better object fit
                  />
                </a>
                <div className="p-8"> {/* Increased padding */}
                  <h2 className="text-3xl font-bold text-blue-700 mb-3 leading-tight">{p.name}</h2> {/* Larger, bolder title */}
                  <p className="text-gray-700 text-lg mb-2">{p.location}</p>
                  <p className="text-gray-600 mb-5 text-base font-medium">
                    <span className="flex items-center mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 10 10-4 0 2 2 0 004 0z" clipRule="evenodd" />
                      </svg>
                      {p.address}
                    </span>
                    <span className="flex items-center mb-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.774a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.06-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      {p.phone}
                    </span>
                    <span className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      {p.email}
                    </span>
                  </p>
                  
                  <div className="mb-5 bg-blue-50 p-4 rounded-md"> {/* Highlight mass times */}
                    <span className="font-semibold text-blue-800 text-lg">Mass Times:</span>
                    <ul className="list-disc list-inside ml-6 mt-2 text-gray-800">
                      {p.masses.map((m, i) => (
                        <li key={i} className="mb-1">
                          <span className="font-semibold">{m.day}:</span> {m.time}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-gray-700 italic text-base leading-relaxed border-l-4 border-blue-400 pl-4 py-1">{p.notes}</p> {/* Italic notes with a border */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    <Footer />  {/* This component was not found in previous compilation, so it's removed. */}
  </>
);

export default Parishes;
