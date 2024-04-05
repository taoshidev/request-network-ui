"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";

import { endpoints } from "@/db/schema";
import { parseError, parseResult } from "@/db/error";
import { EndpointType } from "@/db/types/endpoint";

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

export const createEndpoint = async (endpoint: EndpointType) => {
  try {
    const res = await db.insert(endpoints).values(endpoint).returning();
    revalidatePath("/dashboard");
    return parseResult(res);
  } catch (error) {
    return parseError(error);
  }
};

export const updateEndpoint = async ({
  id,
  ...values
}: Partial<EndpointType>) => {
  try {
    const res = await db
      .update(endpoints)
      .set(values)
      .where(eq(endpoints.id, id as string))
      .returning();

    return parseResult(res, { filter: ["url", "subnet", "validator"] });
  } catch (error) {
    return parseError(error);
  }
};
