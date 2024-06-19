"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { validators } from "@/db/schema";
import { parseError, parseResult } from "@/db/error";
import { filterData } from "@/utils/sanitize";
import { createEndpoint } from "./endpoints";
import { createUnkeyApiKey, generateApiKey, generateApiSecret } from "./apis";
import { EndpointType } from "@/db/types/endpoint";
import { ValidatorType } from "@/db/types/validator";
import { DatabaseResponseType } from "@/db/error";

export const getValidators = async (
  query: object = {},
  options: { withStatus?: boolean } = {}
) => {
  try {
    const res = await db.query.validators.findMany(
      Object.assign(query, {
        orderBy: (validators, { asc }) => [asc(validators?.name)],
      })
    );

    const validators = filterData(res, [""]);

    if (!validators.error && options.withStatus) {
      const healthReq = validators.map(async (validator) => {
        try {
          return await fetch(`${validator.baseApiUrl}/health`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          return Promise.resolve({
            message: "Server offline",
            uptime: 0,
            date: null,
          });
        }
      });

      const healthRes = await Promise.all(healthReq);

      for (const [index, validator] of validators.entries()) {
        validator.health = healthRes[index].json ? await healthRes[index].json() : healthRes[index];
        console.log(validator.health);
      }
    }

    return validators;
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};

export const getValidator = async ({ id }: { id: string }) => {
  const res = await db.query.validators.findFirst({
    where: (validators, { eq }) => eq(validators.id, id as string),
  });
  if (!res) throw new Error(`Validator with ID ${id} not found.`);
  return res;
};

export const updateValidator = async ({
  id,
  ...values
}: Partial<ValidatorType>) => {
  try {
    const res = await db
      .update(validators)
      .set({ ...values } as any)
      .where(eq(validators.id, id as string))
      .returning();

    revalidatePath(`/validators/${id}`);
    return parseResult(res, { filter: ["hotkey"] });
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};

export const createValidator = async (validator: ValidatorType) => {
  try {
    const res = await db
      .insert(validators)
      .values(validator as any)
      .returning();

    revalidatePath("/dashboard");
    return parseResult(res, { filter: ["hotkey"] });
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};

export const createValidatorEndpoint = async (
  validator: Partial<ValidatorType>,
  endpoint: Partial<EndpointType>
): Promise<
  { validator: ValidatorType; endpoint: EndpointType } | DatabaseResponseType
> => {
  try {
    const res = await db.transaction(async (tx) => {
      const record = await createValidator(validator as ValidatorType);

      if (record?.error) {
        throw new Error(`Failed to create validator: ${record?.message}`);
      }

      const { id, name } = record?.data[0];

      const newEndpoint = await createEndpoint({
        ...endpoint,
        validatorId: id,
      } as any);

      if (newEndpoint?.error) {
        throw new Error(`Failed to create endpoint: ${newEndpoint?.message}`);
      }

      const key = await createUnkeyApiKey({ name });
      if (key?.error) {
        throw new Error(`Failed to create API key: ${key?.error}`);
      }

      const newValidator = await updateValidator({
        id,
        apiId: key?.data?.apiId,
        apiKey: generateApiKey(),
        apiSecret: generateApiSecret(),
      });
      if (newValidator?.error) {
        throw new Error(`Failed to update validator: ${newValidator?.message}`);
      }

      return {
        validator: newValidator?.data?.[0],
        endpoint: newEndpoint?.data?.[0],
      };
    });
    revalidatePath("/dashboard");

    return res;
  } catch (error) {
    return {
      error: true,
      message: (error as Error)?.message,
    };
  }
};

export const checkHotkeyExists = async (hotkey: string) => {
  try {
    const res = await db
      .select()
      .from(validators)
      .where(eq(validators.hotkey, hotkey));
    return res?.length > 0;
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};

export const checkValidatorWalletAddressExists = async (address: string) => {
  try {
    const res = await db
      .select()
      .from(validators)
      .where(eq(validators?.walletAddress, address));
    return res?.length > 0;
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};

/**
 * Check if a property exists in the validators table.
 * @param prop - The property to check. Example: { walletAddress: 'value' }
 * @returns True if the property exists, false otherwise.
 */
export const checkPropExists = async (prop: { [key: string]: any }) => {
  try {
    const key = Object.keys(prop)[0];
    const value = prop[key];

    const res = await db
      .select()
      .from(validators)
      .where(eq(validators[key], value));

    return res.length > 0;
  } catch (error) {
    if (error instanceof Error) {
      return parseError(error);
    }
    throw error;
  }
};
