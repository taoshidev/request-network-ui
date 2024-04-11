import { z } from "zod";

export const SubscriptionSchema = z.object({
  id: z.string().uuid(),
  endpointId: z.string().uuid(),
  userId: z.string().uuid(),
  keyId: z.string().optional(),
  key: z.string().optional(),
  apiKey: z.string(),
  apiSecret: z.string()
});

export type SubscriptionType = z.infer<typeof SubscriptionSchema>;
