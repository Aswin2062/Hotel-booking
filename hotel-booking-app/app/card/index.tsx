"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HotelJSON } from "@/components/reusable";
import Image from "next/image";
import { THotel } from "@/types/Json";

const CardDetails = () => {
    const router = useRouter();
    const [hotels, setHotels] = useState<THotel[]>([]); // State to prevent hydration mismatch

    useEffect(() => {
        // Set hotel data on the client side
        if (HotelJSON) {
            const hotelsWithDiscounts = HotelJSON.map(hotel => {
                const discountPercentage = Math.floor(Math.random() * 21) + 10;
                const originalRate = hotel.rates_from || 100;
                const discountAmount = (originalRate * discountPercentage) / 100;
                const discountedRate = originalRate - discountAmount;

                return { ...hotel, discountPercentage, discountAmount, discountedRate };
            });

            setHotels(hotelsWithDiscounts);
        }
    }, []);

    const handleCardClick = (hotel: THotel) => {
        localStorage.setItem("selectedHotel", JSON.stringify(hotel));
        router.push(`/details`);
    };

    return (
        <div className="flex flex-col">
            <h1 className="text-2xl font-bold mb-4 ml-4">Deals for the weekend</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {hotels?.map((hotel, index) => (
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
                            <p className="text-gray-600">{hotel.city}, {hotel.country}</p>
                            <p className="text-yellow-500">⭐ {hotel.star_rating || "N/A"}</p>
                            
                            {/* Show discount details */}
                            <div className="mt-2">
                                <p className="text-gray-500 line-through">${hotel.rates_from?.toFixed(2)}</p>
                                <p className="text-lg font-bold text-green-600">
                                    ${hotel.discountedRate?.toFixed(2)} <span className="text-gray-500">/ night</span>
                                </p>
                                <p className="text-red-500 text-sm">
                                    Save ${hotel.discountAmount?.toFixed(2)} ({hotel.discountPercentage}%)
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardDetails;
