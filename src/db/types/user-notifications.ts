import { nullableSchema } from "@/utils/nullable";
import { z } from "zod";
import { UserSchema } from "./user";
import { NotificationSchema } from "./notification";

export const UserNotificationSchema = z.object({
  id: z.string().uuid().optional(),
  notificationId: z.string().uuid().optional(),
  notification: z.lazy(() => NotificationSchema).optional(),
  userId: z.string().uuid().optional(),
  user: z.lazy(() => UserSchema).optional(),
  viewed: z.boolean().default(false).optional(),
  active: z.boolean().optional(),
  createdAt: z.date().transform((arg) => new Date(arg)).optional(),
  updatedAt: z.date().transform((arg) => new Date(arg)).optional(),
  deletedAt: z
    .date()
    .optional()
    .nullable()
    .transform((arg) => (arg ? new Date(arg) : null)).optional(),
});

const NullableUserNotificationSchema = nullableSchema(UserNotificationSchema);
export type UserNotificationType = z.infer<typeof NullableUserNotificationSchema>;
