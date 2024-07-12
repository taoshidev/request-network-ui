import { nullableSchema } from "@/utils/nullable";
import { z } from "zod";

export const TransactionSchema = z.object({
  id: z.string().uuid().optional(),
  serviceId: z.string().uuid(),
  transactionType: z.string(),
  walletAddress: z.string(),
  transactionHash: z.string(),
  fromAddress: z.string(),
  toAddress: z.string(),
  amount: z.number(),
  blockNumber: z.number(),
  confirmed: z.boolean(),
  tokenAddress: z.string(),
  meta: z.object({
    receipt_url: z.string(),
    hosted_invoice_url: z.string(),
    invoice_pdf: z.string(),
  }),
  active: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date(),
});

const NullableTransactionSchema = nullableSchema(TransactionSchema);
export type TransactionType = z.infer<typeof NullableTransactionSchema>;