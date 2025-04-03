"use client";

import { IAvailabilityResponse, IBookingFormFields, IHotelDao } from "@/dao";
import { BookingService } from "@/services/BookingService";
import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";
import { Value } from "react-calendar/dist/esm/shared/types.js";
import { FaCalendarAlt } from "react-icons/fa";
import makePayment from "../services/paymentService";
import { convertTo24HourFormat } from "./Utils";
import dayjs from "dayjs";

interface DetailsPopupProps {
  hotel: IHotelDao;
  onClose: () => void;
}

const iskeyOfRoomTypes = (key: string): key is keyof IAvailabilityResponse =>
  ["Standard", "Deluxe", "Suite", "Penthouse"].includes(key);

const validateBookingForm = (formFields: IBookingFormFields) => {
  let errors: Partial<IBookingFormFields> = {};
  [
    "checkIn",
    "checkOut",
    "guests",
    "name",
    "email",
    "phone",
    "address",
  ].forEach((key) => {
    if (!formFields[key as keyof IBookingFormFields].trim().length) {
      errors[key as keyof IBookingFormFields] = `Please fill ${key}`;
    }
  });
  if (!isNaN(Number(formFields.guests))) {
    let totalAccomadatablePersons =
      Number(formFields.Standard ?? 0) * 1 +
      Number(formFields.Deluxe ?? 0) * 2 +
      Number(formFields.Suite ?? 0) * 3 +
      Number(formFields.Penthouse ?? 0) * 4;
    if (totalAccomadatablePersons < Number(formFields.guests)) {
      errors.guests = "Guest count exceeds room accomadation";
    }
  }
  return errors;
};

