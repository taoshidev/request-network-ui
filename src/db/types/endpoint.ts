import { z } from "zod";
import { nullableSchema } from "@/utils/nullable";
// import { isValidEthereumAddress } from "@/utils/address";
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
  percentRealtime: z.number().min(0).max(100),
  url: z.string().regex(/^\/[\w-]+(\/[\w-]+)*$/, {
    message: "Invalid endpoint path format",
  }),
  enabled: z.boolean().optional(),
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
