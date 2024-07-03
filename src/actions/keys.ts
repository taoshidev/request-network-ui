"use server";

import { Unkey } from "@unkey/api";
import { getAuthUser } from "./auth";
import * as Sentry from "@sentry/nextjs";

const unkey = new Unkey({ rootKey: process.env.UNKEY_ROOT_KEY as string });

export const updateKey = async ({
  keyId,
  userId,
  params,
}: {
  keyId: string;
  userId?: string;
  params: object;
}) => {
  try {
    const user = await getAuthUser();
    const key = await await unkey.keys.get({ keyId });

    if (![user?.id, userId].includes(key?.result?.ownerId)) {
      throw new Error("Error: Unauthorized!");
    }

    await unkey.keys.update({
      keyId,
      ...params,
    });
    return { status: 200, message: "Key updated successfully" };
  } catch (error) {
    console.error(error);
  }
};

export const updateRemaining = async ({
  keyId,
  userId,
  value,
  op = "increment",
}: {
  keyId: string;
  userId?: string;
  value: number;
  op?: "increment" | "decrement" | "set";
}) => {
  const user = await getAuthUser();
  const key = await await unkey.keys.get({ keyId });

  if (![user?.id, userId].includes(key?.result?.ownerId)) {
    throw new Error("Error: Unauthorized!");
  }

  await await unkey.keys.updateRemaining({ keyId, op, value });
  return { status: 200, message: "Key updated successfully" };
};

export const deleteKey = async ({ keyId }: { keyId: string }) => {
  try {
    await unkey.keys.delete({ keyId });
    return { status: 204, message: "Key deleted successfully" };
  } catch (error) {
    console.error(error);
  }
};

export const getKey = async ({ keyId }: { keyId: string }) => {
  const { error, result } = await unkey.keys.get({ keyId });
  return { error, result };
};

export const createKey = async (apiId: string, params: any) => {
  try {
    const { result } = await unkey.keys.create({
      apiId,
      prefix: "req",
      ...params,
    });

    return {
      result,
      error: null,
    };
  } catch (error) {
    Sentry.captureException(error);
    return { result: null, error };
  }
};

export const getUserAPIKeys = async ({
  apiId,
  ownerId,
}: {
  apiId: string;
  ownerId?: string;
}) => {
  const request = {
    apiId,
  };
  if (ownerId) {
    Object.assign(request, { ownerId });
  }
  return await unkey.apis.listKeys(request);
};

export const getVerifications = async ({
  keyId,
  ownerId,
  start = null,
  end = null,
}: {
  keyId: string;
  ownerId?: string;
  start?: number | null;
  end?: number | null;
}) => {
  const request = {
    keyId,
    start,
    end,
  };
  if (ownerId) {
    Object.assign(request, { ownerId });
  }
  return await unkey.keys.getVerifications(request);
};
getVerifications;