const DetailsPopup: React.FC<DetailsPopupProps> = ({ hotel, onClose }) => {
  const [bookingDetails, setBookingDetails] = useState<IBookingFormFields>({
    checkIn: "",
    checkOut: "",
    guests: "1",
    name: "",
    email: "",
    phone: "",
    address: "",
    Standard: "",
    Deluxe: "",
    Suite: "",
    Penthouse: "",
  });
  const [checkedAvailability, setCheckedAvailability] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<IBookingFormFields>>({});
  const [availability, setAvailability] = useState<IAvailabilityResponse>();
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);

  const handleCheckAvailability = async () => {
    if (!bookingDetails.checkIn) {
      errors.checkIn = "Please fill Check In Date";
    } else {
      delete errors?.checkIn;
    }
    if (!bookingDetails.checkOut) {
      errors.checkOut = "Please fill Check Out Date";
    } else {
      delete errors?.checkOut;
    }
    setErrors({ ...errors });
    if (!errors.checkIn && !errors.checkOut) {
      setIsLoading(true);
      const result = await BookingService.getAvailability(
        hotel._id as string,
        bookingDetails.checkIn,
        bookingDetails.checkOut
      );
      setAvailability(result);
      setIsLoading(false);
      setCheckedAvailability(true);
    }
  };

  const handleChange = ({ name, value }: { name: string; value: string }) => {
    setBookingDetails((prev) => ({ ...prev, [name]: value }));
    if (name === "checkIn" || name === "checkOut") {
      setCheckedAvailability(false);
    }

    if (!iskeyOfRoomTypes(name)) {
      if (!value.trim().length) {
        setErrors((prev) => ({ ...prev, [name]: `Please fill  ${name}` }));
      } else {
        setErrors((prev) => {
          delete prev?.[name as keyof IBookingFormFields];
          return { ...prev };
        });
      }
    }
    if (name === "guests" || !isNaN(Number(bookingDetails.guests))) {
      let totalAccomadatablePersons =
        Number(name === "Standard" ? value : bookingDetails.Standard ?? 0) * 1 +
        Number(name === "Deluxe" ? value : bookingDetails.Deluxe ?? 0) * 2 +
        Number(name === "Suite" ? value : bookingDetails.Suite ?? 0) * 3 +
        Number(name === "Penthouse" ? value : bookingDetails.Penthouse ?? 0) *
          4;
      if (
        totalAccomadatablePersons <
        Number(name === "guests" ? value : bookingDetails.guests)
      ) {
        setErrors((prev) => ({
          ...prev,
          guests: "Guest count exceeds room accomadation",
        }));
      } else if (errors.guests === "Guest count exceeds room accomadation") {
        setErrors((prev) => {
          delete prev.guests;
          return { ...prev };
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(bookingDetails);
    const validationErrors = validateBookingForm({ ...bookingDetails });
    setErrors({ ...validationErrors });
    if (Object.keys(validationErrors).length == 0) {
      await makePayment(bookingDetails, hotel);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center px-4 sm:px-0 z-50">
      <div className="bg-white p-6 rounded-lg h-[90%] overflow-auto shadow-lg w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl relative ">
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

        <div className="flex flex-col sm:flex-row gap-4 mt-4 h-[80%] overflow-auto ">
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
              {(hotel.discountPercentage ?? 0) > 0 ? (
                <div>
                  <p className="text-gray-500 line-through text-sm">
                    ${(hotel.rates_from ?? 100).toFixed(2)}
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
                  ${(hotel.rates_from ?? 100).toFixed(2)}{" "}
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
                  <div
                    className="flex items-center border rounded-lg px-3 py-2 cursor-pointer"
                    onClick={() => setCalendarOpen(!calendarOpen)}
                  >
                    <FaCalendarAlt className="text-gray-500 mr-2" />
                    <input
                      type="text"
                      value={
                        bookingDetails.checkIn && bookingDetails.checkOut
                          ? `${dayjs(
                              bookingDetails.checkIn,
                              "YYYY-MM-DD"
                            ).format("MMM D, YYYY	")} - ${dayjs(
                              bookingDetails.checkOut,
                              "YYYY-MM-DD"
                            ).format("MMM D, YYYY	")}`
                          : "Select CheckIn/CheckOut Dates"
                      }
                      readOnly
                      className="w-full outline-none text-gray-700 cursor-pointer"
                      required
                    />
                  </div>
                  {(errors.checkIn || errors.checkOut) && (
                    <p className="text-sm text-red-600 mt-1">
                      Please Select Check-In/Out Dates
                    </p>
                  )}
                  {calendarOpen && (
                    <div className="absolute z-10 mt-2 bg-white border border-gray-300 shadow-lg rounded-lg p-2">
                      <Calendar
                        selectRange
                        onChange={(value: Value) => {
                          if (Array.isArray(value)) {
                            handleChange({
                              name: "checkIn",
                              value: dayjs(value[0]!).format("YYYY-MM-DD"),
                            });
                            handleChange({
                              name: "checkOut",
                              value: dayjs(value[1]!).format("YYYY-MM-DD"),
                            });
                            setCalendarOpen(false);
                          }
                        }}
                        value={[
                          bookingDetails.checkIn,
                          bookingDetails.checkOut,
                        ]}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="w-full">
                  <label className="block text-sm font-medium">
                    Check-in Time
                  </label>
                  <input
                    type="time"
                    name="checkInTIme"
                    value={convertTo24HourFormat(hotel.checkin)}
                    disabled
                    className="w-full bg-gray-200 text-gray-500 border border-gray-300 p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="w-full">
                  <label className="block text-sm font-medium">
                    Check-out Time
                  </label>
                  <input
                    type="time"
                    name="checkOutTime"
                    value={convertTo24HourFormat(hotel.checkout)}
                    disabled
                    className="w-full bg-gray-200 text-gray-500 border border-gray-300 p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Guests</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={bookingDetails.guests}
                  name="guests"
                  onChange={(e) =>
                    handleChange({ name: e.target.name, value: e.target.value })
                  }
                  className="w-full outline-none text-gray-700 p-2 border rounded-md"
                />
                {errors.guests && (
                  <p className="text-sm text-red-600 mt-1">{errors.guests}</p>
                )}
              </div>

              {!checkedAvailability && (
                <button
                  type="button"
                  className="bg-blue-500 text-white py-2 px-4 rounded flex items-center justify-center space-x-2 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={isLoading}
                  onClick={handleCheckAvailability}
                >
                  <span className={isLoading ? "hidden" : ""}>
                    {isLoading ? "Checking..." : "Check Availability"}
                  </span>
                  <svg
                    className={
                      isLoading ? "w-5 h-5 text-white animate-spin" : "hidden"
                    }
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="opacity-25"
                    ></circle>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="4"
                      d="M4 12a8 8 0 0116 0 8 8 0 01-16 0z"
                    ></path>
                  </svg>
                </button>
              )}
              {checkedAvailability && (
                <div>
                  {Array.from(Object.entries(availability!)).map(
                    ([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-medium whitespace-pre">
                          {`${key}(${value.personPerRoom} Person/Room)(${
                            value.ratePerNight
                          } ${hotel.rates_currency ?? "USD"}/Night)
(Available Rooms:${value.count})`}
                        </label>
                        <input
                          type="number"
                          name={key}
                          value={
                            bookingDetails[key as keyof IAvailabilityResponse]
                          }
                          onChange={(e) =>
                            handleChange({
                              name: e.target.name,
                              value: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded-md"
                          placeholder={`${value.count} rooms available`}
                          max={value.count}
                        />
                        {errors[key as keyof IAvailabilityResponse] && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors[key as keyof IAvailabilityResponse]}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={bookingDetails.name}
                  onChange={(e) =>
                    handleChange({ name: e.target.name, value: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={bookingDetails.email}
                  onChange={(e) =>
                    handleChange({ name: e.target.name, value: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                  placeholder="example@mail.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={bookingDetails.phone}
                  onChange={(e) =>
                    handleChange({ name: e.target.name, value: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                  placeholder="+1 234 567 890"
                />
                {errors.phone && (
                  <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium">Address</label>
                <input
                  type="text"
                  name="address"
                  value={bookingDetails.address}
                  onChange={(e) =>
                    handleChange({ name: e.target.name, value: e.target.value })
                  }
                  className="w-full p-2 border rounded-md"
                  placeholder="123 Main Street, City, Country"
                />
                {errors.address && (
                  <p className="text-sm text-red-600 mt-1">{errors.address}</p>
                )}
              </div>
            </form>
          </div>
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full mt-3 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
};

export default DetailsPopup;
