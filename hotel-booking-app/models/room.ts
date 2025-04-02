import mongoose, { Schema, Document } from "mongoose";

export enum RoomType {
  Standard = 1,
  Deluxe = 2,
  Suite = 3,
  Penthouse = 4,
}

export interface IRoom extends Document {
  roomId: number;
  hotel: mongoose.Types.ObjectId;
  type: RoomType;
  roomNo: string;
}

const roomSchema: Schema = new Schema(
  {
    roomId: { type: Number, required: true },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    type: {
      type: Number,
      required: true,
      enum: [
        RoomType.Standard,
        RoomType.Deluxe,
        RoomType.Suite,
        RoomType.Penthouse,
      ],
    },
    roomNo: { type: String, required: true },
  },
  { timestamps: true }
);

const RoomModel =
  mongoose.models?.Room || mongoose.model<IRoom>("Room", roomSchema);

export default RoomModel;
