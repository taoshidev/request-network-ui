'use server';

import { and, eq } from "drizzle-orm";
import { sendToProxy } from "./apis";
import { getSubscriptions } from "./subscriptions";
import { subscriptions } from "@/db/schema";
import { getAuthUser } from "./auth";
import { getValidator } from "./validators";
import { ValidatorType } from "@/db/types/validator";

export async function requestPayment(proxyServiceId: string, redirect: string = '') {
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
      redirect
    },
  });

  return { subscription, token: tokenRes?.token };
}

export async function cancelSubscription(proxyServiceId) {
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

  return await sendToProxy({
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
}

export async function checkForStripe(validatorId: string) {
  const validator: ValidatorType = await getValidator({id: validatorId });
  return await sendToProxy({
    endpoint: {
      url: 'http://localhost:8080' as string,
      method: "POST",
      path: "/has-stripe",
    },
    validatorId: validator.id as string,
    data: {}
  });
}
