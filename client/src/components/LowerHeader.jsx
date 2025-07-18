import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Helper components for navigation links (now defined within this file)
const NavLink = ({ to, children, onClick, className = '' }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block py-2 px-3 text-white font-semibold hover:bg-blue-500 rounded-md transition-colors duration-200 ${className}`}
  >
    {children}
  </Link>
);

const DropdownLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
  >
    {children}
  </Link>
);

const MobileNavLink = ({ to, children, onClick, className = '' }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block px-4 py-3 text-white hover:bg-blue-600 transition-colors duration-200 ${className}`}
  >
    {children}
  </Link>
);

const MobileDropdownLink = ({ to, children, onClick, className = '' }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`block pl-8 pr-4 py-2 text-white text-sm hover:bg-blue-700 transition-colors duration-200 ${className}`}
  >
    {children}
  </Link>
);

const LowerHeader = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
  };

  return (
    <nav className="bg-blue-400 shadow-lg relative z-40 md:order-1">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          className="md:hidden text-white focus:outline-none"
          aria-label="Toggle navigation"
        >
          {isNavOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          )}
        </button>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex flex-grow justify-center space-x-6 lg:space-x-8">
          <li><NavLink to="/" onClick={closeDropdowns}>Home</NavLink></li>

          <li className="relative group">
            <NavLink
              to="/vicariate/vicar"
              onClick={() => toggleDropdown('vicariate')}
              className="flex items-center"
            >
              Vicariate <svg className="ml-2 w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </NavLink>
            <ul className={`absolute left-0 mt w-48 bg-white rounded-md shadow-lg py-2 ${activeDropdown === 'vicariate' ? 'block' : 'hidden'} group-hover:block`}>
              <li><DropdownLink to="/vicariate/history" onClick={closeDropdowns}>History</DropdownLink></li>
              <li><DropdownLink to="/vicariate/commissions" onClick={closeDropdowns}>Commissions</DropdownLink></li>
              <li><DropdownLink to="/vicariate/directory" onClick={closeDropdowns}>Directory</DropdownLink></li>
            </ul>
          </li>

          <li><NavLink to="/apostolic-vicar" onClick={closeDropdowns}>Apostolic Vicar</NavLink></li>

          <li className="relative group">
            <NavLink
              to="/parishes"
              onClick={() => toggleDropdown('parishes')}
              className="flex items-center"
            >
              Parishes & Schools <svg className="ml-2 w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </NavLink>
            <ul className={`absolute left-0  w-48 bg-white rounded-md shadow-lg py-2 ${activeDropdown === 'parishes' ? 'block' : 'hidden'} group-hover:block`}>
              <li><DropdownLink to="/parishes/list" onClick={closeDropdowns}>Parishes</DropdownLink></li>
              <li><DropdownLink to="/schools" onClick={closeDropdowns}>Schools</DropdownLink></li>
              <li><DropdownLink to="/institutions" onClick={closeDropdowns}>Institutions</DropdownLink></li>
            </ul>
          </li>

          <li><NavLink to="/news" onClick={closeDropdowns}>News & Media</NavLink></li>
          <li><NavLink to="/contact" onClick={closeDropdowns}>Contact</NavLink></li>
        </ul>

        {/* Mobile Navigation (Dropdown) */}
        {isNavOpen && (
          <div className="absolute top-full left-0 w-full bg-blue-500 shadow-lg md:hidden animate-fade-in-down">
            <ul className="py-2">
              <li><MobileNavLink to="/" onClick={() => setIsNavOpen(false)}>Home</MobileNavLink></li>
              <li className="relative">
                <MobileNavLink
                  to="/vicariate"
                  onClick={() => toggleDropdown('vicariate')}
                  className="flex justify-between items-center"
                >
                  Vicariate <svg className={`ml-2 w-3 h-3 transition-transform ${activeDropdown === 'vicariate' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </MobileNavLink>
                {activeDropdown === 'vicariate' && (
                  <ul className="bg-blue-600 py-2">
                    <li><MobileDropdownLink to="/vicariate/history" onClick={() => setIsNavOpen(false)}>History</MobileDropdownLink></li>
                    <li><MobileDropdownLink to="/vicariate/vicar" onClick={() => setIsNavOpen(false)}>Apostolic Vicar</MobileDropdownLink></li>
                    <li><MobileDropdownLink to="/vicariate/commissions" onClick={() => setIsNavOpen(false)}>Commissions</MobileDropdownLink></li>
                  </ul>
                )}
              </li>
              <li><MobileNavLink to="/apostolic-vicar" onClick={() => setIsNavOpen(false)}>Apostolic Vicar</MobileNavLink></li>
              <li className="relative">
                <MobileNavLink
                  to="/parishes"
                  onClick={() => toggleDropdown('parishes')}
                  className="flex justify-between items-center"
                >
                  Parishes & Schools <svg className={`ml-2 w-3 h-3 transition-transform ${activeDropdown === 'parishes' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </MobileNavLink>
                {activeDropdown === 'parishes' && (
                  <ul className="bg-blue-600 py-2">
                    <li><MobileDropdownLink to="/parishes/list" onClick={() => setIsNavOpen(false)}>Parishes</MobileDropdownLink></li>
                    <li><MobileDropdownLink to="/schools" onClick={() => setIsNavOpen(false)}>Schools</MobileDropdownLink></li>
                    <li><MobileDropdownLink to="/institutions" onClick={() => setIsNavOpen(false)}>Institutions</MobileDropdownLink></li>
                  </ul>
                )}
              </li>
              <li><MobileNavLink to="/news" onClick={() => setIsNavOpen(false)}>News & Media</MobileNavLink></li>
              <li><MobileNavLink to="/contact" onClick={() => setIsNavOpen(false)}>Contact</MobileNavLink></li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default LowerHeader;