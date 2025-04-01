import { TResultResponse } from "@/dao";
import { getHotelsWithDiscount, getLocations } from "@/lib/hotels";

export async function GET() {
  try {
    const hotelsWithDiscount = await getHotelsWithDiscount();
    return Response.json(hotelsWithDiscount, { status: 200 });
  } catch (e) {
    console.error(`Failed to get hotels with discount due to ${e}`);
    return Response.json(
      { message: "Please try again later", result: false } as TResultResponse,
      { status: 500 }
    );
  }
}
