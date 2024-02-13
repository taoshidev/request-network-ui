"use server";

import { Unkey } from "@unkey/api";

import { db } from "@/db";

const unkey = new Unkey({ rootKey: process.env.UNKEY_ROOT_KEY as string });
const apiId = process.env.UNKEY_API_KEY as string;

export const updateKey = async ({
  keyId,
  name,
}: {
  keyId: string;
  name: string;
}) => {
  try {
    await unkey.keys.update({
      keyId,
      name,
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

export const createKey = async (params: any) => {
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

export const getUserAPIKeys = async ({ ownerId }: { ownerId: string }) => {
  const { error, result } = await unkey.apis.listKeys({
    apiId,
    ownerId,
  });

  return { error, result };
};
