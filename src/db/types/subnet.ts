import { z } from "zod";
import { nullableSchema } from "@/utils/nullable";
import { EndpointSchema } from "@/db/types/endpoint";
import { SubscriptionSchema } from "./subscription";

export const SubnetSchema = z.object({
  id: z.string().uuid(),
  netUid: z.number(),
  label: z.string(),
  endpoints: z.array(z.lazy(() => EndpointSchema)).optional(),
  subscriptions: z.array(z.lazy(() => SubscriptionSchema)).optional(),
  active: z.boolean().optional(),
  createdAt: z.date().transform((arg) => new Date(arg)).optional(),
  updatedAt: z.date().transform((arg) => new Date(arg)).optional(),
  deletedAt: z
    .date()
    .optional()
    .nullable()
    .transform((arg) => (arg ? new Date(arg) : null)).optional(),
});

const NullableSubnetSchema = nullableSchema(SubnetSchema);

export type SubnetType = z.infer<typeof NullableSubnetSchema>;
