import { sendEmail } from "@/actions/email";
import { apiUpdateSubscription } from "@/actions/subscriptions";
import { endpoints, subscriptions, users, validators } from "@/db/schema";
import { db } from "@/db";
import {
  jsonResponse,
  verifyApiServerRequest,
} from "@/utils/verify-api-server-request";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { invoiceHTML, invoiceText } from "@/templates/stripe-payment-invoice";
import {
  canceledSubHTML,
  canceledSubText,
} from "@/templates/canceled-subscription";
import { getKey, updateKey } from "@/actions/keys";
import { revalidatePath } from "next/cache";

export const PUT = async (req: NextRequest): Promise<NextResponse> => {
  try {
    const { status, message, body } = await verifyApiServerRequest(req);

    if (status !== 200) {
      return jsonResponse(status, message);
    }

    const { subscriptionId: id, active, type, quantity, transaction } = body;
    await apiUpdateSubscription({
      id,
      active,
    });

    const subscriptionRes = await db
      .select({
        id: subscriptions.id,
        userId: subscriptions.userId,
        keyId: subscriptions.keyId,
        consumerApiUrl: subscriptions.consumerApiUrl,
        to: users.email,
        validatorName: validators.name,
        endpointUrl: endpoints.url,
      } as any)
      .from(subscriptions)
      .innerJoin(users, eq(users.id, subscriptions?.userId))
      .innerJoin(endpoints, eq(endpoints.id, subscriptions?.endpointId))
      .innerJoin(validators, eq(validators.id, subscriptions?.validatorId))
      .where(eq(subscriptions.id, id as string));

    const subscription: any = subscriptionRes?.[0];

    switch (type) {
      case "charge.succeeded":
      case "CHARGE.SUCCEEDED":
        const { result, error } = await getKey({ keyId: subscription?.keyId });
        const res = await updateKey({
          keyId: subscription?.keyId,
          userId: subscription?.userId,
          params: { remaining: +(result?.remaining || 0) + +quantity },
        });

        if (res?.status !== 200) {
          return NextResponse.json({
            message: "Error updating unkey.",
            status: 500,
          });
        }

      case "BILLING.SUBSCRIPTION.ACTIVATED":
      case "invoice.payment_succeeded":
        sendEmail({
          to: subscription.to,
          html: invoiceHTML({
            consumerApiUrl: subscription.consumerApiUrl,
            validatorName: subscription.validatorName,
            endpointUrl: subscription.endpointUrl,
            transaction,
          }),
          text: invoiceText({
            consumerApiUrl: subscription.consumerApiUrl,
            validatorName: subscription.validatorName,
            endpointUrl: subscription.endpointUrl,
            transaction,
          }),
          subject: `Payment to ${subscription.validatorName} Succeeded`,
        });
        break;
      case "invoice.payment_failed":
        break;
      case "BILLING.SUBSCRIPTION.EXPIRED":
      case "BILLING.SUBSCRIPTION.CANCELLED":
      case "customer.subscription.deleted":
        sendEmail({
          to: subscription.to,
          html: canceledSubHTML({
            consumerApiUrl: subscription.consumerApiUrl,
            validatorName: subscription.validatorName,
            endpointUrl: subscription.endpointUrl,
          }),
          text: canceledSubText({
            consumerApiUrl: subscription.consumerApiUrl,
            validatorName: subscription.validatorName,
            endpointUrl: subscription.endpointUrl,
          }),
          subject: `Subscription to ${subscription.validatorName} Canceled`,
        });
        break;
      default:
        break;
    }

    return NextResponse.json({
      message: "Subscription status synced.",
      status: 200,
    });
  } catch (error: Error | unknown) {
    console.error(error);
    return NextResponse.json({
      message: "Error updating subscription status.",
      status: 200,
    });
  }
};
