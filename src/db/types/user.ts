import { z } from "zod";

export const UserSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(["consumer", "validator"]),
  email: z.string().email().optional(),
  fullname: z.string().optional(),
  username: z.string().optional(),
  phone: z.string().optional(),
  onboarded: z.boolean(),
  onboardingStep: z.number().int(),
});

export type UserType = z.infer<typeof UserSchema>;
