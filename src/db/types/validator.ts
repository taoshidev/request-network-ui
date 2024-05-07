import { z } from "zod";
import { isAddress } from "@/utils/address";
import { nullableSchema } from "@/utils/nullable";
import { StatsSchema } from "./stat";
import { EndpointSchema } from "./endpoint";

export const ValidatorSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1).optional(),
  description: z.string().nullish(),
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
    }),
  userId: z.string().uuid().nullish(),
  account: z.any().optional(),
  signature: z.string().optional(),
  vtrust: z.string().optional(),
  verified: z.boolean().optional(),
  endpoints: z.lazy(() => z.array(EndpointSchema)).optional(),
  stats: StatsSchema.optional(),
});

const NullableValidatorSchema = nullableSchema(ValidatorSchema);
export type ValidatorType = z.infer<typeof NullableValidatorSchema>;
