import { z } from "zod";
import { nullableSchema } from "@/utils/nullable";
import { UserSchema } from "./user";
export const ContractSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  user: UserSchema.optional().nullish(),
  title: z.string().min(8, { message: "Title must be at least 8 characters" }),
  content: z
    .string()
    .min(256, { message: "Content must be at least 256 characters" }),
  active: z.boolean().optional(),
  createdAt: z.date().transform((arg) => new Date(arg)).optional(),
  updatedAt: z.date().transform((arg) => new Date(arg)).optional(),
  deletedAt: z
    .date()
    .optional()
    .nullable()
    .transform((arg) => (arg ? new Date(arg) : null)).optional(),
});

const NullableContractSchema = nullableSchema(ContractSchema);
export type ContractType = z.infer<typeof NullableContractSchema>;
