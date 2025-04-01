"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { HotelJSON } from "@/components/reusable";
import { THotel } from "@/types/Json";
import DetailsPopup from "../detailsPopup";

const DetailsContent = () => {
    const searchParams = useSearchParams();
    const country = searchParams.get("country");
    const state = searchParams.get("state");

    const [hotels, setHotels] = useState<THotel[]>([]);
    const [selectedHotel, setSelectedHotel] = useState<THotel | null>(null);
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        if (country && state) {
            const hotelData: THotel[] = HotelJSON;
            const filteredHotels = hotelData
                .filter(hotel => hotel.country === country && hotel.state === state)
                .map(hotel => {
                    const discountPercentage = hotel.discount || 0;
                    const originalRate = hotel.rates_from || 100;
                    const discountAmount = (originalRate * discountPercentage) / 100;
                    const discountedRate = originalRate - discountAmount;

                    return {
                        ...hotel,
                        discountPercentage,
                        discountAmount,
                        discountedRate
                    };
                });

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

                            {/* Show discount details if available */}
                            {hotel.discountPercentage > 0 ? (
                                <div className="mt-2">
                                    <p className="text-gray-500 line-through">${hotel.rates_from?.toFixed(2)}</p>
                                    <p className="text-lg font-bold text-green-600">
                                        ${hotel.discountedRate?.toFixed(2)} <span className="text-gray-500">/ night</span>
                                    </p>
                                    <p className="text-red-500 text-sm">
                                        Save ${hotel.discountAmount?.toFixed(2)} ({hotel.discountPercentage}%)
                                    </p>
                                </div>
                            ) : (
                                <p className="text-lg font-bold text-black">${hotel.rates_from?.toFixed(2)} / night</p>
                            )}
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

const Details = () => {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <DetailsContent />
        </Suspense>
    );
};

export default Details;
