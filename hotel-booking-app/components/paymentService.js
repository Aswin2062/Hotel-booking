import React from "react";
import Swal from "sweetalert2";
import sendEmail from "./mailServer";

const makePayment = async (user, price) => {
  const total = Number((price * 100).toFixed(2));
  const totalInINR = total * 86;
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
    key: process.env.RAZOR_PAY_ID,
    amount: totalInINR,
    currency: "INR",
    name: "Demo",
    description: "Thank you for your booking with us",
    image: "",
    prefill: {
      name: user.name,
      email: user.email,
      contact: user.phone,
    },
    handler: function (response) {
      console.log(response);
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
                    <p>Dear <strong>${user.name}</strong>,</p>
                    <p>We are pleased to confirm your booking at <strong>Hotel Finder</strong>.</p>
                    <hr>
                    <p><strong>Booking Details:</strong></p>
                    <p><strong>Hotel Name:</strong> Grand Hotel</p>
                    <p><strong>Check-in:</strong> ${user.checkIn}</p>
                    <p><strong>Check-out:</strong> ${user.checkOut}</p>
                    <p><strong>Guests:</strong> ${user.guests} Adults</p>
                    <hr>
                    <p><strong>Payment Status:</strong> <span style="color: green;">Successful</span></p>
                    <p><strong>Amount Paid:</strong> $ ${total}</p>
                    <p><strong>Transaction ID:</strong> ${response.razorpay_payment_id}</p>
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
        sourceEmail: "aswincharlie8877@gmail.com",
        toAddresses: [user.email],
        subject: "Booking confirmation from hotelFinder",
        textBody: "",
        htmlBody: emailTemplate,
      };
      sendEmail(mailPayload);
      // ToDo API to store the payment details if success
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

export default makePayment;
