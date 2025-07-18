// components/Sidebar.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Sidebar = ({ activeMenuItem, setActiveMenuItem, navItems }) => {
  return (
    <aside className="w-full lg:w-64 bg-blue-300 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">VICARIATE</h2>
      </div>
      <nav className="flex-grow py-4">
        <ul>
          {navItems.map((item) => (
            <li key={item}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault(); // Prevent page reload
                  setActiveMenuItem(item);
                }}
                className={`block px-6 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200
                  ${activeMenuItem === item ? 'bg-yellow-100 text-yellow-800 font-semibold border-l-4 border-yellow-500' : ''}`}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

Sidebar.propTypes = {
  activeMenuItem: PropTypes.string.isRequired,
  setActiveMenuItem: PropTypes.func.isRequired,
  navItems: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Sidebar;