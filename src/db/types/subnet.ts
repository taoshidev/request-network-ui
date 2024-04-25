import { z } from "zod";

export const SubnetSchema = z.object({
  id: z.string().uuid(),
  netUid: z.number(),
  label: z.string(),
});

export type SubnetType = z.infer<typeof SubnetSchema>;
