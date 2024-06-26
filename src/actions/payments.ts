"use server";

import { and, eq } from "drizzle-orm";
import { sendToProxy } from "./apis";
import { getSubscriptions, updateSubscription } from "./subscriptions";
import { subscriptions } from "@/db/schema";
import { getAuthUser } from "./auth";
import { getValidator } from "./validators";
import { ValidatorType } from "@/db/types/validator";
import { revalidatePath } from "next/cache";
import { StripeCheckType } from "@/db/types/stripe-check";
import { PayPalCheckType } from "@/db/types/paypal-check";

export async function requestPayment(
  proxyServiceId: string,
  returnRedirect: string = ""
) {
  const user = await getAuthUser();

  const subRes = await getSubscriptions({
    where: and(eq(subscriptions.proxyServiceId, proxyServiceId)),
    with: {
      endpoint: {
        with: {
          validator: true,
        },
      },
    },
  });
  const subscription = subRes?.[0];

  if (user?.id !== subscription?.userId) {
    throw new Error("Error: Unauthorized!");
  }

  const tokenRes = await sendToProxy({
    endpoint: {
      url: subscription?.endpoint?.validator?.baseApiUrl as string,
      method: "POST",
      path: "/request-payment",
    },
    validatorId: subscription?.endpoint?.validatorId,
    data: {
      url: subscription?.endpoint?.url,
      email: user?.email,
      serviceId: subscription?.proxyServiceId as string,
      redirect: returnRedirect,
    },
  });

  return { subscription, token: tokenRes?.token };
}

export async function cancelSubscription(proxyServiceId) {
  const user = await getAuthUser();
  const subRes = await getSubscriptions({
    where: and(eq(subscriptions.proxyServiceId, proxyServiceId)),
    with: {
      endpoint: {
        with: {
          validator: true,
        },
      },
    },
  });

  const subscription = subRes?.[0];
  if (user?.id !== subscription?.userId) {
    throw new Error("Error: Unauthorized!");
  }

  const proxyRes = await sendToProxy({
    endpoint: {
      url: subscription?.endpoint?.validator?.baseApiUrl as string,
      method: "POST",
      path: "/cancel-subscription",
    },
    validatorId: subscription?.endpoint?.validatorId,
    data: {
      serviceId: subscription?.proxyServiceId as string,
    },
  });

  await updateSubscription({
    id: subscription?.id,
    active: false,
  });

  revalidatePath("/subscription");
  return proxyRes;
}

export async function checkForStripe(
  validatorId: string
): Promise<Partial<StripeCheckType>> {
  const validator: ValidatorType = await getValidator({ id: validatorId });
  return await sendToProxy({
    endpoint: {
      url: validator?.baseApiUrl as string,
      method: "POST",
      path: "/has-stripe",
    },
    validatorId: validator?.id as string,
    data: {},
  });
}

export async function checkForPayPal(
  validatorId: string
): Promise<Partial<PayPalCheckType>> {
  const validator: ValidatorType = await getValidator({ id: validatorId });
  return await sendToProxy({
    endpoint: {
      url: validator?.baseApiUrl as string,
      method: "POST",
      path: "/has-paypal",
    },
    validatorId: validator?.id as string,
    data: {},
  });
}
