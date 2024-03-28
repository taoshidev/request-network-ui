"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";

import { subscriptions } from "@/db/schema";
import { parseError, parseResult } from "@/db/error";
import { filterData } from "@/utils/sanitize";

export interface SubscriptionType {
  id: string;
  endpointId: string;
  userId: string;
  keyId: string;
  key: string;
}

export const getSubscriptions = async (query: object = {}) => {
  try {
    const res = await db.query.subscriptions.findMany(query);
    return filterData(res, ["key", "keyId"]);
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};

export const getSubscription = async ({ id }: SubscriptionType) => {
  const res = await db.query.subscriptions.findFirst({
    where: (subscriptions, { eq }) => eq(subscriptions.id, id),
  });
  if (!res) throw new Error(`Subscription with ID ${id} not found.`);
  return filterData(res, ["key", "keyId"]);
};

export const updateSubscription = async ({
  id,
  ...values
}: Partial<SubscriptionType>) => {
  try {
    const res = await db
      .update(subscriptions)
      .set({ ...values })
      .where(eq(subscriptions.id, id as string))
      .returning();

    // revalidatePath(`/subscriptions/${id}`);

    return parseResult(res, { filter: ["key", "keyId"] });
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};

export const createSubscription = async (
  subscription: Partial<SubscriptionType>
) => {
  try {
    const res = await db.insert(subscriptions).values(subscription).returning();

    revalidatePath("/dashboard");
    return parseResult(res, { filter: ["key", "keyId"] });
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};
