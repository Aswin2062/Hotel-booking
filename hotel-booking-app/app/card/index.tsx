"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import DetailsPopup from "../detailsPopup";
import { MapPin } from "lucide-react";
import { HotelService } from "@/services/HotelService";
import { IHotelDao } from "@/dao";

const CardDetails = () => {
  const [hotels, setHotels] = useState<IHotelDao[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<IHotelDao | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const fetchDiscountHotels = async () => {
      const response = await HotelService.getDiscountHotels();
      setHotels(response);
    };
    fetchDiscountHotels();
    return () => {
      setHotels([]);
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
        {hotels.map((hotel, index) => (
          <div
            key={`${hotel.hotel_id}-${index}`}
            className="border rounded-lg shadow-lg overflow-hidden cursor-pointer"
            onClick={() => handleCardClick(hotel)}
          >
            <Image
              src={hotel.photos[0] || "/default-hotel.jpg"}
              alt={hotel.hotel_name}
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{hotel.hotel_name}</h2>
              <p className="text-gray-600 flex flex-row gap-2">
                {" "}
                <MapPin className="w-[15px]" />
                {hotel.city},{hotel.country}
              </p>
              <p className="text-yellow-500">⭐ {hotel.star_rating || "N/A"}</p>
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
