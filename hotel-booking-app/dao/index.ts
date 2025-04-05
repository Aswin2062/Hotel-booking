import { BookingStatus, IBooking, PaymentStatus } from "@/models/booking";
import { IHotel } from "@/models/hotels";
import { RoomType } from "@/models/room";

export type TResultResponse = {
  message: string;
  result: boolean;
};

export type ISignUpRequest = {
  email?: string;
  password?: string;
};

export type ISignUpResponse = TResultResponse;

export enum UserRoles {
  USER = "USER",
}

export type THotel = {
  discountPercentage?: any;
  discountAmount?: any;
  discountedRate?: any;
  hotel_id: number;
  chain_id: number;
  chain_name: string;
  brand_id: number;
  brand_name: string;
  hotel_name: string;
  hotel_formerly_name: string;
  hotel_translated_name: string;
  addressline1: string;
  addressline2: string;
  zipcode: string;
  city: string;
  state: string;
  country: string;
  countryisocode: string;
  star_rating: number;
  longitude: number;
  latitude: number;
  url: string;
  checkin: string;
  checkout: string;
  numberrooms: number | null;
  numberfloors: number | null;
  yearopened: number | null;
  yearrenovated: number | null;
  photo1: string;
  photo2: string;
  photo3: string;
  photo4: string;
  photo5: string;
  overview: string;
  rates_from: number;
  continent_id: number;
  continent_name: string;
  city_id: number;
  country_id: number;
  number_of_reviews: number;
  rating_average: number;
  rates_currency: string;
  discount?: number;

  // Add these optional room types:
  Standardroom?: number;
  Deluxeroom?: number;
  Suiteroom?: number;
  Penthouseroom?: number;

  Standardroom_price?: number;
  Deluxeroom_price?: number;
  Suiteroom_price?: number;
  Penthouseroom_price?: number;
};


export interface IHotelDao extends IHotel {
  createdAt?: Date;
  updatedAt?: Date;
  discountPercentage?: number;
  discountAmount?: number;
  discountedRate?: number;
}

export interface IRoomMasterDao {
  roomId: number;
  hotelId: number;
  type: RoomType;
  roomNo: string;
}

export interface IAvailabilityRequest {
  hotelPk: string;
  checkIn: string;
  checkout: string;
}

export interface IAvailabilityResponse {
  Standard: { count: number; personPerRoom: number; ratePerNight: number };
  Deluxe: { count: number; personPerRoom: number; ratePerNight: number };
  Suite: { count: number; personPerRoom: number; ratePerNight: number };
  Penthouse: { count: number; personPerRoom: number; ratePerNight: number };
}

export interface IBookingFormFields {
  checkIn: string;
  checkOut: string;
  guests: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  Standard: string;
  Deluxe: string;
  Suite: string;
  Penthouse: string;
}

export interface IBookingRequest {
  checkIn: string;
  checkOut: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  Standard?: number;
  Deluxe?: number;
  Suite?: number;
  Penthouse?: number;
  standardRate: number;
  deluxeRate: number;
  suiteRate: number;
  penthouseRate: number;
  discount: number;
  paymentId?: string;
  hotelId: string;
  paymentStatus?: PaymentStatus;
}

export interface IBookingResponse {
  bookingId: string;
  Standard?: string[];
  Deluxe?: string[];
  Suite?: string[];
  Penthouse?: string[];
}

export interface IGetBookingsResponse {
  bookings: (IBooking & {hotelInfo: IHotelDao}) [],
  totalPages: number,
  currentPage: number,
  totalBookings: number
}

export interface IGetBookingRequestParams {
  filter?: {status: BookingStatus},
  sortBy: 'updatedAt' | 'hotelName' | 'location',
  pageNo: number
}