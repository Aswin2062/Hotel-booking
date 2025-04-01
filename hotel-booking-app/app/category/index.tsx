"use client";

import { HotelJSON } from "@/components/reusable";
import Image from "next/image";
import Link from "next/link";
import NorthernImg from "@/public/NorthernThailand.jpg";
import EasternImg from "@/public/Eastern Thailand.jpg";
import CenterImg from "@/public/CentralThailand.webp";
import LowerImg from "@/public/Lower Northern Thailand.jpg";
import SouthImg from "@/public/Southern Thailand.jpg";
import WesternImg from "@/public/Western Thailand.jpg";

const stateImages: Record<string, any> = {
  "Northern Thailand": NorthernImg,
  "Eastern Thailand": EasternImg,
  "Central Thailand": CenterImg,
  "Lower Northern Thailand": LowerImg,
  "Southern Thailand": SouthImg,
  "Western Thailand": WesternImg,
};

const Category = () => {
  const hotels = HotelJSON;

  const groupedHotels = hotels.reduce<Record<string, typeof hotels>>(
    (acc, hotel) => {
      const key = `${hotel.country},${hotel.state}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(hotel);
      return acc;
    },
    {}
  );

  return (
    <div className="mx-[5rem] mt-[2rem]">
      <h2 className="text-2xl font-bold mb-4">Trending Destinations</h2>
      <p className="text-gray-600 mb-6">Most popular choices for travelers</p>
      <div className="grid grid-cols-2 gap-4 mx-[5%]">
        {Object.entries(groupedHotels).map(([location, hotels], index) => {
          const [country, state] = location.split(",");
          const isFullWidth = (index + 1) % 3 === 0;
          const imageSrc = stateImages[state] || hotels[0].photo1;

          return (
            <Link
              key={index}
              href={{
                pathname: "/details",
                query: { country, state },
              }}
              className={isFullWidth ? "col-span-2" : "col-span-1"}
            >
              <div className="relative rounded-lg overflow-hidden shadow-lg border-2 p-1 cursor-pointer">
                <Image
                  src={imageSrc}
                  alt={location}
                  width={400}
                  height={250}
                  className="w-full h-[300px] object-cover rounded-lg"
                />
                <div className="absolute top-2 left-2 bg-white bg-opacity-50 px-2 py-1 rounded-md">
                  <h3 className="text-black font-semibold text-[14px]">
                    {state}, {country}
                  </h3>
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
