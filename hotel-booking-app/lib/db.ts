import mongoose, { Connection } from "mongoose";
import { addHotelMasterData } from "./hotels";
let cachedConnection: Connection | null = null;

export async function connectToMongoDB() {
  if (cachedConnection) {
    console.log("Using cached db connection");
    return cachedConnection;
  }
  try {
    const cnx = await mongoose.connect(process.env.MONGODB_URI!);
    cachedConnection = cnx.connection;
    console.log("New mongodb connection established");
    await addDefaultRecords();
    return cachedConnection;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function addDefaultRecords() {
  return Promise.all([addHotelMasterData()]);
}
