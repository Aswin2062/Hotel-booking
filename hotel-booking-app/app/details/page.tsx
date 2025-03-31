"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { HotelJSON } from "@/components/reusable";
import { THotel } from "@/types/Json";
import DetailsPopup from "../detailsPopup";

const Details = () => {
    const searchParams = useSearchParams();
    const country = searchParams.get("country");
    const state = searchParams.get("state");

    const [hotels, setHotels] = useState<THotel[]>([]);
    const [selectedHotel, setSelectedHotel] = useState<THotel | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        if (country && state) {
            const hotelData: THotel[] = HotelJSON;
            const filteredHotels = hotelData.filter(hotel => hotel.country === country && hotel.state === state);
            setHotels(filteredHotels);
        }
    }, [country, state]);

    const handleCardClick = (hotel: THotel) => {
        setSelectedHotel(hotel);
        setIsPopupOpen(true);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Hotels in {state}, {country}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((hotel, index) => (
                    <div 
                        key={`${hotel.hotel_id}-${index}`} 
                        className="border rounded-lg shadow-lg overflow-hidden cursor-pointer"
                        onClick={() => handleCardClick(hotel)}
                    >
                        <Image 
                            src={hotel.photo1 || "/default-hotel.jpg"} 
                            alt={hotel.hotel_name} 
                            width={400}
                            height={250}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                            <h2 className="text-xl font-semibold">{hotel.hotel_name}</h2>
                            <p className="text-gray-600">{hotel.addressline1}, {hotel.city}</p>
                            <p className="text-yellow-500">⭐ {hotel.star_rating || "N/A"}</p>
                            <p className="text-lg font-bold text-green-600">
                                ${hotel.rates_from?.toFixed(2) || "N/A"} <span className="text-gray-500">/ night</span>
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Show popup when a hotel is selected */}
            {isPopupOpen && selectedHotel && (
                <DetailsPopup hotel={selectedHotel} onClose={() => setIsPopupOpen(false)} />
            )}
        </div>
    );
};

export default Details;
