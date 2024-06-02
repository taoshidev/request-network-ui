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
export enum BILLING_EVENT_TYPE {
  BALANCE_CHECKED = "balance-checked",
  TRANSACTION_CHECKED = "transaction-checked",
  TRANSACTION_CONFIRMED = "transaction-confirmed",
}

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const body = await req.json();
    const { subscriptionId: id, serviceStatusType, eventType } = body;
    let content: string = "",
      type: NOTIFICATION_TYPE | null = null;
    const subRes = await getSubscriptions({
      columns: {
        id: true,
        appName: true,
        consumerApiUrl: true,
      },
      where: and(eq(subscriptions.id, id)),
      with: {
        user: { columns: { id: true, email: true } },
        endpoint: { columns: { id: true, url: true } },
        validator: {
          columns: { id: true, name: true },
          with: {
            user: { columns: { id: true, email: true } },
          },
        },
      },
    });
    const subscription = subRes?.[0];

    const subscriptionData = `**App Name:** ${subscription.appName}\r\n\r\n**API URL:** ${subscription.consumerApiUrl}\r\n\r\n**Validator Name:** ${subscription.validator.name}\r\n\r\n**Endpoint:** ${subscription.endpoint.url}`;

    switch (eventType) {
      case BILLING_EVENT_TYPE.TRANSACTION_CONFIRMED:
        type = NOTIFICATION_TYPE.SUCCESS;
        content = `Endpoint subscription payment made.`;
        break;
      case BILLING_EVENT_TYPE.BALANCE_CHECKED:
        type = NOTIFICATION_TYPE.INFO;
        content = `Endpoint balance has been checked.`;
        break;
      case BILLING_EVENT_TYPE.TRANSACTION_CHECKED:
        type = NOTIFICATION_TYPE.INFO;
        content = `Endpoint transaction has been checked.`;
        break;
      default:
        break;
    }

    switch (serviceStatusType) {
      case SERVICE_STATUS_TYPE.NEW:
        type = NOTIFICATION_TYPE.SUCCESS;
        content += " Endpoint payment complete.";
        break;
      case SERVICE_STATUS_TYPE.IN_GRACE_PERIOD:
        content += " Currently in grace period.";
        type = NOTIFICATION_TYPE.INFO;
        break;
      case SERVICE_STATUS_TYPE.ON_TIME:
        content += " Currently in grace period.";
        type = NOTIFICATION_TYPE.INFO;
        break;
      case SERVICE_STATUS_TYPE.DELINQUENT:
        content += " Payment is currently due.";
        type = NOTIFICATION_TYPE.WARNING;
        break;
      case SERVICE_STATUS_TYPE.CANCELLED:
        content += " Endpoint subscription has expired.";
        type = NOTIFICATION_TYPE.WARNING;
        break;
      default:
        break;
    }

    if (content && type && eventType) {
      await sendNotification({
        type,
        subject: "Request Network Subscription Payment Update",
        content: `${content}\r\n\r\n${subscriptionData}`,
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
