import { IBookingFormFields, IBookingRequest, IHotelDao } from "@/dao";
import Swal from "sweetalert2";
import { BookingService } from "./BookingService";
import sendEmail from "./mailServer";

export const getPaymentAmountDetails = (checkIn: string, checkOut: string,  standardRate?: number, deluxeRate?: number, suiteRate?: number, penthouseRate?: number, Standard?: string, Deluxe?: string, Suite?: string, Penthouse?: string, discount?: number) => {
  const noOfNights =
  (new Date(checkOut).getTime() -
    new Date(checkIn).getTime()) /
  (1000 * 60 * 60 * 24);
const price =
  (isNaN(Number(Standard)) ? 0 : Number(Standard)) *
    (standardRate ?? 0) *
    noOfNights +
  (isNaN(Number(Deluxe)) ? 0 : Number(Deluxe)) *
    (deluxeRate ?? 0) *
    noOfNights +
  (isNaN(Number(Suite)) ? 0 : Number(Suite)) *
    (suiteRate ?? 0) *
    noOfNights +
  (isNaN(Number(Penthouse)) ? 0 : Number(Penthouse)) *
    (penthouseRate ?? 0) *
    noOfNights;
let total = price;
if (discount) {
  const discountAmount = (total * discount) / 100;
  total = total - discountAmount;
}
const totalInINR = (Number(total.toFixed(2)) * 86 * 100);
return {totalInINR, total: Number(total.toFixed(2))};
}

const makePayment = async (
  bookingInfo: IBookingFormFields,
  hotel: IHotelDao
) => {
  const {totalInINR, total} = getPaymentAmountDetails(bookingInfo.checkIn, bookingInfo.checkOut, hotel.standardRate, hotel.deluxeRate, hotel.suiteRate, hotel.penthouseRate, bookingInfo.Standard, bookingInfo.Deluxe, bookingInfo.Suite, bookingInfo.Penthouse, hotel.discount)
  const bookingResponse = await saveBooking(bookingInfo, hotel);
  if (typeof bookingResponse === "string") {
    Swal.fire({
      icon: "error",
      title: "Booking Failed",
      text: bookingResponse,
    });
    return;
  }
  Swal.fire({
    icon: "success",
    title: "Booking Completed",
    text: "Booking Completed successfully.",
    timer: 1000,
  });
  const res = await initializeRazorpay();
  if (!res) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Razorpay Failed to load",
    });
    return;
  }

  const options = {
    key: process.env.NEXT_PUBLIC_RAZOR_PAY_ID,
    amount: totalInINR,
    currency: "INR",
    name: "Demo",
    description: "Thank you for your booking with us",
    image: "",
    prefill: {
      name: bookingInfo.name,
      email: bookingInfo.email,
      contact: bookingInfo.phone,
    },
    handler: async function (response: { razorpay_payment_id: string }) {
      console.log(response);
      await updatePaymentStatus(
        bookingResponse.bookingId,
        response.razorpay_payment_id,
        total,
        hotel.rates_currency
      );
      Swal.fire({
        icon: "success",
        title: "Payment Success...",
        text: "Booking payment success",
      });

      const emailTemplate = `<!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hotel Booking Confirmation</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
              }
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  background: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                  text-align: center;
                  padding: 10px;
              }
              .header h2 {
                  color: #333;
              }
              .content {
                  padding: 20px;
              }
              .footer {
                  text-align: center;
                  padding: 10px;
                  font-size: 12px;
                  color: #666;
              }
              .btn {
                  display: inline-block;
                  padding: 10px 20px;
                  color: #ffffff;
                  background: #28a745;
                  text-decoration: none;
                  border-radius: 5px;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h2>Booking Confirmation</h2>
              </div>
              <div class="content">
                  <p>Dear <strong>${bookingInfo.name}</strong>,</p>
                  <p>We are pleased to confirm your booking at <strong>Hotel Finder</strong>.</p>
                  <hr>
                  <p><strong>Booking Details:</strong></p>
                  <p><strong>Hotel Name:</strong> Grand Hotel</p>
                  <p><strong>Check-in:</strong> ${bookingInfo.checkIn}</p>
                  <p><strong>Check-out:</strong> ${bookingInfo.checkOut}</p>
                  <p><strong>Guests:</strong> ${bookingInfo.guests} Adults</p>
                  ${
                    bookingResponse.Deluxe
                      ? `<p><strong>Deluxe Rooms:</strong> ${bookingResponse.Deluxe.join(
                          ","
                        )}</p>`
                      : ""
                  }
                  ${
                    bookingResponse.Standard
                      ? `<p><strong>Standard Rooms:</strong> ${bookingResponse.Standard.join(
                          ","
                        )}</p>`
                      : ""
                  }
                  ${
                    bookingResponse.Suite
                      ? `<p><strong>Suite Rooms:</strong> ${bookingResponse.Suite.join(
                          ","
                        )}</p>`
                      : ""
                  }
                  ${
                    bookingResponse.Penthouse
                      ? `<p><strong>Penthouse Rooms:</strong> ${bookingResponse.Penthouse.join(
                          ","
                        )}</p>`
                      : ""
                  }
                  <hr>
                  <p><strong>Payment Status:</strong> <span style="color: green;">Successful</span></p>
                  <p><strong>Amount Paid:</strong> $ ${totalInINR}</p>
                  <p><strong>Transaction ID:</strong> ${
                    response.razorpay_payment_id
                  }</p>
                  <hr>
                  <p>You can view your booking details by clicking the button below:</p>
                  <p style="text-align: center;"><a href="#" class="btn">View Booking</a></p>
                  <p>If you have any questions, feel free to contact us.</p>
                  <p>Thank you for choosing Hotel Finder!</p>
              </div>
              <div class="footer">
                  <p>&copy; 2025 Aswin E S. All Rights Reserved.</p>
              </div>
          </div>
      </body>
      </html>`;

      const mailPayload = {
        sourceEmail: process.env.NEXT_PUBLIC_SOURCE_EMAIL ?? "",
        toAddresses: [bookingInfo.email],
        subject: "Booking confirmation from hotelFinder",
        textBody: "",
        htmlBody: emailTemplate,
        accessKeyId: process.env.NEXT_PUBLIC_ACCESSKEY_ID ?? "",
        secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY ?? "",
      };
      sendEmail(mailPayload);
    },
    modal: {
      ondismiss: async function () {
        await updatePaymentStatus(bookingResponse.bookingId);
        Swal.fire({
          icon: "error",
          title: "Payment Failed!",
          text: "It looks like the payment was cancelled or failed. Please try again.",
        });
      },
    },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};

const initializeRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const saveBooking = async (
  bookingInfo: IBookingFormFields,
  hotel: IHotelDao
) => {
  const bookingDetails: IBookingRequest = {
    checkIn: bookingInfo.checkIn,
    checkOut: bookingInfo.checkOut,
    guests: Number(bookingInfo.guests),
    hotelId: hotel._id as string,
    name: bookingInfo.name,
    email: bookingInfo.email,
    address: bookingInfo.address,
    phone: bookingInfo.phone,
    penthouseRate: hotel.penthouseRate ?? 0,
    deluxeRate: hotel.deluxeRate ?? 0,
    standardRate: hotel.standardRate ?? 0,
    suiteRate: hotel.suiteRate ?? 0,
    discount: hotel.discount ?? 0,
    ...(!isNaN(Number(bookingInfo.Deluxe)) && {
      Deluxe: Number(bookingInfo.Deluxe),
    }),
    ...(!isNaN(Number(bookingInfo.Penthouse)) && {
      Penthouse: Number(bookingInfo.Penthouse),
    }),
    ...(!isNaN(Number(bookingInfo.Standard)) && {
      Standard: Number(bookingInfo.Standard),
    }),
    ...(!isNaN(Number(bookingInfo.Suite)) && {
      Suite: Number(bookingInfo.Suite),
    }),
  };
  return await BookingService.bookRooms(bookingDetails);
};

const updatePaymentStatus = async (bookingId: string, paymentId?: string, paymentAmount?: number, paymentCurrency?: string) => {
  const response = await BookingService.updatePaymentStatus(
    bookingId,
    paymentId,
    paymentAmount,
    paymentCurrency
  );
  if (typeof response === "string") {
    Swal.fire({
      icon: "error",
      title: "Payment Update Failed!",
      text: "Please contact the administrator",
    });
  }
};

export default makePayment;
