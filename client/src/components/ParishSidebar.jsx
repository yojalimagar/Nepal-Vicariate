import React, { useState } from 'react';

const ParishSidebar = () => {
  // State to manage the open/closed state of the mobile sidebar content
  const [isSidebarContentOpen, setIsSidebarContentOpen] = useState(false);
  // State to manage the open/closed state of each dropdown category within the sidebar
  const [openCategories, setOpenCategories] = useState({});

  // Function to toggle the dropdown for a specific category (e.g., "I. PARISHES")
  const toggleCategory = (categoryTitle) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryTitle]: !prev[categoryTitle],
    }));
  };

  // Data structure for the sidebar categories and their sub-items
  const sidebarCategories = [
    {
      category: 'I. PARISHES',
      subItems: [
        'Baniyatar',
        'Damak',
        'Dharan',
        'Godavari',
        'Kanchanpur',
        'Kathmandu',
        'Maheshpur',
        'Pattapur',
        'Pokhara',
        'Pokhara East',
        'Sirsiya',
      ],
    },
    {
      category: 'II. QUASI PARISHES',
      subItems: [
        'Biratnagar',
        'Birgunj - Parwanipur',
        'Lubhu',
        'Sadakbari',
        'Tipling',
      ],
    },
    {
      category: 'III. MISSION STATIONS / SUB-STATIONS',
      subItems: [
        'Bandipur',
        'Bhairahawa',
        'Dhading',
        'Gorkha',
        'Khairahani',
        'Kohalpur',
        'Narayangarh',
        'Palpa - Tansen',
        'Simalbari',
        'Sindhupalchok',
        'Surkhet',
      ],
    },
    {
      category: 'IV. MASS CENTERS',
      subItems: [], // No specific sub-items listed for Mass Centers
    },
  ];

  return (
    <>
      {/* Mobile-only toggle for the entire sidebar content */}
      {/* This button displays the main title and acts as the expand/collapse trigger on small screens */}
      {/* It is now fixed, so it stays visible even when scrolling */}
      <button
        onClick={() => setIsSidebarContentOpen(!isSidebarContentOpen)}
        className="fixed top-12 left-4 z-50 flex justify-between items-center w-auto text-left py-3 px-4 bg-blue-100 text-blue-700 font-semibold rounded-md shadow-lg hover:bg-blue-200 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 md:hidden"
        aria-label="Toggle parishes list"
      >
        {/* Reduced h2 size for small devices (text-xl) */}
        <h2 className="text-xl font-bold text-blue-800 pr-2"> {/* Added pr-2 for spacing */}
          PARISHES AND QUASI PARISHES
        </h2>
        <svg
          className={`w-5 h-5 transform transition-transform duration-200 ${
            isSidebarContentOpen ? 'rotate-180' : 'rotate-0'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {/* Mobile overlay backdrop (visible when sidebar is open on small screens) */}
      {/* Clicking the backdrop closes the sidebar */}
      {isSidebarContentOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarContentOpen(false)}
        ></div>
      )}

      {/* Sidebar Content */}
      <div
        className={`
          bg-white shadow-lg rounded-lg font-inter
          md:block md:w-64 md:relative md:p-6 md:transform-none md:translate-x-0 md:h-auto md:overflow-y-visible
          ${isSidebarContentOpen
            ? 'fixed top-0 left-0 w-full h-full z-50 transform translate-x-0 transition-transform duration-300 ease-in-out p-4 overflow-y-auto' // Mobile: open state, fixed, full screen, with padding and scroll
            : 'hidden' // Mobile: closed state (hidden)
          }
        `}
      >
        {/* Desktop-only title for the sidebar */}
        {/* This title is always visible on medium and larger screens */}
        <h2 className="hidden md:block text-2xl font-bold text-blue-800 mb-6 border-b-2 border-blue-200 pb-3">
          PARISHES AND QUASI PARISHES
        </h2>

        {/* Navigation content of the sidebar */}
        {/* This content is hidden on small screens unless toggled open, always visible on desktop */}
        <nav className="mt-4">
          {sidebarCategories.map((item, itemIndex) => (
            <div key={itemIndex} className="mb-4">
              <button
                onClick={() => toggleCategory(item.category)}
                className="flex justify-between items-center w-full text-left py-2 px-3 text-gray-700 font-medium rounded-md hover:bg-gray-100 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
              >
                <span className="font-semibold text-blue-700">{item.category}</span>
                {item.subItems.length > 0 && (
                  <svg
                    className={`w-4 h-4 transform transition-transform duration-200 ${
                      openCategories[item.category] ? 'rotate-180' : 'rotate-0'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                )}
              </button>
              {openCategories[item.category] && item.subItems.length > 0 && (
                <ul className="mt-1 space-y-1 pl-6 text-gray-600">
                  {item.subItems.map((subItem, subItemIndex) => (
                    <li key={subItemIndex} className="py-1 hover:text-blue-600 cursor-pointer transition duration-150 ease-in-out">
                      {subItem}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </div>
    </>
  );
};

export default ParishSidebar;
