"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { parseError, parseResult } from "@/db/error";
import { filterData } from "@/utils/sanitize";
import { services } from "@/db/schema";
import { ServiceType } from "@/db/types/service";

export const getServices = async (query: object = {}) => {
  try {
    const res = await db.query.services.findMany(
      Object.assign(query, {
        orderBy: (services, { asc }) => [asc(services?.name)],
      })
    );
    return filterData(res, [""]);
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};

export const getService = async ({ id }: { id: string }) => {
  const res = await db.query.services.findFirst({
    where: (services, { eq }) => eq(services.id, id as string),
  });
  if (!res) throw new Error(`Service with ID ${id} not found.`);
  return filterData(res, [""]);
};

export const updateService = async ({
  id,
  ...values
}: Partial<ServiceType>) => {
  try {
    const res = await db
      .update(services)
      .set({ ...values } as any)
      .where(eq(services.id, id as string))
      .returning();

    // revalidatePath(`/service/${id}`);
    return parseResult(res);
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};

export const createService = async (service: ServiceType) => {
  try {
    const res = await db
      .insert(services)
      .values(service as any)
      .returning();

    revalidatePath("/dashboard");
    return parseResult(res);
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};

export const deleteService = async (service: ServiceType) => {
  try {
    // check if can delete
    // const check = await canDelete(contract);
    // if (!check) {
    //   return parseError({
    //     code: 401,
    //     message:
    //       "Contract cannot be deleted because there are active subscriptions.",
    //   });
    // }

    const res = await db
      .delete(services)
      .where(eq(services.id, service.id as string))
      .returning();

    return parseResult(res);
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};
