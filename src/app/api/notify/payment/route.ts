import { sendNotification } from "@/actions/notifications";
import { getSubscriptions } from "@/actions/subscriptions";
import { subscriptions } from "@/db/schema";
import { NOTIFICATION_TYPE } from "@/hooks/use-notification";
import { and, eq } from "drizzle-orm";
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
    let content: string | null = null,
      type: NOTIFICATION_TYPE | null = null;
    const subRes = await getSubscriptions({
      columns: {
        id: true,
        appName: true,
        consumerApiUrl: true
      },
      where: and(eq(subscriptions.id, id)),
      with: {
        user: { columns: { id: true, email: true } },
        endpoint: { columns: { id: true, url: true }},
        validator: {
          columns: { id: true, name: true },
          with: {
            user: { columns: { id: true, email: true } },
          },
        },
      },
    });
    const subscription = subRes?.[0];

    const subscriptionData = `App Name: ${
      subscription.appName
    }\r\n API URL: ${
      subscription.consumerApiUrl
    }\r\nValidator Name: ${
      subscription.validator.name
    }\r\n${
      subscription.endpoint.url
    }`;

    switch (serviceStatusType) {
      case SERVICE_STATUS_TYPE.NEW:
        type = NOTIFICATION_TYPE.SUCCESS;
        content = `Endpoint subscription has been paid.`;
        break;
      case SERVICE_STATUS_TYPE.IN_GRACE_PERIOD:
        type = NOTIFICATION_TYPE.INFO;
        content = `Endpoint subscription is now in grace period.`;
        break;
      case SERVICE_STATUS_TYPE.ON_TIME:
        type = NOTIFICATION_TYPE.INFO;
        content = `Endpoint subscription payment on time.`;
        break;
      case SERVICE_STATUS_TYPE.DELINQUENT:
        type = NOTIFICATION_TYPE.WARNING;
        content = `Endpoint subscription is late.`;
        break;
      case SERVICE_STATUS_TYPE.CANCELLED:
        type = NOTIFICATION_TYPE.WARNING;
        content = `Endpoint subscription cancelled.`;
        break;
      default:
        break;
    }

    if (content && type) {
      await sendNotification({
        type,
        subject: "Request Network Subscription Payment Update",
        content: `${content}\r\n${subscriptionData}`,
        fromUserId: subscription.validator?.user?.id,
        userNotifications: [subscription.validator.user, subscription.user],
      });

      return NextResponse.json({
        message: "Subscription notification sent.",
        status: 200,
      });
    } else {
      return NextResponse.json({
        message: "Error sending subscription notification.",
        status: 200,
      });
    }
  } catch (error: Error | unknown) {
    return NextResponse.json({
      message: "Error sending subscription notification.",
      status: 200,
    });
  }
};
