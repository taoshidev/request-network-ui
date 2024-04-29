import { z } from "zod";
import { isAddress } from "@/utils/address";
import { EndpointSchema } from "./endpoint";
import { nullableSchema } from "@/utils/nullable";

export const ValidatorSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string(),
  baseApiUrl: z.string().url(),
  apiId: z.string().optional(),
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  hotkey: z
    .string()
    .min(1)
    .max(48)
    .refine((value) => isAddress({ address: value || '' }), {
      message: "Invalid Bittensor address",
    }),
  userId: z.string().uuid(),
  account: z.any().optional(),
  signature: z.string().optional(),
  vtrust: z.string().optional(),
  verified: z.boolean().optional(),
  endpoints: z.array(EndpointSchema)
});

const NullableValidatorSchema = nullableSchema(ValidatorSchema);
export type ValidatorType = z.infer<typeof NullableValidatorSchema>;
