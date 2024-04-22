"use server";

import { Unkey } from "@unkey/api";
const unkey = new Unkey({ rootKey: process.env.UNKEY_ROOT_KEY as string });

export const updateKey = async ({
  keyId,
  ...params
}: {
  keyId: string;
  params: object;
}) => {
  try {
    await unkey.keys.update({
      keyId,
      ...params,
    });
  } catch (error) {
    console.error(error);
  }
};

export const deleteKey = async ({ keyId }: { keyId: string }) => {
  try {
    await unkey.keys.delete({ keyId });
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
    return { result: null, error };
  }
};

export const getUserAPIKeys = async ({
  apiId,
  ownerId,
}: {
  apiId: string;
  ownerId: string;
}) => {
  ownerId,)
  const { error, result } = await unkey.apis.listKeys({
    apiId,
    ownerId,
  });

  return { error, result };
};
