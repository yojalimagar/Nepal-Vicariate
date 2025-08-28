import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../../components/Footer';
import AdminLayout from '../../components/AdminLayout';
import { getApiUrl } from '../../utils/api';
import apiEndpoints from '../../constants/apiEndpoints';
const AdminContact = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${getApiUrl()}${apiEndpoints.CONTACT}`);
      setMessages(response.data);
    } catch (err) {
      console.error('Error fetching contact messages:', err);
      setError('Failed to fetch contact messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await axios.delete(`${egtApiUrl}${apiEndpoints.CONTACT}${id}`);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (err) {
      console.error('Error deleting message:', err);
      setError('Failed to delete the message. Please try again.');
    }
  };

  const handleSort = (field) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortField(field);
    setSortOrder(isAsc ? 'desc' : 'asc');

    setMessages((prevMessages) =>
      [...prevMessages].sort((a, b) => {
        const aValue = a[field];
        const bValue = b[field];
        if (field === 'created_at') {
          return isAsc
            ? new Date(bValue) - new Date(aValue)
            : new Date(aValue) - new Date(bValue);
        }
        return isAsc
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      })
    );
  };

  return (
  <AdminLayout>
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-6xl mt-8 mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          Admin: Contact Messages
        </h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
          Manage all contact form submissions received from users.
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center">
            <span className="text-gray-700">Loading messages...</span>
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-700">No messages found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-4 py-2">Name</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Subject</th>
                  <th className="px-4 py-2">Message</th>
                  <th className="px-4 py-2">Received</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((message) => (
                  <tr key={message.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{message.name}</td>
                    <td className="px-4 py-2">
                      <a
                        href={`mailto:${message.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {message.email}
                      </a>
                    </td>
                    <td className="px-4 py-2">{message.subject}</td>
                    <td className="px-4 py-2 max-w-xs truncate">{message.message}</td>
                    <td className="px-4 py-2">
                      {new Date(message.created_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(message.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    <Footer />
  </AdminLayout>
);

};

export default AdminContact;
