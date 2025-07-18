import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UpperHeader from '../../components/UpperHeader';
import LowerHeader from '../../components/LowerHeader';
import Footer from '../../components/Footer';
import Sidebar from '../../components/Sidebar';

// Main Directory component that renders the Vicariate Directory
const Directory = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('Directory');
  const [directoryData, setDirectoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sidebarNavItems = [
    'History',
    'Vicariate Offices',
    'Office of Care',
    'Christian Formation',
    'Family Ministry',
    'Interfaith & Ecumenical Dialogue',
    'Office of Communications',
    'Liturgical Calendar',
    'Directory',
    'Statistics',
    'CELRA',
  ];

  useEffect(() => {
    const fetchDirectoryData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/directory');
        console.log('Fetched directory data:', response.data); // Debug: Log raw data
        setDirectoryData(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching directory entries:', {
          message: err.message,
          response: err.response ? {
            status: err.response.status,
            data: err.response.data,
            headers: err.response.headers,
          } : 'No response received',
          config: err.config,
        });
        setError(`Failed to fetch directory entries: ${err.message}${err.response ? ` (Status: ${err.response.status})` : ''}`);
        setLoading(false);
      }
    };

    fetchDirectoryData();
  }, []);

  // Group data by region
  const groupedData = directoryData.reduce((acc, entry) => {
    const region = entry.region || 'UNITED ARAB EMIRATES';
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(entry);
    return acc;
  }, {});

  console.log('Grouped data:', groupedData); // Debug: Log grouped data

  const regions = [...new Set(directoryData.map(entry => entry.region || 'UNITED ARAB EMIRATES'))];

  return (
    <>
      <UpperHeader />
      <LowerHeader />
      <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-6 lg:p-8">
        <div className="max-w-[calc(100vw-400px)] mx-auto bg-white shadow-xl rounded-lg overflow-hidden flex flex-col lg:flex-row">
          <Sidebar
            activeMenuItem={activeMenuItem}
            setActiveMenuItem={setActiveMenuItem}
            navItems={sidebarNavItems}
          />
          <main className="flex-grow p-6 lg:p-8 bg-white">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">
              DIRECTORY
            </h1>

            {loading && <p className="text-gray-700">Loading...</p>}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {error}</span>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && directoryData.length === 0 && (
              <p className="text-gray-700">No directory entries found.</p>
            )}

            {!loading && !error && directoryData.length > 0 && (
              <>
                <ul className="list-disc list-inside text-gray-700 text-lg mb-8 space-y-2">
                  {regions.map((region) => (
                    <li key={region} className="font-semibold text-gray-800">
                      {region}
                    </li>
                  ))}
                </ul>

                <hr className="my-8 border-t-2 border-gray-200" />

                {regions.map((region) => {
                  // Reverse the entries for this region
                  const reversedEntries = [...groupedData[region]].reverse();

                  return (
                    <div key={region} className="space-y-8">
                      {reversedEntries.map((entry, idx) => (
                        <div key={entry.id}>
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                            {entry.title}
                          </h2>
                          <div className="text-gray-700 text-base space-y-1">
                            {entry.subtitle && (
                              <h3 className="text-lg font-semibold text-gray-800">{entry.subtitle}</h3>
                            )}
                            {entry.poBox && <p>P.O. Box: {entry.poBox}</p>}
                            {entry.tel && <p>Tel: {entry.tel}</p>}
                            {entry.email && (
                              <p>
                                E-mail:{' '}
                                <a
                                  href={`mailto:${entry.email}`}
                                  className="text-blue-600 hover:underline"
                                >
                                  {entry.email}
                                </a>
                              </p>
                            )}
                            {entry.website && (
                              <p>
                                Website:{' '}
                                <a
                                  href={`http://${entry.website}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {entry.website}
                                </a>
                              </p>
                            )}
                          </div>
                          <ul className="list-disc list-inside text-gray-700 mt-4 space-y-1">
                            {entry.members.map((member, idx) => (
                              <li key={idx}>{member}</li>
                            ))}
                          </ul>
                          {/* Add horizontal line after each entry, except the last one in the region */}
                          {idx < reversedEntries.length - 1 && (
                            <hr className="my-8 border-t-2 border-gray-200" />
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Directory;