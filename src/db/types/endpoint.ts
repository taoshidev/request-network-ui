import { z } from "zod";
import { nullableSchema } from "@/utils/nullable";
import { ValidatorSchema } from "./validator";

export const EndpointSchema = z.object({
  id: z.string().uuid().optional(),
  subnet: z.string().uuid().optional(),
  validator: z.string().uuid().optional(),
  validators: z.array(ValidatorSchema).optional(),
  price: z.string(),
  limit: z.number().int().min(1),
  url: z
    .string()
    .regex(/^\/[\w-]+(\/[\w-]+)*$/, {
      message: "Invalid endpoint path format",
    }),
  enabled: z.boolean().optional(),
  expires: z.date(),
  refillRate: z.number().int().min(1),
  refillInterval: z.number().int().min(1),
  remaining: z.number().int().min(1),
});

const NullableEndpointSchema = nullableSchema(EndpointSchema);
export type EndpointType = z.infer<typeof NullableEndpointSchema>;;
