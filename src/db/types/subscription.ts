import { z } from "zod";
import { nullableSchema } from "@/utils/nullable";
import { EndpointSchema } from "./endpoint";

export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  endpointId: z.string().uuid(),
  endpoint: z.lazy(() => EndpointSchema).optional(),
  userId: z.string().uuid(),
  keyId: z.string().optional(),
  key: z.string().optional(),
  apiKey: z.string(),
  serviceId: z.string().optional(),
  apiSecret: z.string(),
  appName: z.string().min(1, { message: "Application name is required" }),
  consumerWalletAddress: z.string().optional(),
  consumerApiUrl: z.string().min(1, { message: "Domain is required" }).url({
    message: "Please enter a valid URL",
  }),
  active: z.boolean().optional(),
  termsAccepted: z.boolean(),
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
