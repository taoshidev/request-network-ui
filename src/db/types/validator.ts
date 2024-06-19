import { z } from "zod";
import { isAddress } from "@/utils/address";
import { nullableSchema } from "@/utils/nullable";
import { StatsSchema } from "./stat";
import { EndpointSchema } from "./endpoint";
import { SubscriptionSchema } from "./subscription";
import { isValidEthereumAddress } from "@/utils/address";

export const ValidatorSchema = z.object({
  id: z.string().uuid().optional(),
  bittensorUid: z.number().optional().nullish(),
  bittensorNetUid: z.number().optional().nullish(),
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
  walletAddress: z
    .string()
    .min(42, {
      message:
        "Wallet address must be at least 42 characters long including the '0x' prefix",
    })
    .max(42, {
      message:
        "Wallet address must be no more than 42 characters long including the '0x' prefix",
    })
    .refine(isValidEthereumAddress, {
      message: "Please enter a valid Ethereum wallet address",
    })
    .optional()
    .nullish(),
  userId: z.string().uuid().nullish(),
  account: z.any().optional(),
  signature: z.string().optional(),
  verified: z.boolean().optional(),
  endpoints: z.lazy(() => z.array(EndpointSchema)).optional(),
  subscriptions: z.lazy(() => z.array(SubscriptionSchema)).optional(),
  stats: StatsSchema.optional(),
  stripeEnabled: z.boolean().default(false).optional(),
  stripeLiveMode:  z.boolean().default(false).optional(),
  agreedToTOS: z.boolean(),
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

export type ValidatorWithInfo = ValidatorType & {
  neuronInfo: any;
  health: { uptime: number; message: string };
};
