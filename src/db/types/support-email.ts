import { z } from "zod";
import { nullableSchema } from "@/utils/nullable";
import { UserSchema } from "./user";

export const SupportEmailSchema = z.object({
  id: z.string().uuid().optional(),
  subject: z.string(),
  content: z.string(),
  fromUserId: z.string().uuid().optional(),
  fromUser: z.lazy(() => UserSchema).optional(),
  active: z.boolean().optional(),
  createdAt: z.date().transform((arg) => new Date(arg)).optional(),
  updatedAt: z.date().transform((arg) => new Date(arg)).optional(),
  deletedAt: z
    .date()
    .optional()
    .nullable()
    .transform((arg) => (arg ? new Date(arg) : null)).optional(),
});

const NullableSupportEmailSchema = nullableSchema(SupportEmailSchema);
export type SupportEmailType = z.infer<typeof NullableSupportEmailSchema>;