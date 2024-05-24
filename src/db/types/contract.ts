import { z } from "zod";
import { nullableSchema } from "@/utils/nullable";
import { UserSchema } from "./user";
import { ServiceSchema } from "./service";

export const ContractSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  user: z.lazy(() => UserSchema).optional().nullish(),
  services: z.lazy(() => z.array(ServiceSchema)).optional(),
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
