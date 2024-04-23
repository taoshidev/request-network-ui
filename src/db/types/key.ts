import { z } from "zod";

export const Refill = z.object({
  interval: z.string(),
  amount: z.number(),
});

export const RateLimit = z.object({
  type: z.string(),
  limit: z.number(),
  refillRate: z.number(),
  refillInterval: z.number(),
});

export const Meta = z.object({
  shortId: z.string(),
  type: z.string(),
  consumerId: z.string(),
  endpointId: z.string(),
  endpoint: z.string(),
  validatorId: z.string(),
  subscription: z.object({}),
});

export const Role = z.object({
  roles: z.string(),
});

export const Key = z.object({
  id: z.string().optional(),
  start: z.string(),
  apiId: z.string(),
  workspaceId: z.string(),
  name: z.string().optional(),
  ownerId: z.string().optional(),
  meta: Meta,
  createdAt: z.date(),
  expires: z.date(),
  remaining: z.number(),
  refill: Refill,
  ratelimit: RateLimit,
  roles: z.array(Role),
  enabled: z.boolean().optional(),
});

export type KeyType = z.infer<typeof Key>;
export type MetaType = z.infer<typeof Meta>;
export type RefillType = z.infer<typeof Refill>;
export type RateLimitType = z.infer<typeof RateLimit>;
export type RoleType = z.infer<typeof Role>;
