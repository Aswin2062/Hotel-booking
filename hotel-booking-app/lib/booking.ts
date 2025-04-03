import {
  IAvailabilityResponse,
  IBookingRequest,
  IBookingResponse,
  IGetBookingsResponse,
} from "@/dao";
import BookingModel, {
  BookingStatus,
  IBooking,
  PaymentStatus,
} from "@/models/booking";
import HotelModel, { IHotel } from "@/models/hotels";
import RoomModel, { IRoom, RoomType } from "@/models/room";
import dayjs from "dayjs";
import { PipelineStage, Types } from "mongoose";

export async function getAvailableRooms(
  hotelPk: string,
  checkIn: string,
  checkout: string
): Promise<IAvailabilityResponse | string> {
  try {
    const hotelDetails: IHotel | null = await HotelModel.findById<IHotel>(
      new Types.ObjectId(hotelPk)
    );
    if (hotelDetails == null) {
      return "Invalid Hotel";
    }
    if (!dayjs(checkIn).isValid() || !dayjs(checkout).isValid()) {
      return "Invalid Dates";
    }
    const checkInTime = dayjs(
      `${checkIn} ${hotelDetails.checkin}`,
      "YYYY-MM-DD h:mm:ss A"
    ).toDate();
    const checkOutTime = dayjs(
      `${checkout} ${hotelDetails.checkout}`,
      "YYYY-MM-DD h:mm:ss A"
    ).toDate();
    const response = (await getAvailableRoomDetails(
      new Types.ObjectId(hotelPk),
      checkInTime,
      checkOutTime,
      true
    )) as { _id: RoomType; count: number }[];
    return response.reduce((final, current) => {
      switch (current._id) {
        case 1:
          final["Standard"] = {
            count: current.count,
            personPerRoom: 1,
            ratePerNight: hotelDetails.standardRate ?? 100,
          };
          break;
        case 2:
          final["Deluxe"] = {
            count: current.count,
            personPerRoom: 2,
            ratePerNight: hotelDetails.deluxeRate ?? 100,
          };
          break;
        case 3:
          final["Suite"] = {
            count: current.count,
            personPerRoom: 3,
            ratePerNight: hotelDetails.suiteRate ?? 100,
          };
          break;
        case 4:
          final["Penthouse"] = {
            count: current.count,
            personPerRoom: 4,
            ratePerNight: hotelDetails.penthouseRate ?? 100,
          };
          break;
      }
      return final;
    }, {} as IAvailabilityResponse);
  } catch (error) {
    console.error(
      `Failed to get available rooms for ${hotelPk} ${checkIn} ${checkout} due to ${error}`
    );
  }
  return "Please try again later";
}

async function getAvailableRoomDetails(
  hotelId: Types.ObjectId,
  checkin: Date,
  checkout: Date,
  onlyCount: boolean = false
): Promise<IRoom[] | { _id: RoomType; count: number }[]> {
  let pipeline: PipelineStage[] = [
    // Step 1: Filter rooms by hotelId
    {
      $match: {
        hotel: hotelId,
      },
    },
    // Step 2: Look up bookings for each room and join them
    {
      $lookup: {
        from: "bookings", // collection name for Booking model
        localField: "_id", // Room's _id
        foreignField: "allocatedRooms", // Booking's allocatedRooms
        as: "bookings", // Output array containing matching bookings
      },
    },
    // Step 3: Add a new field to check if the room has conflicting bookings
    {
      $addFields: {
        isBooked: {
          $anyElementTrue: {
            $map: {
              input: "$bookings", // Loop through all bookings for the room
              as: "booking",
              in: {
                $and: [
                  // Check if booking period overlaps with the requested period
                  { $lte: ["$$booking.checkin", checkout] }, // Booking checkout is before requested checkout
                  { $gte: ["$$booking.checkout", checkin] }, // Booking checkout is after requested checkin
                  { $eq: ["$$booking.bookingStatus", "1"] }, // Booking Status should be 1 for success
                ],
              },
            },
          },
        },
      },
    },
    // Step 4: Filter out rooms that are booked
    {
      $match: {
        isBooked: false, // Only include rooms that are not booked
      },
    },
    // Step 5: Clean up by removing the bookings and isBooked field from the output
    {
      $project: {
        bookings: 0,
        isBooked: 0,
      },
    },
  ];
  if (onlyCount) {
    pipeline = pipeline.concat([
      // Step 6: Group rooms by 'type' and get the count of rooms in each type
      {
        $group: {
          _id: "$type", // Group by room type
          count: { $sum: 1 }, // Count the number of rooms in each type
        },
      },
      // Step 7: Optionally, sort the result by room type or count
      {
        $sort: {
          _id: 1, // Sort by type (ascending order)
        },
      },
    ]);
  }
  const rooms = await RoomModel.aggregate(pipeline);
  return onlyCount
    ? (rooms as { _id: RoomType; count: number }[])
    : (rooms as IRoom[]); // Return the available rooms
}

