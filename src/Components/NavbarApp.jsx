import React from 'react'
import { Link } from 'react-router-dom'
import {FaBars, FaTimes} from 'react-icons/fa';
import { useState } from 'react';

export default function NavbarApp() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between bg-gray-600 text-white px-8 py-4 relative">
      <Link to="/" className="text-2xl font-bold">Task Manager App</Link>

      <ul className="hidden md:flex space-x-8">
        <li><Link to="/" className="hover:text-gray-300">Home</Link></li>
        <li><Link to="/add-task" className="hover:text-gray-300">AddTask</Link></li>
        <li><Link to="/add-invoice" className="hover:text-gray-300">ManageTask</Link></li>
        <li><Link to="/logout-here" className="hover:text-gray-300">Logout</Link></li>
      </ul>
      {/*Mobile Toggle button */}
      <button className='md:hidden text-2xl focus:outline-none' onClick={() => setIsOpen(!isOpen)}>{isOpen ? <FaTimes /> : <FaBars />}</button>

      {/* ✅ Mobile Menu (dropdown) */}
      {isOpen && (
        <ul className="absolute top-full left-0 w-full bg-gray-700 flex flex-col items-center space-y-4 py-4 md:hidden">
          <li>
            <Link
              to="/"
              className="hover:text-gray-300"
              onClick={() => setIsOpen(false)} // close after click
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/add-task"
              className="hover:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              AddTask
            </Link>
          </li>
          <li>
            <Link
              to="/Manage-task"
              className="hover:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              ManageTask
            </Link>
          </li>
          <li>
            <Link
              to="/logout-here"
              className="hover:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              Logout
            </Link>
          </li>
        </ul>
      )}

    </nav>
  )
}
