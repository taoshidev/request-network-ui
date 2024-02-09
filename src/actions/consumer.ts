"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";

import { consumers } from "@/db/schema";

export const getConsumers = async () => {
  try {
    const results = await db.select().from(consumers);

    return results;
  } catch (error) {
    if (error instanceof Error) console.log(error.stack);
  }
};

export const getConsumer = async ({ id }: { id: string }) => {
  try {
    const results = await db
      .select()
      .from(consumers)
      .where(eq(consumers.id, id));

    return results;
  } catch (error) {
    if (error instanceof Error) console.log(error.stack);
  }
};

export const createConsumer = async ({ id }: { id: string }) => {
  try {
    const results = await db.insert(consumers).values({ id });

    return results;
  } catch (error) {
    if (error instanceof Error) console.log(error.stack);
  }
};

export const updateConsumer = async ({
  endpoint,
  id,
}: {
  endpoint: string;
  id: string;
}) => {};
