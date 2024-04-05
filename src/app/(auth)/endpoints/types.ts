import { z } from "zod";

export const EndpointsSchema = z.object({
  id: z.string().uuid().optional(),
  subnet: z.string().uuid(),
  validator: z.string().uuid(),
  limit: z.number().int().min(1),
  url: z.string().url({ message: "Endpoint must be a valid URL" }),
  refillRate: z.number().int().min(1),
  refillInterval: z.number().int().min(1),
  remaining: z.number().int().min(1),
  expires: z.date().optional(),
  enabled: z.boolean(),
});

export type EndpointType = z.infer<typeof EndpointsSchema>;
