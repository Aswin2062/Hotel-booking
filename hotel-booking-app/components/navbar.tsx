"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession() as { data: any };
  const [isOpen, setIsOpen] = useState(false);

  if (!session) return null;

  return (
    <nav className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/home">
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
            <Link
              href="/home"
              className="block py-2 px-4 text-gray-700 hover:text-blue-500"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href=""
              className="block py-2 px-4 text-gray-700 hover:text-blue-500"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href=""
              className="block py-2 px-4 text-gray-700 hover:text-blue-500"
            >
              Contact
            </Link>
          </li>
          <li>
            <Link
              href="/myBookings"
              className="block py-2 px-4 text-gray-700 hover:text-blue-500"
            >
              My Bookings
            </Link>
          </li>

          {session?.role === "ADMIN" && (
            <li>
              <Link
                href="/editDetails"
                className="block py-2 px-4 text-gray-700 hover:text-blue-500 cursor-pointer"
              >
                Manage
              </Link>
            </li>
          )}

          <li className="flex items-center gap-2 relative group">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold cursor-pointer">
              {session.user?.name?.charAt(0).toUpperCase()}
            </div>

            <div className="absolute left-10 -top-2 bg-gray-800 text-white text-sm px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {session.user?.name}
            </div>

            <button
              onClick={() => signOut()}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
