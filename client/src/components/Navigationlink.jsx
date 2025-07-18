import React from 'react';
import { Link } from 'react-router-dom';

export const NavLink = ({ to, children, onClick, className = '' }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block py-2 px-3 text-white font-semibold hover:bg-blue-500 rounded-md transition-colors duration-200 ${className}`}
  >
    {children}
  </Link>
);

export const DropdownLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
  >
    {children}
  </Link>
);

export const MobileNavLink = ({ to, children, onClick, className = '' }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-4 py-3 text-white hover:bg-blue-600 transition-colors duration-200 ${className}`}
  >
    {children}
  </Link>
);

export const MobileDropdownLink = ({ to, children, onClick, className = '' }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block pl-8 pr-4 py-2 text-white text-sm hover:bg-blue-700 transition-colors duration-200 ${className}`}
  >
    {children}
  </Link>
);