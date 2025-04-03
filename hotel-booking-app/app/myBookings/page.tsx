"use client";

import { IGetBookingRequestParams, IHotelDao } from "@/dao";
import { BookingStatus, IBooking } from "@/models/booking";
import { BookingService } from "@/services/BookingService";
import dayjs from "dayjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";

const MyBookings = () => {
  const [filter, setFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("updatedAt");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [bookings, setBookings] =
    useState<(IBooking & { hotelInfo: IHotelDao })[]>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookings = async (params: IGetBookingRequestParams) => {
      setLoading(true);
      try {
        const response = await BookingService.getBookings(params);
        setBookings(response.bookings);
        setTotalPages(response.totalPages);
      } finally {
        setLoading(false);
      }
    };

    if (filter && sortBy && currentPage) {
      fetchBookings({
        pageNo: currentPage,
        sortBy: sortBy as IGetBookingRequestParams["sortBy"],
        ...(filter !== "All" && {
          filter: {
            status:
              filter === "Success"
                ? BookingStatus.Success
                : BookingStatus.PaymentFailed,
          },
        }),
      });
    }
  }, [filter, sortBy, currentPage]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>

      {/* Filter Buttons */}
      <div className="flex space-x-4 mb-4">
        {["All", "Success", "Failed"].map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded ${
              filter === status ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Sorting Dropdown */}
      <div className="mb-4">
        <label className="mr-2">Sort by:</label>
        <select
          className="border p-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="updatedBy">Date</option>
          <option value="name">Hotel Name</option>
          <option value="location">Place</option>
        </select>
      </div>

      {/* Booking List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // 🔹 Show Skeleton Loader While Fetching Data
          Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="border rounded-lg shadow-lg p-4 animate-pulse"
            >
              <div className="w-full h-48 bg-gray-300 rounded-md mb-3"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-3 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-5/6 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
          ))
        ) : bookings && bookings.length > 0 ? (
          bookings.map((booking) => (
            <div
              key={booking._id as string}
              className="border rounded-lg shadow-lg p-4"
            >
              <img
                src={booking.hotelInfo.photos[0]}
                alt={booking.hotelInfo.hotel_name}
                className="w-full h-48 object-cover rounded-md mb-3"
              />
              <h3 className="text-lg font-semibold">
                {booking.hotelInfo.hotel_name}
              </h3>
              <div className="flex flex-row gap-2">
                <div className="text-[#222] font-semibold">
                  <Link
                    href={`https://www.google.com/maps/search/?api=1&query=${booking.hotelInfo.latitude},${booking.hotelInfo.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700"
                  >
                    <FaMapMarkerAlt className="inline-block text-xl" />
                  </Link>
                </div>
                <p className="text-gray-600">
                  {booking.hotelInfo.addressline1}, {booking.hotelInfo.city},
                  {booking.hotelInfo.state}, {booking.hotelInfo.country}
                </p>
              </div>
              <p className="text-yellow-500">
                ⭐ {booking.hotelInfo.star_rating} Stars
              </p>
              <p className="text-green-600 font-semibold">
                From {booking.hotelInfo.rates_currency}{" "}
                {booking.hotelInfo.rates_from}
              </p>

              {/* Booking Details */}
              <div className="mt-4 p-3 border-t text-sm text-gray-700">
                <p>
                  <strong>Name:</strong> {booking.username}
                </p>
                <p>
                  <strong>Email:</strong> {booking.userEmail}
                </p>
                <p>
                  <strong>Guests:</strong> {booking.numberOfGuests}
                </p>
                <p>
                  <strong>Rooms Booked:</strong> {booking.Deluxe}
                </p>
                <p>
                  <strong>Check-in:</strong>{" "}
                  {dayjs(booking.checkin).format("MMM DD YYYY")}
                </p>
                <p>
                  <strong>Check-out:</strong>{" "}
                  {dayjs(booking.checkout).format("MMM DD YYYY")}
                </p>
                <p>
                  <strong>Booking Status:</strong>{" "}
                  <span
                    className={
                      Number(booking.bookingStatus) === BookingStatus.Success
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {Number(booking.bookingStatus) === BookingStatus.Success
                      ? "Success"
                      : "Failed"}
                  </span>
                </p>
                {Number(booking.bookingStatus) === 1 ? (
                  <>
                    <p>
                      <strong>Amount Paid:</strong>{" "}
                      {`${booking.paymentCurrency} ${booking.paymentAmount}`}
                    </p>
                    <p>
                      <strong>Transaction ID:</strong> {booking.paymentId}
                    </p>
                  </>
                ) : null}
              </div>
            </div>
          ))
        ) : (
          <p>No bookings found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-center space-x-4">
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-200 rounded">{currentPage}</span>
        <button
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MyBookings;
