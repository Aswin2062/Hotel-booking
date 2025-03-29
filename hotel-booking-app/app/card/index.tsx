"use client"

import { HotelJSON } from "@/components/reusable"

const CardDetails = () => {
    const hotels = HotelJSON(); // Invoke the function to get data

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
            {hotels?.map((hotel) => (
                <div key={hotel.hotel_id} className="border rounded-lg shadow-lg overflow-hidden">
                    <img 
                        src={hotel.photo1 || "/default-hotel.jpg"} 
                        alt={hotel.hotel_name} 
                        className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                        <h2 className="text-xl font-semibold">{hotel.hotel_name}</h2>
                        <p className="text-gray-600">{hotel.addressline1}, {hotel.city}</p>
                        <p className="text-yellow-500">⭐ {hotel.star_rating || "N/A"}</p>
                        <p className="text-lg font-bold">{hotel.rates_currency} {hotel.rates_from || "N/A"} / night</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CardDetails
