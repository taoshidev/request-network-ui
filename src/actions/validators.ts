"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";

import { validators } from "@/db/schema";

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

export const updateValidator = async ({
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
      .set({ hotkey })
      .where(eq(validators.id, id));

    return results;
  } catch (error) {
    if (error instanceof Error) console.log(error.stack);
  }
};

interface CreateValidator {
  id: string;
  hotkey: string;
}

export const createValidator = async ({ id, hotkey }: CreateValidator) => {
  try {
    const results = await db.insert(validators).values({
      id,
      hotkey,
    });

    return results;
  } catch (error) {
    if (error instanceof Error) console.log(error.stack);
  }
};
