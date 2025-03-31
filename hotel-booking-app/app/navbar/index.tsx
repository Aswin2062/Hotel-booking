"use client";

import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <span className="text-xl font-bold text-gray-800">HotelFinder</span>
        </Link>

        <button
          className="md:hidden text-gray-800"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        <ul
          className={`md:flex gap-6 absolute md:static bg-white md:bg-transparent w-full md:w-auto left-0 p-4 md:p-0 shadow-md md:shadow-none transition-all ${
            isOpen ? "top-16" : "-top-96"
          }`}
        >
          <li>
            <Link href="/" className="block py-2 px-4 text-gray-700 hover:text-blue-500">
              Home
            </Link>
          </li>
          <li>
            <Link href="/about" className="block py-2 px-4 text-gray-700 hover:text-blue-500">
              About
            </Link>
          </li>
          <li>
            <Link href="/contact" className="block py-2 px-4 text-gray-700 hover:text-blue-500">
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
