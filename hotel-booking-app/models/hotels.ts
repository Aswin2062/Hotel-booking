import mongoose, { Schema, Document } from "mongoose";

export interface IHotel extends Document {
  hotel_id: number;
  chain_id?: number;
  chain_name?: string;
  brand_id?: number;
  brand_name?: string;
  hotel_name: string;
  hotel_formerly_name?: string;
  hotel_translated_name?: string;
  addressline1: string;
  addressline2?: string;
  zipcode: string;
  city: string;
  state: string;
  country: string;
  countryisocode?: string;
  star_rating?: number;
  longitude: number;
  latitude: number;
  checkin: string;
  checkout: string;
  numberrooms: number;
  numberfloors?: number | null;
  yearopened?: number;
  yearrenovated?: number;
  overview?: string;
  rates_from?: number;
  continent_id: number;
  continent_name: string;
  city_id: number;
  country_id: number;
  number_of_reviews?: number;
  rating_average?: number;
  rates_currency: string;
  photos: string[];
  discount?: number;
}

const hotelSchema = new Schema<IHotel>(
  {
    hotel_id: { type: Number, required: true, unique: true },
    chain_id: { type: Number },
    chain_name: { type: String },
    brand_id: { type: Number },
    brand_name: { type: String },
    hotel_name: { type: String, required: true },
    hotel_formerly_name: { type: String },
    hotel_translated_name: { type: String },
    addressline1: { type: String, required: true },
    addressline2: { type: String },
    zipcode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    countryisocode: { type: String },
    star_rating: { type: Number },
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
    checkin: { type: String },
    checkout: { type: String },
    numberrooms: { type: Number, required: true },
    numberfloors: { type: Number },
    yearopened: { type: Number },
    yearrenovated: { type: Number },
    overview: { type: String },
    rates_from: { type: Number },
    continent_id: { type: Number, required: true },
    continent_name: { type: String, required: true },
    city_id: { type: Number, required: true },
    country_id: { type: Number, required: true },
    number_of_reviews: { type: Number },
    rating_average: { type: Number },
    rates_currency: { type: String, required: true },
    photos: { type: [String], required: true },
    discount: { type: Number },
  },
  {
    timestamps: true,
  }
);

const HotelModel =
  mongoose.models.Hotel || mongoose.model<IHotel>("Hotel", hotelSchema);

export default HotelModel;
