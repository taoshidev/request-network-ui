import { z } from "zod";
import { isAddress } from "@/utils/address";

export const ValidatorSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  description: z.string(),
  apiId: z.string().optional(),
  apiKey: z.string().optional(),
  apiSecret: z.string().optional(),
  hotkey: z
    .string()
    .min(1)
    .max(48)
    .refine((value) => isAddress({ address: value || '' }), {
      message: "Invalid Bittensor address",
    }),
  userId: z.string().uuid(),
  account: z.any().optional(),
  signature: z.string().optional(),
  vtrust: z.string().optional(),
  verified: z.boolean().optional(),
});

export type ValidatorType = z.infer<typeof ValidatorSchema>;
