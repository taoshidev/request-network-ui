import { z } from "zod";
import { nullableSchema } from "@/utils/nullable";

export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  endpointId: z.string().uuid(),
  userId: z.string().uuid(),
  keyId: z.string().optional(),
  key: z.string().optional(),
  apiKey: z.string(),
  apiSecret: z.string(),
  escrowPublicKey: z.string(),
  appName: z.string().min(1, { message: "Application name is required" }),
  consumerApiUrl: z.string().min(1, { message: "Domain is required" }).url({
    message: "Please enter a valid URL",
  }),
});

const NullableSubscriptionSchema = nullableSchema(SubscriptionSchema);
export type SubscriptionType = z.infer<typeof NullableSubscriptionSchema>;
