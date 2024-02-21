import { z } from "zod";

export const EndpointsSchema = z.object({
  url: z.string().url({ message: "Endpoint must be a valid URL" }),
  limit: z.number().int().min(1),
  refillRate: z.number().int().min(1),
  refillInterval: z.number().int().min(1),
  remaining: z.number().int().min(1),
  expires: z.date(),
});

export type EndpointType = z.infer<typeof EndpointsSchema>;
