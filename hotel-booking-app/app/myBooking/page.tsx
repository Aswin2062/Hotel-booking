"use client";

const bookingData = [
  {
    hotel_id: 1,
    hotel_name: "Sai Kaew Beach Resort",
    addressline1: "8/1 Moo 4 Tumbon Phe Muang",
    city: "Chiang Rai",
    country: "Thailand",
    star_rating: 4,
    rates_from: 166,
    rates_currency: "USD",
    photos: [
      "http://pix2.agoda.net/hotelimages/1/-1/0ff4876f93688b8adcbed487b5a2175d.jpg?s=312x",
    ],
    booking_details: {
      checkin: "2025-04-02",
      checkout: "2025-04-09",
      guests: "1 Adult",
      payment_status: "Successful",
      amount_paid: "$16600",
      transaction_id: "pay_QDu4xQ68741SVI",
    },
  },
  {
    hotel_id: 6,
    hotel_name: "Marine Hotel",
    addressline1: "Sutton Cross",
    city: "Phuket",
    country: "Thailand",
    star_rating: 3,
    rates_from: 144,
    rates_currency: "USD",
    photos: [
      "http://pix4.agoda.net/hotelimages/6/6/6_1112201742005261861.jpg?s=312x",
    ],
    booking_details: {
      checkin: "2025-04-02",
      checkout: "2025-04-09",
      guests: "1 Adult",
      payment_status: "Successful",
      amount_paid: "$16600",
      transaction_id: "pay_QDu4xQ68741SVI",
    },
  },
  {
    hotel_id: 10,
    hotel_name: "TRYP Malaga Alameda Hotel",
    addressline1: "Avenida de la Aurora CC.Larios Centro S/N",
    city: "Kanchanaburi",
    country: "Thailand",
    star_rating: 4,
    rates_from: 83,
    rates_currency: "USD",
    photos: [
      "http://pix1.agoda.net/hotelimages/4890100/0/bbdf04328f691e68828c8f49075ace5e.jpg?s=312x",
    ],
    booking_details: {
      checkin: "2025-04-02",
      checkout: "2025-04-09",
      guests: "1 Adult",
      payment_status: "Successful",
      amount_paid: "$16600",
      transaction_id: "pay_QDu4xQ68741SVI",
    },
  },
];

const MyBookings = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookingData.length > 0 ? (
          bookingData.map((hotel) => (
            <div key={hotel.hotel_id} className="border rounded-lg shadow-lg p-4">
              <img
                src={hotel.photos[0]}
                alt={hotel.hotel_name}
                className="w-full h-48 object-cover rounded-md mb-3"
              />
              <h3 className="text-lg font-semibold">{hotel.hotel_name}</h3>
              <p className="text-gray-600">
                {hotel.addressline1}, {hotel.city}, {hotel.country}
              </p>
              <p className="text-yellow-500">⭐ {hotel.star_rating} Stars</p>
              <p className="text-green-600 font-semibold">
                From {hotel.rates_currency} {hotel.rates_from}
              </p>

              {/* Booking Details */}
              <div className="mt-4 p-3 border-t text-sm text-gray-700">
                <p><strong>Check-in:</strong> {hotel.booking_details.checkin}</p>
                <p><strong>Check-out:</strong> {hotel.booking_details.checkout}</p>
                <p><strong>Guests:</strong> {hotel.booking_details.guests}</p>
                <p><strong>Payment Status:</strong> <span className="text-green-600">{hotel.booking_details.payment_status}</span></p>
                <p><strong>Amount Paid:</strong> {hotel.booking_details.amount_paid}</p>
                <p><strong>Transaction ID:</strong> {hotel.booking_details.transaction_id}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No bookings found.</p>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
