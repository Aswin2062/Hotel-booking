import { IBookingRequest, TResultResponse } from "@/dao";
import { authOptions } from "@/lib/auth";
import { getBookings, saveBooking } from "@/lib/booking";
import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as IBookingRequest;
  try {
    const session = await getServerSession(authOptions);
    if (session?.userId) {
      const response = await saveBooking(body, session.userId!);
      if (typeof response === "string") {
        return Response.json(
          { message: response, result: false } as TResultResponse,
          { status: 400 }
        );
      }
      return Response.json(response, { status: 201 });
    }
  } catch (e) {
    console.error(`Failed to save booking for ${body} by  due to ${e}`);
    return Response.json(
      { message: "Please try again later", result: false } as TResultResponse,
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const urlSearchParams = req.nextUrl.searchParams;
    const statusFilter = urlSearchParams.get('status');
    const sortBy = urlSearchParams.get('sortBy');
    const pageNo = urlSearchParams.get('page');
    if (session?.userId) {
      const response = await getBookings(session.userId!, sortBy, isNaN(Number(pageNo)) ? undefined : Number(pageNo) , statusFilter);
      return Response.json(response, { status: 200 });
    }
  } catch (e) {
    console.error(`Failed to get bookings due to ${e}`);
    return Response.json(
      { message: "Please try again later", result: false } as TResultResponse,
      { status: 500 }
    );
  }
}