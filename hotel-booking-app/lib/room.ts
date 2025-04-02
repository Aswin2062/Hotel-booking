import { IRoomMasterDao } from "@/dao";
import RoomsMasterData from "@/data/roomsMaster.json";
import HotelModel from "@/models/hotels";
import RoomModel, { RoomType } from "@/models/room";

export async function addRoomsMasterData(): Promise<void> {
  try {
    const count = await RoomModel.countDocuments();
    if (count === 0) {
      const roomMasterData = RoomsMasterData as IRoomMasterDao[];
      const hotelRecords: { hotel_id: number; _id: string }[] =
        await HotelModel.find({}, { hotel_id: 1, _id: 1 });
      const hotelIdMap = new Map(
        hotelRecords.map(({ hotel_id, _id }) => [hotel_id, _id])
      );
      await RoomModel.bulkSave(
        roomMasterData.map(
          (item) =>
            new RoomModel({
              roomId: item.roomId,
              roomNo: item.roomNo,
              type: RoomType.Deluxe,
              hotel: hotelIdMap.get(item.hotelId),
            })
        )
      );
    }
  } catch (error) {
    console.error(`Failed to add default room master data due to ${error}`);
  }
}
