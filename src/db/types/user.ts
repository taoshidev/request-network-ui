import { z } from "zod";
import { nullableSchema } from "@/utils/nullable";

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

const NullableUserSchema = nullableSchema(UserSchema);
export type UserType = z.infer<typeof NullableUserSchema>;
