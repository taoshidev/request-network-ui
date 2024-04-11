import { z } from "zod";

export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  endpointId: z.string().uuid(),
  userId: z.string().uuid(),
  keyId: z.string().optional(),
  key: z.string().optional(),
  apiKey: z.string(),
  apiSecret: z.string(),
  consumerApiUrl: z.string().min(1, { message: "Domain is required" }).url({
    message: "Please enter a valid URL",
  }),
});

export type SubscriptionType = z.infer<typeof SubscriptionSchema>;
