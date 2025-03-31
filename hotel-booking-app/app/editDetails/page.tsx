"use client";

import { useState } from "react";
import { HotelJSON } from "@/components/reusable";
import { THotel } from "@/types/Json";
import { FaEdit, FaPlus, FaSave, FaTimes } from "react-icons/fa";

const EditDetails = () => {
  const [hotels, setHotels] = useState<THotel[]>(HotelJSON);
  const [editingHotel, setEditingHotel] = useState<THotel | null>(null);
  const [newHotel, setNewHotel] = useState<Partial<THotel>>({});
  const [isAdding, setIsAdding] = useState(false);

  const handleEdit = (hotel: THotel) => setEditingHotel(hotel);

  const handleSaveEdit = () => {
    if (!editingHotel) return;
    setHotels(hotels.map((hotel) => (hotel.hotel_id === editingHotel.hotel_id ? editingHotel : hotel)));
    setEditingHotel(null);
  };

  const handleAddNewHotel = () => {
    if (!newHotel.hotel_name || !newHotel.city) return;
    
    const newId = Date.now();
    setHotels([...hotels, { ...newHotel, hotel_id: newId } as THotel]);
    setIsAdding(false);
    setNewHotel({});
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl md:text-2xl font-bold">Hotel Management</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700"
        >
          <FaPlus className="mr-2" /> Add Hotel
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {hotels.map((hotel) => (
          <div key={hotel.hotel_id} className="border p-4 rounded-lg shadow-md bg-white">
            <img src={hotel.photo1} alt={hotel.hotel_name} className="w-full h-40 object-cover rounded-md" />
            <h2 className="text-lg font-semibold mt-2">{hotel.hotel_name}</h2>
            <p className="text-gray-600">{hotel.city}, {hotel.country}</p>
            <button
              onClick={() => handleEdit(hotel)}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded flex items-center hover:bg-blue-600"
            >
              <FaEdit className="mr-2" /> Edit
            </button>
          </div>
        ))}
      </div>

      {(editingHotel || isAdding) && (
        <div className="fixed inset-0 bg-[#ffffff2e] bg-opacity-50 backdrop-blur-md flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg h-[70%] overflow-y-scroll shadow-lg w-full max-w-md">
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-xl font-bold mb-4">{isAdding ? "Add New Hotel" : "Edit Hotel"}</h2>
              <button
                onClick={() => (isAdding ? setIsAdding(false) : setEditingHotel(null))}
                className="bg-red-500 text-white px-2 py-2 rounded hover:bg-red-600"
              >
                <FaTimes />
              </button>
            </div>

            {["brand_name", "hotel_name", "hotel_formerly_name", "hotel_translated_name", "addressline1",
              "addressline2", "zipcode", "city", "state", "country", "countryisocode", "longitude",
              "latitude", "url", "numberrooms", "overview", "continent_name", "rates_currency"
            ].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.replace(/_/g, " ")}
                className="border p-2 w-full mb-2"
                value={(isAdding ? newHotel[field as keyof THotel] : editingHotel?.[field as keyof THotel]) || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  if (isAdding) {
                    setNewHotel((prev) => ({ ...prev, [field]: value } as Partial<THotel>));
                  } else {
                    setEditingHotel((prev) => (prev ? { ...prev, [field]: value } as THotel : prev));
                  }
                }}
              />
            ))}

            <div className="mb-2">
              <label className="block text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                className="border p-2 w-full"
                value={(isAdding ? newHotel.photo1 : editingHotel?.photo1) || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  isAdding ? setNewHotel({ ...newHotel, photo1: value }) : setEditingHotel((prev) => (prev ? { ...prev, photo1: value } as THotel : prev));
                }}
              />
            </div>
            {(isAdding ? newHotel.photo1 : editingHotel?.photo1) && (
              <img src={isAdding ? newHotel.photo1 : editingHotel?.photo1} alt="Preview" className="w-full h-40 object-cover rounded-md mb-2" />
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={isAdding ? handleAddNewHotel : handleSaveEdit}
                className="bg-green-500 text-white flex flex-row items-center justify-between px-4 py-2 rounded hover:bg-green-600"
              >
                <FaSave className="mr-2" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditDetails;
