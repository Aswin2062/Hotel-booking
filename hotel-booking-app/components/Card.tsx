"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import DetailsPopup from "./DetailsPopup";
import { FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { HotelService } from "@/services/HotelService";
import { IHotelDao } from "@/dao";

// 🔹 Skeleton Loader Component
const SkeletonCard = () => (
  <div className="border rounded-lg shadow-lg overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-300"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-full"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3 mt-2"></div>
    </div>
  </div>
);

const CardDetails = () => {
  const [hotels, setHotels] = useState<IHotelDao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedHotel, setSelectedHotel] = useState<IHotelDao | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchDiscountHotels = async () => {
      const response = await HotelService.getDiscountHotels();
      setHotels(response);
      setLoading(false);
    };

    fetchDiscountHotels();

    return () => {
      setHotels([]);
      setLoading(true);
    };
  }, []);

  const handleCardClick = (hotel: IHotelDao) => {
    setSelectedHotel(hotel);
    setIsPopupOpen(true);
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-4 ml-[6%] mt-[2.5rem]">
        Deals for the weekend
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[5rem] p-4 mx-[8%]">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))
          : hotels.map((hotel, index) => (
              <div
                key={`${hotel.hotel_id}-${index}`}
                className="border rounded-lg shadow-lg overflow-hidden cursor-pointer"
              >
                <Carousel
                  showArrows={true}
                  showThumbs={true}
                  infiniteLoop={true}
                  interval={3000}
                  stopOnHover={false}
                  className="w-full h-48"
                >
                  {hotel.photos?.length
                    ? hotel.photos.map((photo, i) => (
                        <div key={i}>
                          <Image
                            src={photo}
                            alt={`${hotel.hotel_name} - Image ${i + 1}`}
                            width={400}
                            height={250}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      ))
                    : [
                        <div key="default">
                          <Image
                            src="/default-hotel.jpg"
                            alt="Default Hotel"
                            width={400}
                            height={250}
                            className="w-full h-48 object-cover"
                          />
                        </div>,
                      ]}
                </Carousel>

                <div className="p-4" onClick={() => handleCardClick(hotel)}>
                  <h2 className="text-xl font-semibold">{hotel.hotel_name}</h2>
                  <div className="text-gray-600 flex flex-row gap-2">
                    <Link
                      href={`https://www.google.com/maps/search/?api=1&query=${hotel.latitude},${hotel.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700"
                    >
                      <FaMapMarkerAlt className="inline-block text-xl" />
                    </Link>
                    {hotel.city}, {hotel.country}
                  </div>
                  <p className="text-yellow-500">
                    ⭐ {hotel.star_rating || "N/A"}
                  </p>

                  <h2 className="text-lg font-semibold">Overview</h2>
                  <p className="h-[90px] overflow-auto text-sm text-[#616161]">
                    {hotel.overview}
                  </p>
                  <div className="mt-2">
                    <p className="text-gray-500 line-through">
                      ${hotel.rates_from?.toFixed(2)}
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      ${hotel.discountedRate?.toFixed(2)}{" "}
                      <span className="text-gray-500">/ night</span>
                    </p>
                    <p className="text-red-500 text-sm">
                      Save ${hotel.discountAmount?.toFixed(2)} (
                      {hotel.discountPercentage}%)
                    </p>
                  </div>
                </div>
              </div>
            ))}
      </div>

      {isPopupOpen && selectedHotel && (
        <DetailsPopup
          hotel={selectedHotel}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default CardDetails;
