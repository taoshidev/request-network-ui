import { z } from "zod";
import { isAddress } from "@/utils/address";
import { nullableSchema } from "@/utils/nullable";
import { StatsSchema } from "./stat";
import { EndpointSchema } from "./endpoint";

export const ValidatorSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).optional(),
  description: z
    .string()
    .min(42, {
      message: "Description must be at least 42 characters long",
    })
    .nullish(),
  baseApiUrl: z.string().url().optional(),
  apiId: z.string().optional(),
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  apiPrefix: z.string().nullish(),
  hotkey: z
    .string()
    .min(1)
    .max(48)
    .refine((value) => isAddress({ address: value || "" }), {
      message: "Invalid Bittensor address",
    })
    .nullish(),
  userId: z.string().uuid().nullish(),
  account: z.any().optional(),
  signature: z.string().optional(),
  verified: z.boolean().optional(),
  endpoints: z.lazy(() => z.array(EndpointSchema)).optional(),
  stats: StatsSchema.optional(),
  active: z.boolean().optional(),
  createdAt: z
    .date()
    .transform((arg) => new Date(arg))
    .optional(),
  updatedAt: z
    .date()
    .transform((arg) => new Date(arg))
    .optional(),
  deletedAt: z
    .date()
    .optional()
    .nullable()
    .transform((arg) => (arg ? new Date(arg) : null))
    .optional(),
});

const NullableValidatorSchema = nullableSchema(ValidatorSchema);
export type ValidatorType = z.infer<typeof NullableValidatorSchema>;
