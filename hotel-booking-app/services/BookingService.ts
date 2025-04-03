import {
  IAvailabilityRequest,
  IAvailabilityResponse,
  IBookingRequest,
  IBookingResponse,
  IGetBookingRequestParams,
  IGetBookingsResponse,
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
    paymentId?: string,
    paymentAmount?: number, 
    paymentCurrency?: string
  ): Promise<boolean | string> => {
    try {
      const res = await fetch("/api/booking/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId, paymentId, paymentAmount, paymentCurrency }),
      });
      const data = await res.json();
      return res.status === 201 ? data.data : data.message;
    } catch (error) {
      console.error(error);
    }
    return false;
  },

  getBookings: async ({filter, sortBy, pageNo}: IGetBookingRequestParams): Promise<IGetBookingsResponse> => {
    try {
      const queryParams = new URLSearchParams();
    if (sortBy) queryParams.append("sortBy", sortBy);
    if (filter?.status) queryParams.append("status", filter.status.toString());
    if (pageNo) queryParams.append("page", pageNo.toString());

    const url = `/api/booking?${queryParams.toString()}`;
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (res.status === 200) return data;
    } catch (error) {
      console.error(error);
    }
    return {bookings: [], currentPage: 1, totalBookings: 0, totalPages: 0};
  }
};
