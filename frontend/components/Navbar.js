'use client';

import React, { useState } from 'react';
import { Search, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { label: 'Home', href: '#' },
    { label: 'Shop', href: '#', hasDropdown: true },
    { label: 'Subsidy', href: '#' },
    { label: 'Category', href: '#', hasDropdown: true },
    { label: 'About Us', href: '#' },
    { label: 'Contact Us', href: '#' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      {/* Main Navbar Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center">
              <span className="text-2xl font-bold text-green-600">Hans</span>
              <span className="text-2xl font-bold text-gray-800">Solar</span>
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <div key={index} className="relative group">
                <a
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-1"
                >
                  {link.label}
                  {link.hasDropdown && (
                    <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
                  )}
                </a>
                
                {/* Dropdown Menu */}
                {link.hasDropdown && (
                  <div className="absolute left-0 mt-0 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-600 rounded-t-md">
                      Option 1
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-600">
                      Option 2
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-600 rounded-b-md">
                      Option 3
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Search Box, Cart, and Login */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Search Box */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
              />
              <Search size={18} className="absolute right-3 top-2.5 text-gray-400" />
            </div>

            {/* Cart Icon */}
            <button className="relative p-2 text-gray-700 hover:text-green-600 transition-colors">
              <ShoppingCart size={24} />
              <span className="absolute top-1 right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                0
              </span>
            </button>

            {/* Login Button */}
            <button className="px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <span>Login</span>
              <span>→</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <button className="p-2 text-gray-700 hover:text-green-600">
              <Search size={20} />
            </button>
            <button className="p-2 text-gray-700 hover:text-green-600">
              <ShoppingCart size={20} />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 hover:text-green-600"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
              >
                {link.label}
              </a>
            ))}
            <button className="w-full mt-4 px-6 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
              Login
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
