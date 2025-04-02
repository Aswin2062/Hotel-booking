import { IAvailabilityRequest, TResultResponse } from "@/dao";
import { getAvailableRooms } from "@/lib/booking";

export async function POST(req: Request) {
  const { hotelPk, checkIn, checkout } =
    (await req.json()) as IAvailabilityRequest;
  if (
    !hotelPk ||
    hotelPk.trim().length === 0 ||
    !checkIn ||
    checkIn.trim().length === 0 ||
    !checkout ||
    checkout.trim().length === 0
  ) {
    return Response.json(
      {
        message: "Mandatory Fields are missing",
        result: false,
      } as TResultResponse,
      { status: 400 }
    );
  }
  try {
    const response = await getAvailableRooms(hotelPk, checkIn, checkout);
    console.log(response);
    if (typeof response === "string") {
      return Response.json(
        { message: response, result: false } as TResultResponse,
        { status: 400 }
      );
    }
    return Response.json(response, { status: 200 });
  } catch (e) {
    console.error(
      `Failed to check availability for ${hotelPk} ${checkIn} ${checkout} due to ${e}`
    );
    return Response.json(
      { message: "Please try again later", result: false } as TResultResponse,
      { status: 500 }
    );
  }
}
