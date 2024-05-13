"use server";

import { revalidatePath } from "next/cache";
import { eq, asc } from "drizzle-orm";
import { db } from "@/db";
import { endpoints } from "@/db/schema";
import { validators } from "@/db/schema";
import { subscriptions } from "@/db/schema";
import { parseError, parseResult } from "@/db/error";
import { EndpointType } from "@/db/types/endpoint";

export const getEndpoints = async (query: object = {}) => {
  try {
    const results = await db.query.endpoints.findMany(query);

    return results;
  } catch (error) {
    if (error instanceof Error) console.log(error.stack);
  }
};

export const getEndpoint = async ({ id }: { id: string }) => {
  try {
    const results = await db
      .select({
        ...endpoints,
        subscription: subscriptions,
        validator: {
          id: validators.id,
          baseApiUrl: validators.baseApiUrl,
          hotkey: validators.hotkey,
          apiPrefix: validators.apiPrefix,
        },
      } as any)
      .from(endpoints)
      .innerJoin(validators, eq(validators.id, endpoints?.validatorId))
      .leftJoin(subscriptions, eq(subscriptions.endpointId, endpoints.id))
      .where(eq(endpoints.id, id));

    return results;
  } catch (error) {
    if (error instanceof Error) console.log(error.stack);
  }
};

export const getEndpointWithSubscription = async ({ id }: { id: string }) => {
  try {
    const results = await db
      .select({
        ...endpoints,
        validator: {
          id: validators.id,
          baseApiUrl: validators.baseApiUrl,
          hotkey: validators.hotkey,
          apiPrefix: validators.apiPrefix,
        },
      } as any)
      .from(endpoints)
      .innerJoin(validators, eq(validators.id, endpoints.validatorId))
      .leftJoin(subscriptions, eq(subscriptions.endpointId, endpoints.id))
      .where(eq(endpoints.id, id));

    return results;
  } catch (error) {
    if (error instanceof Error) console.log(error.stack);
  }
};

export const createEndpoint = async (endpoint: EndpointType) => {
  try {
    const res = await db
      .insert(endpoints)
      .values(endpoint as any)
      .returning();
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
      .set(values as any)
      .where(eq(endpoints.id, id as string))
      .returning();

    return parseResult(res, { filter: ["url", "subnet", "validator"] });
  } catch (error) {
    return parseError(error);
  }
};

export const checkEndpointWalletAddressExists = async (address: string) => {
  try {
    const res = await db
      .select()
      .from(endpoints)
      .where(eq(endpoints.walletAddress, address));
    return res?.length > 0;
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};
