"use server";

import { Unkey, verifyKey } from "@unkey/api";

const unkey = new Unkey({ rootKey: process.env.UNKEY_ROOT_KEY as string });
const apiId = process.env.UNKEY_API_KEY as string;

export const getAPIKey = async ({ keyId }: { keyId: string }) => {
  const { error, result } = await unkey.keys.get({ keyId });

  return { error, result };
};

export const createAPIKey = async ({
  name,
  ownerId,
}: {
  name: string;
  ownerId: string;
}) => {
  try {
    const { result } = await unkey.keys.create({
      apiId,
      name,
      prefix: "req",
      ownerId,
      meta: {
        role: "user",
      },
    });

    return {
      result,
      error: null,
    };
  } catch (error) {
    return { result: null, error };
  }
};

export const getUserAPIKeys = async ({ ownerId }: { ownerId: string }) => {
  const { error, result } = await unkey.apis.listKeys({
    apiId,
    ownerId,
  });

  return { error, result };
};
