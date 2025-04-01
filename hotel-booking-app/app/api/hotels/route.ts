import { TResultResponse } from "@/dao";
import { getHotelsByStateAndCountry } from "@/lib/hotels";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const urlSearchParams = req.nextUrl.searchParams;
    if (urlSearchParams && urlSearchParams.get("location")?.trim().length) {
      const locationParts: string[] = urlSearchParams
        .get("location")!
        .trim()
        .split(",");
      const hotelsWithDiscount = await getHotelsByStateAndCountry(
        locationParts[0],
        locationParts[1]
      );
      return Response.json(hotelsWithDiscount, { status: 200 });
    }
  } catch (e) {
    console.error(`Failed to get hotels due to ${e}`);
    return Response.json(
      { message: "Please try again later", result: false } as TResultResponse,
      { status: 500 }
    );
  }
}
