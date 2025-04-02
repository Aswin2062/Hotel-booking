import {
  IAvailabilityRequest,
  IAvailabilityResponse,
  IBookingRequest,
  IBookingResponse,
} from "@/dao";
import { RoomType } from "@/models/room";

export const BookingService = {
  getAvailability: async (
    hotelPk: string,
    checkIn: string,
    checkout: string
  ): Promise<IAvailabilityResponse> => {
    try {
      const res = await fetch("/api/availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hotelPk,
          checkIn,
          checkout,
        } as IAvailabilityRequest),
      });
      const data = await res.json();
      return data as IAvailabilityResponse;
    } catch (error) {
      console.error(error);
    }
    return {} as IAvailabilityResponse;
  },

  bookRooms: async (
    details: IBookingRequest
  ): Promise<IBookingResponse | string> => {
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details),
      });
      const data = await res.json();
      return res.status === 201 ? data : data.message;
    } catch (error) {
      console.error(error);
    }
    return "Please contact the administrator.";
  },

  updatePaymentStatus: async (
    bookingId: string,
    paymentId?: string
  ): Promise<boolean | string> => {
    try {
      const res = await fetch("/api/booking/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId, paymentId }),
      });
      const data = await res.json();
      return res.status === 201 ? data.data : data.message;
    } catch (error) {
      console.error(error);
    }
    return false;
  },
};
