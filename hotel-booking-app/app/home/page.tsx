"use client";

import { useState } from "react";
import {
  FaSearch,
  FaUser,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import CardDetails from "../card";
import Navbar from "../navbar";
import BgImage from "@/public/vacation.jpg";
import Category from "../category";

const HomePage = () => {
  const [location, setLocation] = useState("");
  const [dates, setDates] = useState("Apr 5 - Apr 12");
  const [travelers, setTravelers] = useState(2);

  return (
    <div className="">
      <div>
        <Navbar />
      </div>

      <div className="absolute inset-0 bg-cover bg-center" />

      <div className="relative flex flex-col items-center justify-center h-[500px] "
       style={{
        backgroundImage: `url(${BgImage.src})`, // Use .src when using imported images in Next.js
        backgroundSize: "cover",
        backgroundPosition: "center", 
      }}>
        <div className="w-[70%] h-[100px] bg-white rounded-4xl flex items-center justify-center">

        <h1 className="text-3xl md:text-4xl font-semibold text-black">
          Relax, you’re booking a Hotel Finder
        </h1>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-lg flex flex-col md:flex-row gap-2 mt-4 md:gap-4 w-full max-w-3xl">
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
      <Category/>
      </div>

      <div>
        <CardDetails />
      </div>
    </div>
  );
};

export default HomePage;
