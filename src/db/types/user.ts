import { z } from "zod";
import { nullableSchema } from "@/utils/nullable";
import { ContractSchema } from "./contract";
import { UserNotificationSchema } from "./user-notifications";

export const UserSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(["consumer", "validator"]),
  email: z.string().email().optional(),
  fullname: z.string().optional(),
  username: z.string().optional(),
  phone: z.string().optional(),
  onboarded: z.boolean(),
  onboardingStep: z.number().int(),
  agreedToTOS: z.boolean(),
  contracts: z.lazy(() => z.array(ContractSchema)).optional(),
  userNotification: z.lazy(() => z.array(UserNotificationSchema)).optional(),
  stripeEnabled: z.boolean().optional(),
  cryptoEnabled: z.boolean().optional(),
});

const NullableUserSchema = nullableSchema(UserSchema);
export type UserType = z.infer<typeof NullableUserSchema>;
