'use server';

import { and, eq } from "drizzle-orm";
import { sendToProxy } from "./apis";
import { getSubscriptions } from "./subscriptions";
import { subscriptions } from "@/db/schema";
import { getAuthUser } from "./auth";

export async function requestPayment(proxyServiceId: string) {
  const currentUser = await getAuthUser();
  const subRes = await getSubscriptions({
    where: and(eq(subscriptions.proxyServiceId, proxyServiceId)),
    with: {
      endpoint: {
        with: {
          validator: true
        }
      }
    }
  });
  const subscription = subRes?.[0];

  const tokenRes = await sendToProxy({
    endpoint: {
      url: subscription?.endpoint?.validator?.baseApiUrl as string,
      method: "POST",
      path: "/request-payment",
    },
    validatorId: subscription?.endpoint?.validatorId,
    data: {
      url: subscription?.endpoint?.url,
      email: currentUser?.email,
      serviceId: subscription?.proxyServiceId as string,
    },
  });

  return { subscription, token: tokenRes?.token };
}
