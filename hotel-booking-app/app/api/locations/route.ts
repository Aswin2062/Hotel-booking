import { TResultResponse } from "@/dao";
import { getLocations } from "@/lib/hotels";

export async function GET() {
  try {
    const locations = await getLocations();
    return Response.json(locations, { status: 200 });
  } catch (e) {
    console.error(`Failed to get locations due to ${e}`);
    return Response.json(
      { message: "Please try again later", result: false } as TResultResponse,
      { status: 500 }
    );
  }
}
