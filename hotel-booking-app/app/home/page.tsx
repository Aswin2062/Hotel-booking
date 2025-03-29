"use client";

import { useState } from "react";
import { FaSearch, FaUser, FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";
import CardDetails from "../card";

const HomePage = () => {
  const [location, setLocation] = useState("");
  const [dates, setDates] = useState("Apr 5 - Apr 12");
  const [travelers, setTravelers] = useState(2);

  return (
    <div className="relative h-screen">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/your-image-path.jpg')` }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      <div className="relative flex flex-col items-center justify-center h-full text-white">
        <h1 className="text-3xl md:text-5xl font-semibold mb-6">
          Relax, you’re booking a Vrbo
        </h1>

        <div className="bg-white rounded-xl p-4 shadow-lg flex flex-col md:flex-row gap-2 md:gap-4 w-full max-w-3xl">
          <div className="flex items-center border rounded-lg px-3 py-2 w-full">
            <FaMapMarkerAlt className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Where to?"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full outline-none text-gray-700"
            />
          </div>

          <div className="flex items-center border rounded-lg px-3 py-2 w-full">
            <FaCalendarAlt className="text-gray-500 mr-2" />
            <input
              type="text"
              value={dates}
              onChange={(e) => setDates(e.target.value)}
              className="w-full outline-none text-gray-700"
            />
          </div>

          <div className="flex items-center border rounded-lg px-3 py-2 w-full">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="number"
              min="1"
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              className="w-full outline-none text-gray-700"
            />
          </div>

          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center hover:bg-blue-700">
            <FaSearch className="mr-2" /> Search
          </button>
        </div>
       
      </div>
      <div>
          <CardDetails/>
        </div>
    </div>
  );
};

export default HomePage
