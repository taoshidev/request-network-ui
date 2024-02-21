"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";

import { endpoints } from "@/db/schema";

export const getEndpoints = async () => {
  try {
    const results = await db.select().from(endpoints);

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

    return { results, error: null };
  } catch (error) {
    return { result: null, error };
  }
};

export const updateEndpoint = async (endpoint: any) => {
  try {
    const results = await db
      .update(endpoints)
      .set(endpoint)
      .where(eq(endpoints.id, endpoint.id));

    return { results, error: null };
  } catch (error) {
    return { result: null, error };
  }
};
