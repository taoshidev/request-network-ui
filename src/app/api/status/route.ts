import { updateSubscription } from "@/actions/subscriptions";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body = await req.json();
    const { subscriptionId: id, active } = body;
    updateSubscription({
      id,
      active
    })
    return NextResponse.json({ message: 'Subscription status synced.', status: 200 });
  } catch (error: Error | unknown) {
    return NextResponse.json({ message: 'Error updating subscription status.', status: 200 });
  }
}