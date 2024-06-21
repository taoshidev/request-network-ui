import { sendEmail } from "@/actions/email";
import {
  updateSubscription,
  updateSubscriptionFromWebhook,
} from "@/actions/subscriptions";
import { subscriptions, users, validators } from "@/db/schema";
import { db } from "@/db";
import {
  jsonResponse,
  verifyApiServerRequest,
} from "@/utils/verify-api-server-request";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { invoiceHTML, invoiceText } from "@/templates/stripe-payment-invoice";

export const PUT = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { status, message, body } = await verifyApiServerRequest(req);

    if (status !== 200) {
      return jsonResponse(status, message);
    }

    const { subscriptionId: id, active, type, transaction } = body;
    await updateSubscriptionFromWebhook({
      id,
      active,
    });

    const subscriptionRes = await db
      .select({
        id: subscriptions.id,
        consumerApiUrl: subscriptions.consumerApiUrl,
        to: users.email,
        validatorName: validators.name,
      } as any)
      .from(subscriptions)
      .innerJoin(users, eq(users.id, subscriptions?.userId))
      .innerJoin(validators, eq(validators.id, subscriptions?.validatorId))
      .where(eq(subscriptions.id, id as string));

    const subscription: any = subscriptionRes?.[0];

    switch (type) {
      case "invoice.payment_succeeded":
        sendEmail({
          to: subscription.to,
          html: invoiceHTML({
            consumerApiUrl: subscription.consumerApiUrl,
            validatorName: subscription.validatorName,
            transaction,
          }),
          text: invoiceText({
            consumerApiUrl: subscription.consumerApiUrl,
            validatorName: subscription.validatorName,
            transaction,
          }),
          subject: `Payment to ${subscription.validatorName} Succeeded`,
        });
        break;
      case "invoice.payment_failed":
        break;
      case "customer.subscription.deleted":
        break;
      default:
        break;
    }

    return NextResponse.json({
      message: "Subscription status synced.",
      status: 200,
    });
  } catch (error: Error | unknown) {
    return NextResponse.json({
      message: "Error updating subscription status.",
      status: 200,
    });
  }
};
