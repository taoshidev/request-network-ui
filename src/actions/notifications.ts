"use server";

import { sendEmail } from "./email"
import { parseError, parseResult } from "@/db/error";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { userNotifications, notifications } from "@/db/schema";
import { NotificationType } from "@/db/types/notification";
import { UserType } from "@/db/types/user";
import { filterData } from "@/utils/sanitize";
import { eq } from "drizzle-orm";
import { omit as _omit } from 'lodash';
import { getAuthUser } from "./auth";

export const sendNotification = async (notification: NotificationType, options: { email: boolean } = { email: true }) => {
  try {
    if (notification?.userNotifications?.length) {
      const res = await db
          .insert(notifications)
          .values(_omit(notification , ['fromUser']) as any)
          .returning();
        revalidatePath("/dashboard");
    
        const newNotification = res?.[0];
        if (newNotification?.id) {
          for (let user of (notification.userNotifications as any[] || [])) {
            await db
            .insert(userNotifications)
            .values({
              notificationId: newNotification?.id as string,
              userId: user.id
            });
          }
        }
    
        if (options.email) {
          const toEmails = ((notification.userNotifications as any)?.map((u: UserType) => u.email) || []).join();
          const to = (notification.userNotifications || []).length > 1 ? notification.fromUser : toEmails;
          const bcc = (notification.userNotifications || []).length > 1 ? toEmails : undefined;

          sendEmail({
            reply: notification.fromUser,
            to,
            bcc,
            template: "notification",
            subject: notification.subject as string,
            templateVariables: {
              title: notification.subject,
              content: notification.content
            }
          });  
        }
      
        return parseResult(res);
    }
    return null;
  } catch (error) {
    return parseError(error);
  }
};

export const getUserNotifications = async () => {
  try {
    const user = await getAuthUser();
    if (user?.id) {
      const res = await db.query.userNotifications.findMany(
          {
            columns: {
              id: true,
              notificationId: true,
              userId: true,
              viewed: true
            },
            with: {
              notification: true
            },
            where: eq(userNotifications.userId, user.id),
            orderBy: (notifications, { desc }) => [desc(notifications?.createdAt)],
          });
        return filterData(res, [""]);
    }
    } catch (error) {
      if (error instanceof Error) return parseError(error);
    }
};

export const getNotifications = async (query: object = {}) => {
  try {
      const res = await db.query.notifications.findMany(
        Object.assign({}, { orderBy: (notifications, { desc }) => [desc(notifications?.createdAt)]}, query));
      return filterData(res, [""]);
    } catch (error) {
      if (error instanceof Error) return parseError(error);
    }
};