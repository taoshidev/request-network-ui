import { z } from "zod";
import { nullableSchema } from "@/utils/nullable";
import { EndpointSchema } from "./endpoint";

export const SubnetSchema = z.object({
  id: z.string().uuid(),
  netUid: z.number(),
  label: z.string(),
  endpoints: z.array(EndpointSchema),
});

const NullableSubnetSchema = nullableSchema(SubnetSchema);

export type SubnetType = z.infer<typeof NullableSubnetSchema>;
