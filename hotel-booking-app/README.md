# Hotel Booking Web Application 🏨

## Overview

The **Hotel Booking Web Application** is a platform where users can search for hotels based on their preferred location 🌍, view available offers 💸, and book hotels 🏨. The platform also features an **Admin Panel** for managing hotels, adding new listings, and updating existing details.

---

## Features 🌟

### User Features:

- **Search Hotels** 🔍: Users can search for hotels by entering the city name or location.
- **Location-Based City Section** 🌆: Browse hotels by selecting a specific city from a list.
- **Hotel Offers** 🎉: View a curated list of hotels with special offers and discounts.
- **Booking** 📅: Users can book hotels directly through the platform.
- **Payment via Razorpay** 💳: Users can complete their bookings by making secure payments via Razorpay.
- **Booking Confirmation Email** 📧: After completing the booking, users will receive a confirmation email with the booking details.

### Admin Features:

- **Admin Login** 🔑: Admin users can securely log in to manage hotel data.
- **Add New Hotels** ➕: Admins can add new hotel details to the platform.
- **Edit Existing Hotels** ✏️: Admins can modify details of listed hotels, including descriptions, availability, and pricing.
- **Manage Offers** 🏷️: Admins can manage current hotel offers.

---

## Tech Stack ⚙️

- **Frontend**:

  - **Next.js**: A React-based framework for server-side rendering, routing, and static site generation.
  - **React**: A JavaScript library for building user interfaces.
  - **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
  - **React-Calendar**: A customizable calendar component for selecting dates (used in booking functionality).
  - **NextAuth.js**: An authentication library for Next.js, used to handle user sessions and secure login.

- **Backend**:
  - **Node.js**: JavaScript runtime built on Chrome's V8 engine, used for the server-side logic.
  - **Express.js**: A minimal web framework for Node.js, used for building APIs and handling routing.
- **Database**: MongoDB 🗃️ (for storing hotel information, user data, and bookings).

- **Authentication**: JWT 🔐 (JSON Web Token) for secure admin login and session handling.

- **Payment**:

  - **Razorpay**: Secure and easy payment gateway for processing user bookings. Users can pay for bookings using Razorpay's seamless integration.

- **Email Service** 📧: After booking confirmation, an email is sent to the user containing their booking details.

---

## Setup Instructions 🛠️

### Prerequisites 📦

Before setting up the project, make sure you have the following installed:

- Node.js (>= 14.x)
- MongoDB (or MongoDB Atlas for cloud hosting)
- Razorpay Account (for API keys)
- Git

### Installation 🚀

1. **Clone the repository**:

```bash
git clone <repository-url>
cd hotel-booking
```
