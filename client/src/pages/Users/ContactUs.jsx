import React, { useState } from 'react';
import axios from 'axios';
import { getApiUrl } from '../../utils/api';
import apiEndpoints from '../../constants/apiEndpoints';
import UpperHeader from '../../components/UpperHeader';
import LowerHeader from '../../components/LowerHeader';
import Footer from '../../components/Footer';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const response = await axios.post(`${getApiUrl()}${apiEndpoints.CONTACT}`, formData);
      setStatus({ type: 'success', message: response.data.message });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Form submission error:', {
        message: err.message,
        response: err.response ? {
          status: err.response.status,
          data: err.response.data,
        } : 'No response received',
        config: err.config,
      });
      setStatus({
        type: 'error',
        message: err.response?.data?.message || 'Failed to send message. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <UpperHeader />
      <LowerHeader />
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4 font-sans">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl mt-8 mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Contact the Apostolic Vicariate of Nepal</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
            For inquiries, pastoral needs, or any other questions, please fill out the form below. We are here to serve you.
          </p>

          {status && (
            <div className={`mb-6 p-4 rounded-lg ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {status.message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Send us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your Name"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Subject of your message"
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="6"
                    className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
                    placeholder="Your message here..."
                    required
                    disabled={loading}
                  ></textarea>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Our Contact Information</h3>
                <div className="space-y-4 text-gray-700">
                  <p className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Our Lady Of Assumption Church, Bakhundole, Lalitpur, Nepal</span>
                  </p>
                  <p className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+977 1 5521408</span>
                  </p>
                  <p className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>info@apostolicvicariateofnepal.org</span>
                  </p>
                </div>
              </div>
              <div className="mt-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Find us on the Map</h3>
                <div className="relative" style={{ paddingBottom: '75%', height: 0 }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.404664468535!2d85.3065496!3d27.6727559!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1831a7fba6b3%3A0x31c233a70508437a!2sOur%20Lady%20Of%20Assumption%20Church!5e0!3m2!1sen!2snp!4v1698765432100!5m2!1sen!2snp"
                    width="100%"
                    height="100%"
                    style={{ border: 0, position: 'absolute', top: 0, left: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Our Lady Of Assumption Church Location"
                    className="rounded-lg shadow-md"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;