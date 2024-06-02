import { nullableSchema } from "@/utils/nullable";
import { z } from "zod";
import { UserSchema } from "./user";
import { UserNotificationSchema } from "./user-notifications";

export const NotificationSchema = z.object({
  id: z.string().uuid().optional(),
  fromUserId: z.string().uuid().optional(),
  fromUser: z.lazy(() => UserSchema).optional(),
  userNotifications: z.lazy(() => z.array(UserNotificationSchema)).optional(),
  subject: z.string().min(1),
  content: z.string().min(1),
  type: z.enum(['success', 'info', 'warning', 'danger', 'bug']),
  active: z.boolean().optional(),
  createdAt: z.date().transform((arg) => new Date(arg)).optional(),
  updatedAt: z.date().transform((arg) => new Date(arg)).optional(),
  deletedAt: z
    .date()
    .optional()
    .nullable()
    .transform((arg) => (arg ? new Date(arg) : null)).optional(),
});

const NullableNotificationSchema = nullableSchema(NotificationSchema);
export type NotificationType = z.infer<typeof NullableNotificationSchema>;
