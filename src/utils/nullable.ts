import { z } from "zod";

export function nullableSchema<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>
): z.ZodObject<{ [K in keyof T]: z.ZodNullable<T[K]> }> {
  const newShape: any = {};
  Object.keys(schema.shape).forEach((key) => {
    const originalField = schema.shape[key as keyof T];
    newShape[key] = originalField.nullable();
  });
  return z.object(newShape) as z.ZodObject<{
    [K in keyof T]: z.ZodNullable<T[K]>;
  }>;
}
