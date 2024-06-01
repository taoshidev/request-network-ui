import { NextRequest, NextResponse } from "next/server";

enum SERVICE_STATUS_TYPE {
  NEW = "new",
  IN_GRACE_PERIOD = "in grace period",
  ON_TIME = "on time",
  DELINQUENT = "delinquent",
  CANCELLED = "cancelled",
}

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body = await req.json();
    const { subscriptionId: id, serviceStatusType } = body;

    return NextResponse.json({ message: 'Subscription status synced.', status: 200 });
  } catch (error: Error | unknown) {
    return NextResponse.json({ message: 'Error updating subscription status.', status: 200 });
  }
}