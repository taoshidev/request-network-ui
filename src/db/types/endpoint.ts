import { z } from "zod";
import { nullableSchema } from "@/utils/nullable";
import { isValidEthereumAddress } from "@/utils/address";
import { ValidatorSchema } from "./validator";
import { SubnetSchema } from "./subnet";
import { ContractSchema } from "./contract";
import { SubscriptionSchema } from "./subscription";

export const EndpointSchema = z.object({
  id: z.string().uuid().optional(),
  subnetId: z.string().uuid().optional(),
  subnet: SubnetSchema.optional().nullish(),
  validatorId: z.string().uuid().optional(),
  validator: ValidatorSchema.optional().nullish(),
  contractId: z.string().uuid().optional(),
  contract: ContractSchema.optional().nullish(),
  subscriptions: z.lazy(() => z.array(SubscriptionSchema)).optional(),
  price: z.string().min(1),
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
    }).optional().nullish(),
  limit: z.number().int().min(1),
  url: z.string().regex(/^\/[\w-]+(\/[\w-]+)*$/, {
    message: "Invalid endpoint path format",
  }),
  enabled: z.boolean().optional(),
  expires: z.date(),
  refillRate: z.number().int().min(1),
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

const NullableEndpointSchema = nullableSchema(EndpointSchema);
export type EndpointType = z.infer<typeof NullableEndpointSchema>;
