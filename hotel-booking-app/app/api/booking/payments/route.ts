import { TResultResponse } from "@/dao";
import { authOptions } from "@/lib/auth";
import { updatePaymentStatus } from "@/lib/booking";
import { getServerSession } from "next-auth";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { bookingId, paymentId } = (await req.json()) as {
    bookingId: string;
    paymentId?: string;
  };
  try {
    const session = await getServerSession(authOptions);
    if (session?.userId) {
      const response = await updatePaymentStatus(
        bookingId,
        session.userId!,
        paymentId
      );
      if (typeof response === "string") {
        return Response.json(
          { message: response, result: false } as TResultResponse,
          { status: 400 }
        );
      }
      return Response.json({ data: true }, { status: 201 });
    }
  } catch (e) {
    console.error(
      `Failed to update payment status for ${bookingId}, ${paymentId} by  due to ${e}`
    );
    return Response.json(
      { message: "Please try again later", result: false } as TResultResponse,
      { status: 500 }
    );
  }
}
