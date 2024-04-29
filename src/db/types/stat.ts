import { z } from "zod";

export const StatsSchema = z.object({
  incentive: z.number().optional(),
  rank: z.number().optional(),
  consensus: z.number().optional(),
  dividends: z.number().optional(),
  emission: z.number().optional(),
  validator_trust: z.number().optional(),
  trust: z.number().optional(),
  last_updated: z.date(),
  active: z.boolean().optional(),
});

export type StatsType = z.infer<typeof StatsSchema>;
