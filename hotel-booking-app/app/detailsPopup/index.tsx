"use client";

import { useState } from "react";
import Image from "next/image";
import makePayment from "../../components/paymentService";
import { IHotelDao } from "@/dao";

interface DetailsPopupProps {
  hotel: IHotelDao;
  onClose: () => void;
}

const DetailsPopup: React.FC<DetailsPopupProps> = ({ hotel, onClose }) => {
  const AccessKeyId = process.env.ACCESSKEY_ID;
  console.log("AccessKeyId", AccessKeyId);
  const SecretAccessKey = process.env.SECRET_ACCESS_KEY;

  const [bookingDetails, setBookingDetails] = useState({
    checkIn: "",
    checkOut: "",
    guests: "1",
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
  };

  const discountPercentage = hotel.discount || 0;
  const originalRate = hotel.rates_from || 100;
  const discountAmount = (originalRate * discountPercentage) / 100;
  const discountedRate = originalRate - discountAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Booking Details:", bookingDetails);
    await makePayment(
      bookingDetails,
      discountPercentage ? discountedRate : originalRate,
      AccessKeyId,
      SecretAccessKey
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center px-4 sm:px-0">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-center">
          {hotel.hotel_name}
        </h2>
        <p className="text-gray-600 text-center">
          {hotel.addressline1}, {hotel.city}, {hotel.country}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="w-full sm:w-1/2">
            {hotel.photos.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {hotel.photos.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={`${hotel.hotel_name} Image ${index + 1}`}
                    width={200}
                    height={150}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            ) : (
              <Image
                src="/default-hotel.jpg"
                alt="Default Hotel"
                width={400}
                height={250}
                className="w-full h-48 object-cover rounded-lg"
              />
            )}

            <div className="text-center mt-2">
              {discountPercentage > 0 ? (
                <div>
                  <p className="text-gray-500 line-through text-sm">
                    ${originalRate.toFixed(2)}
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    ${discountedRate.toFixed(2)}{" "}
                    <span className="text-gray-500">/ night</span>
                  </p>
                  <p className="text-red-500 text-sm">
                    Save ${discountAmount.toFixed(2)} ({discountPercentage}%)
                  </p>
                </div>
              ) : (
                <p className="text-lg font-bold text-black">
                  ${originalRate.toFixed(2)}{" "}
                  <span className="text-gray-500">/ night</span>
                </p>
              )}
            </div>
          </div>

          <div className="w-full sm:w-1/2">
            <h3 className="text-lg font-semibold text-center sm:text-left">
              Room Booking
            </h3>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="w-full">
                  <label className="block text-sm font-medium">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    name="checkIn"
                    value={bookingDetails.checkIn}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    name="checkOut"
                    value={bookingDetails.checkOut}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Guests</label>
                <select
                  name="guests"
                  value={bookingDetails.guests}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option>1 Guest</option>
                  <option>2 Guests</option>
                  <option>3 Guests</option>
                  <option>4+ Guests</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={bookingDetails.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={bookingDetails.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md"
                  placeholder="example@mail.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={bookingDetails.phone}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md"
                  placeholder="+1 234 567 890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Address</label>
                <input
                  type="text"
                  name="address"
                  value={bookingDetails.address}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border rounded-md"
                  placeholder="123 Main Street, City, Country"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-3 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPopup;
