import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  username: string;
  userMobile: string;
  userEmail: string;
  userAddress: string;
  hotel: mongoose.Schema.Types.ObjectId;
  allocatedRooms: mongoose.Schema.Types.ObjectId[];
  paymentStatus: PaymentStatus;
  paymentId: string;
  numberOfGuests: number;
  checkin: Date;
  checkout: Date;
  bookingStatus: BookingStatus;
  bookedUserId: mongoose.Schema.Types.ObjectId;
  Standard?: number;
  Deluxe?: number;
  Suite?: number;
  Penthouse?: number;
  standardRate: number;
  deluxeRate: number;
  suiteRate: number;
  penthouseRate: number;
}

export enum PaymentStatus {
  Pending = 1,
  Completed = 2,
  Failed = 3,
  Refunded = 4,
}

export enum BookingStatus {
  Success = 1,
  Cancelled = 2,
  PaymentFailed = 3,
}

// Room Booking Schema
const roomBookingSchema = new Schema(
  {
    username: { type: String, required: true },
    userMobile: { type: String, required: true },
    userEmail: { type: String, required: true },
    userAddress: { type: String },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    allocatedRooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true,
      },
    ],
    paymentStatus: {
      type: String,
      enum: [
        PaymentStatus.Pending,
        PaymentStatus.Completed,
        PaymentStatus.Failed,
        PaymentStatus.Refunded,
      ],
      default: PaymentStatus.Pending,
    },
    paymentId: { type: String },
    numberOfGuests: { type: Number, required: true },
    checkin: { type: Date, required: true },
    checkout: { type: Date, required: true },
    bookingStatus: {
      type: String,
      enum: [
        BookingStatus.Success,
        BookingStatus.Cancelled,
        BookingStatus.PaymentFailed,
      ],
      default: BookingStatus.Success,
    },
    bookedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Standard: { type: Number },
    Deluxe: { type: Number },
    Suite: { type: Number },
    Penthouse: { type: Number },
    standardRate: { type: Number, required: true },
    deluxeRate: { type: Number, required: true },
    suiteRate: { type: Number, required: true },
    penthouseRate: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

// Create the Room Booking model
const BookingModel =
  mongoose.models?.Booking ||
  mongoose.model<IBooking>("Booking", roomBookingSchema);

export default BookingModel;
