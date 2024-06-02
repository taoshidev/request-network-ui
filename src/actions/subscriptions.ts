"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { parseError, parseResult } from "@/db/error";
import { filterData } from "@/utils/sanitize";
import { SubscriptionType } from "@/db/types/subscription";
import { generateApiKey, generateApiSecret } from "./apis";

export const getSubscriptions = async (query: object = {}) => {
  try {
    const res = await db.query.subscriptions.findMany(query);
    return filterData(res, ["apiKey", "apiSecret"]);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) return parseError(error);
  }
};

export const getSubscription = async ({id}: {id: string}) => {
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

export const createSubscription = async (
  subscription: Partial<SubscriptionType>
) => {
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
