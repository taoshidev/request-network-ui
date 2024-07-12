"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { parseError, parseResult } from "@/db/error";
import { filterData } from "@/utils/sanitize";
import { SubscriptionType } from "@/db/types/subscription";
import { generateApiKey, generateApiSecret } from "./apis";
import { getAuthUser } from "./auth";
import { sendToProxy } from "./apis";

export const getSubscriptions = async (query: object = {}) => {
  try {
    const res = await db.query.subscriptions.findMany(query);
    return filterData(res, ["apiKey", "apiSecret"]);
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};

export const getConsumerApiUrls = async (userId: string) => {
  try {
    const res = await db
      .selectDistinctOn([subscriptions.consumerApiUrl], {
        consumerApiUrl: subscriptions.consumerApiUrl,
      })
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(subscriptions.consumerApiUrl);
    return filterData(res, ["apiKey", "apiSecret"]);
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};

export const getSubscription = async ({ id }: { id: string }) => {
  const res = await db.query.subscriptions.findFirst({
    where: (subscriptions, { eq }) => eq(subscriptions.id, id as string),
  });
  if (!res) throw new Error(`Subscription with ID ${id} not found.`);
  return filterData(res, ["apiKey", "apiSecret"]);
};

export const updateSubscription = async ({
  id,
  ...values
}: Partial<SubscriptionType>) => {
  try {
    const user = await getAuthUser();

    if (user?.user_metadata?.role !== "consumer")
      throw new Error("Error: Unauthorized!");

    const currentSubscription = await db
      .select({
        userId: subscriptions.userId,
      } as any)
      .from(subscriptions)
      .where(eq(subscriptions.id, id as string));

    if (user?.id !== currentSubscription?.[0]?.userId) {
      throw new Error("Error: Unauthorized!");
    }

    return apiUpdateSubscription({ id, ...values });
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};

export const apiUpdateSubscription = async ({
  id,
  ...values
}: Partial<SubscriptionType>) => {
  try {
    const res = await db
      .update(subscriptions)
      .set({ ...values } as any)
      .where(eq(subscriptions.id, id as string))
      .returning();

    // revalidatePath(`/subscriptions/${id}`);
    return parseResult(res, { filter: ["key", "keyId"] });
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};

export const updateProxySubscription = async ({
  id,
  baseApiUrl,
  validatorId,
  ...values
}) => {
  const proxyRes = await sendToProxy({
    endpoint: {
      url: baseApiUrl as string,
      method: "PUT",
      path: `/update-service/${id}`,
    },
    validatorId: validatorId!,
    data: { ...values },
  });
  return proxyRes;
};

export const createSubscription = async (
  subscription: Partial<SubscriptionType>
) => {
  const user = await getAuthUser();

  if (user?.user_metadata?.role !== "consumer")
    throw new Error("Error: Unauthorized!");

  subscription["apiKey"] = generateApiKey();
  subscription["apiSecret"] = generateApiSecret();

  try {
    const res = await db
      .insert(subscriptions)
      .values(subscription as any)
      .returning();

    revalidatePath("/dashboard");
    return parseResult(res, { filter: ["key", "keyId"] });
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};

export const deleteSubscription = async (id: string) => {
  try {
    const res = await db
      .delete(subscriptions)
      .where(eq(subscriptions.id, id as string))
      .returning();

    return parseResult(res);
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};

export const fetchProxyService = async (validator, proxyServiceId) => {
  if (!validator?.apiPrefix) {
    return {};
  }
  const res = await sendToProxy({
    endpoint: {
      url: validator?.baseApiUrl!,
      method: "POST",
      path: `${validator?.apiPrefix}/services/query`,
    },
    validatorId: validator?.id!,
    data: {
      where: [
        {
          type: "eq",
          column: "id",
          value: proxyServiceId!,
        },
      ],
    },
  });

  if (res?.error) {
    return {};
  }
  return res?.data?.[0] || {};
};