export async function saveBooking(
  {
    checkIn,
    address,
    checkOut,
    email,
    guests,
    hotelId,
    name,
    phone,
    Deluxe,
    Penthouse,
    Standard,
    Suite,
    deluxeRate,
    discount,
    standardRate,
    penthouseRate,
    suiteRate,
  }: IBookingRequest,
  userId: string
): Promise<IBookingResponse | string> {
  if (
    !hotelId.trim().length ||
    !checkIn.trim().length ||
    !checkOut.trim().length ||
    !name!.trim().length ||
    !email.trim().length ||
    !phone.trim().length ||
    !address.trim().length ||
    !guests ||
    (!Standard && !Deluxe && !Suite && !Penthouse)
  ) {
    return "Invalid Request";
  }
  const hotelDetails = await HotelModel.findById(new Types.ObjectId(hotelId));
  if (!hotelDetails) {
    return "Invalid Request";
  }
  const availableRooms = (await getAvailableRoomDetails(
    new Types.ObjectId(hotelId),
    new Date(checkIn),
    new Date(checkOut)
  )) as IRoom[];
  const availabilityMap: {
    Standard: IRoom[];
    Deluxe: IRoom[];
    Suite: IRoom[];
    Penthouse: IRoom[];
  } = availableRooms.reduce(
    (final, current) => {
      switch (current.type) {
        case RoomType.Standard:
          final.Standard.push(current);
          break;
        case RoomType.Deluxe:
          final.Deluxe.push(current);
          break;
        case RoomType.Suite:
          final.Suite.push(current);
          break;
        case RoomType.Penthouse:
          final.Penthouse.push(current);
          break;
      }
      return final;
    },
    {
      Standard: [] as IRoom[],
      Deluxe: [] as IRoom[],
      Suite: [] as IRoom[],
      Penthouse: [] as IRoom[],
    }
  );
  if (
    (Standard && Standard > availabilityMap.Standard.length) ||
    (Deluxe && Deluxe > availabilityMap.Deluxe.length) ||
    (Suite && Suite > availabilityMap.Suite.length) ||
    (Penthouse && Penthouse > availabilityMap.Penthouse.length)
  ) {
    return "Rooms Not Available. Please check Availability Again";
  }
  let allocatedRooms = [
    ...(Standard
      ? availabilityMap.Standard.slice(0, Standard).map(
          ({ _id }) => new Types.ObjectId(_id as string)
        )
      : []),
    ...(Deluxe
      ? availabilityMap.Deluxe.slice(0, Deluxe).map(
          ({ _id }) => new Types.ObjectId(_id as string)
        )
      : []),
    ...(Suite
      ? availabilityMap.Suite.slice(0, Suite).map(
          ({ _id }) => new Types.ObjectId(_id as string)
        )
      : []),
    ...(Penthouse
      ? availabilityMap.Penthouse.slice(0, Penthouse).map(
          ({ _id }) => new Types.ObjectId(_id as string)
        )
      : []),
  ];
  const checkInTime = dayjs(
    `${checkIn} ${hotelDetails.checkin}`,
    "YYYY-MM-DD h:mm:ss A"
  ).toDate();
  const checkOutTime = dayjs(
    `${checkOut} ${hotelDetails.checkout}`,
    "YYYY-MM-DD h:mm:ss A"
  ).toDate();
  const bookingModel = new BookingModel({
    username: name,
    userMobile: phone,
    userEmail: email,
    userAddress: address,
    hotel: new Types.ObjectId(hotelId),
    allocatedRooms,
    numberOfGuests: guests,
    checkin: checkInTime,
    checkout: checkOutTime,
    bookedUserId: new Types.ObjectId(userId),
    Standard,
    Deluxe,
    Suite,
    Penthouse,
    standardRate,
    deluxeRate,
    suiteRate,
    penthouseRate,
    discount,
  });
  await bookingModel.save();
  return {
    bookingId: bookingModel.id,
    ...(Standard && {
      Standard: availabilityMap.Standard.slice(0, Standard).map(
        ({ roomNo }) => roomNo
      ),
    }),
    ...(Deluxe && {
      Deluxe: availabilityMap.Deluxe.slice(0, Deluxe).map(
        ({ roomNo }) => roomNo
      ),
    }),
    ...(Suite && {
      Suite: availabilityMap.Suite.slice(0, Suite).map(({ roomNo }) => roomNo),
    }),
    ...(Penthouse && {
      Penthouse: availabilityMap.Penthouse.slice(0, Penthouse).map(
        ({ roomNo }) => roomNo
      ),
    }),
  };
}

export async function updatePaymentStatus(
  bookingId: string,
  userId: string,
  paymnetId?: string
): Promise<string | null> {
  if (!bookingId.trim().length) {
    return "Invalid request";
  }
  const booking: IBooking | null = await BookingModel.findOne<IBooking>({
    _id: new Types.ObjectId(bookingId),
    bookedUserId: new Types.ObjectId(userId),
  });
  if (booking == null) {
    return "Invalid Request";
  }
  if (paymnetId) {
    booking.paymentId = paymnetId;
  }
  booking.paymentStatus = !!paymnetId
    ? PaymentStatus.Completed
    : PaymentStatus.Failed;
  if (!paymnetId) {
    booking.bookingStatus = BookingStatus.PaymentFailed;
  }
  await booking.save();
  return null;
}

export async function getBookings(userId: string, page: number = 1, limit: number = 20): Promise<IGetBookingsResponse> {
  const skip = (page - 1) * limit;
    
    const bookings = await BookingModel.find({bookedUserId: new Types.ObjectId(userId)})
      .skip(skip)    // Skip previous pages
      .limit(limit)  // Limit results per page
      .sort({ updatedAt: -1 }); 

    const totalBookings = await BookingModel.countDocuments({bookedUserId: new Types.ObjectId(userId)}); // Get total count for pagination

    return {
      bookings,
      totalPages: Math.ceil(totalBookings / limit),
      currentPage: page,
      totalBookings,
    };
}