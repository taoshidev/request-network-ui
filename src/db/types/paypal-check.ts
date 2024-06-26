import { z } from "zod";
import { nullableSchema } from "@/utils/nullable";

export const PayPalCheckSchema = z.object({
  isHttps: z.boolean(),
  payPalSecretKey: z.boolean(),
  payPalClientId: z.boolean(),
  enrollmentSecret: z.boolean(),
  payPalWebhooksKey: z.boolean(),
  newEndpointCreated: z.boolean(),
  webhooks: z.boolean(),
  webhookEvents: z.boolean(),
  rnUrl: z.string(),
  error: z.any()
});

const NullablePayPalCheckSchema = nullableSchema(PayPalCheckSchema);
export type PayPalCheckType = z.infer<typeof NullablePayPalCheckSchema>;