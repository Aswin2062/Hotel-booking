"use client";

import { HotelJSON } from "@/components/reusable";
import Image from "next/image";
import Link from "next/link";

const Category = () => {
  const hotels = HotelJSON;

  const groupedHotels = hotels.reduce<Record<string, typeof hotels>>((acc, hotel) => {
    const key = `${hotel.country},${hotel.state}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(hotel);
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Trending Destinations</h2>
      <p className="text-gray-600 mb-6">Most popular choices for travelers</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(groupedHotels).map(([location, hotels], index) => {
          const [country, state] = location.split(",");
          return (
            <Link
              key={index}
              href={{
                pathname: "/details",
                query: { country, state }, // Pass props as query params
              }}
            >
              <div className="relative rounded-lg overflow-hidden shadow-lg border-2 p-1 cursor-pointer">
                <Image
                  src={hotels[0].photo1}
                  alt={location}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 left-2 bg-white bg-opacity-50 px-2 py-1 rounded-md">
                  <h3 className="text-black font-semibold text-[14px]">{state}, {country}</h3>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Category;
