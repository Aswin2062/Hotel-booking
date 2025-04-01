import { IHotelDao } from "@/dao";
import HotelMasterData from "@/data/hotelsMaster.json";
import HotelModel, { IHotel } from "@/models/hotels";

export async function addHotelMasterData(): Promise<void> {
  try {
    const hotelMasterData = HotelMasterData as IHotel[];
    await HotelModel.bulkSave(
      hotelMasterData.map((item) => new HotelModel({ ...item }))
    );
  } catch (error) {
    console.error(`Failed to add default hotel master data due to ${error}`);
  }
}

export async function getLocations(): Promise<string[]> {
  try {
    const response: { state: string; country: string }[] =
      await HotelModel.aggregate([
        {
          $group: {
            _id: { state: "$state", country: "$country" }, // Group by state and country combination
          },
        },
        {
          $project: {
            _id: 0, // Exclude the _id field from the output
            state: "$_id.state", // Include the state
            country: "$_id.country", // Include the country
          },
        },
        {
          $sort: { state: 1, country: 1 }, // Sort by state and country in ascending order
        },
      ]);
    return response.map(({ state, country }) => `${state},${country}`);
  } catch (error) {
    console.error(`Failed to get Locations  due to ${error}`);
  }
  return [];
}

export async function getHotelsWithDiscount(): Promise<IHotelDao[]> {
  try {
    const response = await HotelModel.find<IHotel>({ discount: { $gt: 0 } }) // Find hotels with a discount greater than 0
      .sort({ discount: -1 }); // Sort by discount in descending order (-1 for descending)
    return updateDiscount(response);
  } catch (error) {
    console.error(`Failed to get discount hotels  due to ${error}`);
  }
  return [];
}

export async function getHotelsByStateAndCountry(
  state: string,
  country: string
): Promise<IHotelDao[]> {
  try {
    const response = await HotelModel.find({ state, country }) // Filter by state and country
      .sort({ hotel_name: 1 }); // Sort by hotel_name in ascending order (1 for ascending, -1 for descending)
    return updateDiscount(response);
  } catch (error) {
    console.error(`Failed to get hotels by state and country  due to ${error}`);
  }
  return [];
}

function updateDiscount(hotels: IHotel[]): IHotelDao[] {
  return hotels.map((hotel) => {
    const hotelDao: IHotelDao = { ...hotel.toJSON() } as IHotelDao;
    if (hotel.discount) {
      hotelDao.discountPercentage = hotel.discount || 0;
      var originalRate = hotel.rates_from || 100;
      hotelDao.discountAmount =
        (originalRate * hotelDao.discountPercentage) / 100;
      hotelDao.discountedRate = originalRate - hotelDao.discountAmount;
    }
    return hotelDao;
  });
}
