"use server";

import { revalidatePath } from "next/cache";
import { eq, asc, exists } from "drizzle-orm";
import { db } from "@/db";
import { validators } from "@/db/schema";
import { parseError, parseResult } from "@/db/error";
import { filterData } from "@/utils/sanitize";
import { createEndpoint } from "./endpoints";
import { createUnkeyApiKey, generateApiKey, generateApiSecret } from "./apis";
import { EndpointType } from "@/db/types/endpoint";
import { ValidatorType } from "@/db/types/validator";

export const getValidators = async (query: object = {}) => {
  try {
    const res = await db.query.validators.findMany(
      Object.assign(query, {
        orderBy: (validators, { asc }) => [asc(validators?.name)],
      })
    );
    return filterData(res, [""]);
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};

export const getValidator = async ({ id }: { id: string }) => {
  const res = await db.query.validators.findFirst({
    where: (validators, { eq }) => eq(validators.id, id as string),
  });
  if (!res) throw new Error(`Validator with ID ${id} not found.`);
  return filterData(res, ["hotkey"]);
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
) => {
  try {
    const res = await db.transaction(async (tx) => {
      const record = await createValidator(validator as ValidatorType);

      const { id, name } = record?.data[0];

      const newEndpoint = await createEndpoint({
        ...endpoint,
        validator: id,
      } as any);

      const key = await createUnkeyApiKey({ name });

      const newValidator = await updateValidator({
        id,
        apiId: key?.data?.apiId,
        apiKey: generateApiKey(),
        apiSecret: generateApiSecret(),
      });

      return {
        validator: newValidator?.data?.[0],
        endpoint: newEndpoint?.data?.[0],
      };
    });
    revalidatePath("/dashboard");
    return res;
  } catch (error) {
    if (error instanceof Error) return parseError(error);
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
