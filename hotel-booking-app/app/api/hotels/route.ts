import { IHotelDao, TResultResponse } from "@/dao";
import { getHotels, getHotelsByStateAndCountry } from "@/lib/hotels";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    let hotels: IHotelDao[] = [];
    const urlSearchParams = req.nextUrl.searchParams;
    if (urlSearchParams && urlSearchParams.get("location")?.trim().length) {
      const locationParts: string[] = urlSearchParams
        .get("location")!
        .trim()
        .split(",");
      hotels = await getHotelsByStateAndCountry(
        locationParts[0],
        locationParts[1]
      );
    } else {
      hotels = await getHotels();
    }
    return Response.json(hotels, { status: 200 });
  } catch (e) {
    console.error(`Failed to get hotels due to ${e}`);
    return Response.json(
      { message: "Please try again later", result: false } as TResultResponse,
      { status: 500 }
    );
  }
}
