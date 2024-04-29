import { z } from "zod";
import { isAddress } from "@/utils/address";
import { nullableSchema } from "@/utils/nullable";
import { StatsSchema } from "./stat";

const getValidatorSchema = () => {
  const { EndpointSchema } = require("./endpoint");

  return z.object({
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
      .refine((value) => isAddress({ address: value || "" }), {
        message: "Invalid Bittensor address",
      }),
    userId: z.string().uuid(),
    account: z.any().optional(),
    signature: z.string().optional(),
    vtrust: z.string().optional(),
    verified: z.boolean().optional(),
    // endpoints: z.array(EndpointSchema),
    endpoints: z.lazy(() => z.array(EndpointSchema)),
    stats: StatsSchema,
  });
};

export const ValidatorSchema = getValidatorSchema();
const NullableValidatorSchema = nullableSchema(ValidatorSchema);
export type ValidatorType = z.infer<typeof NullableValidatorSchema>;
