import { z } from "zod";

export const RefillSchema = z.object({
  interval: z.string(),
  amount: z.number(),
});

export const RateLimitSchema = z.object({
  type: z.string(),
  limit: z.number(),
  refillInterval: z.number(),
});

export const MetaSchema = z.object({
  shortId: z.string(),
  type: z.string(),
  consumerId: z.string(),
  endpointId: z.string(),
  endpoint: z.string(),
  validatorId: z.string(),
  subscription: z.object({}),
});

export const RoleSchema = z.object({
  roles: z.string(),
});

export const KeySchema = z.object({
  id: z.string().optional(),
  start: z.string(),
  apiId: z.string(),
  workspaceId: z.string(),
  name: z.string().optional(),
  ownerId: z.string().optional(),
  meta: MetaSchema,
  createdAt: z.date(),
  expires: z.date(),
  remaining: z.number(),
  refill: RefillSchema,
  ratelimit: RateLimitSchema,
  roles: z.array(RoleSchema),
  enabled: z.boolean().optional(),
});

export type KeyType = z.infer<typeof KeySchema>;
export type MetaType = z.infer<typeof MetaSchema>;
export type RefillType = z.infer<typeof RefillSchema>;
export type RateLimitType = z.infer<typeof RateLimitSchema>;
export type RoleType = z.infer<typeof RoleSchema>;
