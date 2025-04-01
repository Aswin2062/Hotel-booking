import { IHotel } from "@/models/hotels";

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
};

export interface IHotelDao extends IHotel {
  createdAt?: Date;
  updatedAt?: Date;
  discountPercentage?: number;
  discountAmount?: number;
  discountedRate?: number;
}
