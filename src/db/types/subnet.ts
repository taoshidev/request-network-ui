import { z } from "zod";
import { nullableSchema } from "@/utils/nullable";
import { EndpointSchema } from "@/db/types/endpoint";

export const SubnetSchema = z.object({
  id: z.string().uuid(),
  netUid: z.number(),
  label: z.string(),
  endpoints: z.array(z.lazy(() => EndpointSchema)).optional(),
});

const NullableSubnetSchema = nullableSchema(SubnetSchema);

export type SubnetType = z.infer<typeof NullableSubnetSchema>;
