import { z } from "zod";
import { nullableSchema } from "@/utils/nullable";

export const StripeCheckSchema = z.object({
  isHttps: z.boolean(),
  stripeKey: z.boolean(),
  stripePublicKey: z.boolean(),
  enrollmentSecret: z.boolean(),
  stripeWebhooksKey: z.boolean(),
  newEndpointCreated: z.boolean(),
  webhooks: z.boolean(),
  webhookEvents: z.boolean(),
  rnUrl: z.string(),
  stripeLiveMode: z.boolean(),
  error: z.any()
});

const NullableStripeCheckSchema = nullableSchema(StripeCheckSchema);
export type StripeCheckType = z.infer<typeof NullableStripeCheckSchema>;
