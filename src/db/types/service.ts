import { z } from "zod";
import { nullableSchema } from "@/utils/nullable";
import { ContractSchema } from "./contract";
import { UserSchema } from "./user";

export const ServiceSchema = z.object({
  id: z.string().uuid().optional(),
  userId: z.string().uuid(),
  user: z.lazy(() => UserSchema).optional().nullish(),
  contractId: z.string().uuid().optional(),
  contract: z.lazy(() => ContractSchema).optional(),
  name: z.string().min(1),
  price: z.string().min(1),
  currencyType: z.string().min(1),
  paymentType: z.string().min(1),
  tiers: z.any().optional(),
  limit: z.number().int().min(1),
  expires: z.date().optional(),
  refillInterval: z.number().int().min(1),
  remaining: z.number().int().min(1),
  active: z.boolean().optional(),
  createdAt: z.date().transform((arg) => new Date(arg)).optional(),
  updatedAt: z.date().transform((arg) => new Date(arg)).optional(),
  deletedAt: z
    .date()
    .optional()
    .nullable()
    .transform((arg) => (arg ? new Date(arg) : null)).optional(),
});

const NullableServiceSchema = nullableSchema(ServiceSchema);
export type ServiceType = z.infer<typeof NullableServiceSchema>;
