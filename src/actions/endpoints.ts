"use server";

import { revalidatePath } from "next/cache";
import { eq, asc } from "drizzle-orm";
import { db } from "@/db";
import { endpoints, users } from "@/db/schema";
import { validators } from "@/db/schema";
import { subscriptions } from "@/db/schema";
import { parseError, parseResult } from "@/db/error";
import { EndpointType } from "@/db/types/endpoint";
import { getAuthUser } from "./auth";

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

export const getEndpointWithSubscription = async ({
  id,
}: {
  id: string;
}): Promise<EndpointType | Error> => {
  try {
    const results = await db.query.endpoints.findFirst({
      where: eq(endpoints.id, id),
      with: {
        subscriptions: {
          columns: {
            id: true,
          },
          with: {
            user: {
              columns: {
                id: true,
                email: true,
              },
            },
          },
        },
        validator: {
          columns: {
            id: true,
            userId: true,
            baseApiUrl: true,
            hotkey: true,
            apiPrefix: true,
            verified: true,
            stripeEnabled: true,
          },
        },
      },
    });

    return results as EndpointType;
  } catch (error) {
    if (error instanceof Error) console.log(error.stack);
    return parseError(error);
  }
};

export const createEndpoint = async (endpoint: EndpointType) => {
  try {
    const user = await getAuthUser();

    if (user?.user_metadata?.role !== "validator")
      throw new Error("Error: Unauthorized!");

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
    const user = await getAuthUser();

    if (user?.user_metadata?.role !== "validator")
      throw new Error("Error: Unauthorized!");

    const currentEndpoint: any = await db
      .select({
        url: endpoints.url,
        validatorUserId: validators.userId,
      } as any)
      .from(endpoints)
      .innerJoin(validators, eq(validators.id, endpoints?.validatorId))
      .where(eq(endpoints.id, id));

    if (user?.id !== currentEndpoint?.[0]?.validatorUserId) {
      throw new Error("Error: Unauthorized!");
    }

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
