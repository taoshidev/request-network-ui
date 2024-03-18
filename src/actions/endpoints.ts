"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";

import { endpoints } from "@/db/schema";

export const getEndpoints = async () => {
  try {
    const results = await db.query.endpoints.findMany({
      with: { subnets: true },
    });

    return results;
  } catch (error) {
    if (error instanceof Error) console.log(error.stack);
  }
};

export const getEndpoint = async ({ id }: { id: string }) => {
  try {
    const results = await db
      .select()
      .from(endpoints)
      .where(eq(endpoints.id, id));

    return results;
  } catch (error) {
    if (error instanceof Error) console.log(error.stack);
  }
};

export const createEndpoint = async (endpoint: any) => {
  try {
    const results = await db.insert(endpoints).values(endpoint).returning();
    revalidatePath("/dashboard");
    return { results, error: null };
  } catch (error) {
    return { result: null, error };
  }
};

export const updateEndpoint = async ({ id, ...values }: any) => {
  try {
    const results = await db
      .update(endpoints)
      .set(values)
      .where(eq(endpoints.id, id));

    return { results, error: null };
  } catch (error) {
    return { result: null, error };
  }
};
