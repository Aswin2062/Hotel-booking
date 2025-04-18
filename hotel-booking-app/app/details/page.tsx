"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import DetailsPopup from "../../components/DetailsPopup";
import { HotelService } from "@/services/HotelService";
import { IHotelDao } from "@/dao";
import { FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";

const SkeletonCard = () => (
  <div className="border rounded-lg shadow-lg overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-300"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
      <div className="h-10 bg-gray-300 rounded w-full"></div>
    </div>
  </div>
);

const DetailsContent = () => {
  const searchParams = useSearchParams();
  const location = searchParams.get("location");
  const [hotels, setHotels] = useState<IHotelDao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedHotel, setSelectedHotel] = useState<IHotelDao | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchByLocation = async () => {
      setLoading(true);
      const hotelsByLocation = await HotelService.getHotelsByLocation(
        location!
      );
      setHotels(hotelsByLocation);
      setLoading(false);
    };

    if (location) {
      fetchByLocation();
    }

    return () => {
      setHotels([]);
    };
  }, [location]);

  const handleBooking = (hotel: IHotelDao) => {
    setSelectedHotel(hotel);
    setIsPopupOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-[2rem] ml-[4%]">
        Hotels in {location}
      </h1>

      {loading ? (
        // Show skeletons while loading
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-[5%]">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : hotels.length === 0 ? (
        <p className="text-center text-lg text-gray-500">
          Oops, no hotels currently available in this location.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mx-[5%]">
          {hotels.map((hotel, index) => (
            <div
              key={`${hotel.hotel_id}-${index}`}
              className="border rounded-lg shadow-lg overflow-hidden cursor-pointer"
            >
              <Image
                src={hotel.photos[0] || "/default-hotel.jpg"}
                alt={hotel.hotel_name}
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col items-start justify-evenly">
                <h2 className="text-xl font-semibold">{hotel.hotel_name}</h2>
                <div className="flex flex-row gap-2">
                  <div className="text-[#222] font-semibold ">
                    <Link
                      href={`https://www.google.com/maps/search/?api=1&query=${hotel.latitude},${hotel.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700"
                    >
                      <FaMapMarkerAlt className="inline-block text-xl" />
                    </Link>
                  </div>
                  <p className="text-gray-600">
                    {hotel.addressline1}, {hotel.city}
                  </p>
                </div>
                <p className="text-yellow-500">
                  ⭐ {hotel.star_rating || "N/A"}
                </p>
                <h2 className="text-lg font-semibold">Overview</h2>

                <p className="h-[90px] overflow-auto text-sm text-[#616161]">
                  {hotel.overview}
                </p>

                {hotel.discountPercentage && hotel.discountPercentage > 0 ? (
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
                ) : (
                  <p className="text-lg font-bold text-black">
                    ${hotel.rates_from?.toFixed(2)} / night
                  </p>
                )}

                <button
                  onClick={() => handleBooking(hotel)}
                  className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
                >
                  Click Here for Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isPopupOpen && selectedHotel && (
        <DetailsPopup
          hotel={selectedHotel}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </div>
  );
};

const Details = () => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <DetailsContent />
    </Suspense>
  );
};

export default Details;
