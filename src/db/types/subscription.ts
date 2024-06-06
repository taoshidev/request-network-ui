import { z } from "zod";
import { nullableSchema } from "@/utils/nullable";
import { EndpointSchema } from "./endpoint";
import { UserSchema } from "./user";
import { ValidatorSchema } from "./validator";
import { ServiceSchema } from "./service";
import { ContractSchema } from "./contract";
import { SubnetSchema } from "./subnet";

export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  validatorId: z.string().uuid(),
  validator: z.lazy(() => ValidatorSchema).optional(),
  endpointId: z.string().uuid(),
  endpoint: z.lazy(() => EndpointSchema).optional(),
  subnetId: z.string().uuid(),
  subnet: z.lazy(() => SubnetSchema).optional(),
  userId: z.string().uuid(),
  user: z.lazy(() => UserSchema).optional(),
  keyId: z.string().optional(),
  key: z.string().optional(),
  apiKey: z.string(),
  reqKey: z.string(),
  serviceId: z.string().uuid().optional(),
  service: z.lazy(() => ServiceSchema).optional(),
  contractId: z.string().uuid().optional(),
  contract: z.lazy(() => ContractSchema).optional(),
  proxyServiceId: z.string().uuid().optional(),
  apiSecret: z.string(),
  appName: z.string().min(1, { message: "Application name is required" }),
  consumerWalletAddress: z.string().optional(),
  consumerApiUrl: z.string().min(1, { message: "Domain is required" }).url({
    message: "Please enter a valid URL",
  }),
  active: z.boolean().optional(),
  termsAccepted: z.boolean(),
  agreedToTOS: z.boolean(),
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

const NullableSubscriptionSchema = nullableSchema(SubscriptionSchema);
export type SubscriptionType = z.infer<typeof NullableSubscriptionSchema>;
