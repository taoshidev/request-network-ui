"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";

import { settings, validators } from "@/db/schema";

export const getValidators = async () => {
  try {
    const results = await db.select().from(validators);

    return results;
  } catch (error) {
    if (error instanceof Error) console.log(error.stack);
  }
};

export const getValidator = async ({ id }: { id: string }) => {
  try {
    const results = await db
      .select()
      .from(validators)
      .where(eq(validators.id, id));

    return results;
  } catch (error) {
    if (error instanceof Error) console.log(error.stack);
  }
};

export const getSettings = async () => {
  try {
    const results = await db.select().from(settings);

    return results;
  } catch (error) {
    if (error instanceof Error) console.log(error.stack);
  }
};

export const updateValidator = async ({
  endpoint,
  hotkey,
  id,
}: {
  endpoint: string;
  hotkey: string;
  id: string;
}) => {
  try {
    const results = await db
      .update(validators)
      .set({ endpoint, hotkey })
      .where(eq(validators.id, id));

    return results;
  } catch (error) {
    if (error instanceof Error) console.log(error.stack);
  }
};

interface CreateValidator {
  id: string;
  endpoint: string;
  hotkey: string;
}

export const createValidator = async ({
  id,
  endpoint,
  hotkey,
}: CreateValidator) => {
  try {
    const results = await db.insert(validators).values({
      id,
      hotkey,
      endpoint,
    });

    return results;
  } catch (error) {
    if (error instanceof Error) console.log(error.stack);
  }
};

interface CreateSettings {
  id: string;
  limit: number;
  refillRate: number;
  refillInterval: number;
  remaining: number;
  expires: number;
}

export const createSettings = async ({
  id,
  limit,
  refillRate,
  refillInterval,
  remaining,
  expires,
}: CreateSettings) => {
  try {
    const results = await db.insert(settings).values({
      id,
      enabled: true,
      limit: limit || 10,
      refillRate: refillRate || 1,
      refillInterval: refillInterval || 1,
      remaining: remaining || 10,
    });

    return { results, error: null };
  } catch (error) {
    return { result: null, error };
  }
};
