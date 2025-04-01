"use client";
import { useState } from "react";
import { HotelJSON } from "@/components/reusable";
import { THotel } from "@/dao";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import HotelForm from "../form";

const EditDetails = () => {
  const [hotels, setHotels] = useState<THotel[]>(
    HotelJSON.map((hotel, index) => ({ ...hotel, hotel_id: index + 1 }))
  );
  const [editingHotel, setEditingHotel] = useState<THotel | null>(null);
  const [newHotel, setNewHotel] = useState<Partial<THotel>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [deleteHotelId, setDeleteHotelId] = useState<number | null>(null);

  const handleEdit = (hotel: THotel) => setEditingHotel(hotel);

  const handleSaveEdit = () => {
    if (!editingHotel) return;
    setHotels(
      hotels.map((hotel) =>
        hotel.hotel_id === editingHotel.hotel_id ? editingHotel : hotel
      )
    );
    setEditingHotel(null);
  };

  const handleAddNewHotel = () => {
    if (!newHotel.hotel_name || !newHotel.city) return;
    const newId = Date.now() + Math.floor(Math.random() * 1000);
    setHotels([...hotels, { ...newHotel, hotel_id: newId } as THotel]);
    setIsAdding(false);
    setNewHotel({});
  };

  const handleDeleteHotel = () => {
    if (deleteHotelId !== null) {
      setHotels(hotels.filter((hotel) => hotel.hotel_id !== deleteHotelId));
      setDeleteHotelId(null);
    }
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
          <div
            key={hotel.hotel_id}
            className="border p-4 rounded-lg shadow-md bg-white"
          >
            <img
              src={hotel.photo1}
              alt={hotel.hotel_name}
              className="w-full h-40 object-cover rounded-md"
            />
            <h2 className="text-lg font-semibold mt-2">{hotel.hotel_name}</h2>
            <p className="text-gray-600">
              {hotel.city}, {hotel.country}
            </p>
            <div className="flex justify-between mt-2">
              <button
                onClick={() => handleEdit(hotel)}
                className="bg-blue-500 text-white px-3 py-1 rounded flex items-center hover:bg-blue-600"
              >
                <FaEdit className="mr-2" /> Edit
              </button>
              <button
                onClick={() => setDeleteHotelId(hotel.hotel_id)}
                className="bg-red-500 text-white px-3 py-1 rounded flex items-center hover:bg-red-600"
              >
                <FaTrash className="mr-2" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {(editingHotel || isAdding) && (
        <div className="fixed inset-0 bg-[#ffffff2e] bg-opacity-50 backdrop-blur-md flex justify-center items-center p-4">
          <HotelForm
            isAdding={isAdding}
            newHotel={newHotel}
            editingHotel={editingHotel}
            setNewHotel={setNewHotel}
            setEditingHotel={setEditingHotel}
            handleAddNewHotel={handleAddNewHotel}
            handleSaveEdit={handleSaveEdit}
            setIsAdding={setIsAdding}
          />
        </div>
      )}

      {deleteHotelId !== null && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-md flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this hotel?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteHotelId(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteHotel}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditDetails;
