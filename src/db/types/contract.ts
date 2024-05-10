import { z } from "zod";
import { nullableSchema } from "@/utils/nullable";

export const ContractSchema = z.object({
  id: z.string().uuid(),
  validatorId: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  active: z.boolean(),
  createdAt: z.string().transform((arg) => new Date(arg)),
  updatedAt: z.string().transform((arg) => new Date(arg)),
  deletedAt: z
    .string()
    .optional()
    .nullable()
    .transform((arg) => (arg ? new Date(arg) : null)),
});

const NullableContractSchema = nullableSchema(ContractSchema);
export type ContractType = z.infer<typeof NullableContractSchema>;
