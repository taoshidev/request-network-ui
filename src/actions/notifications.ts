"use server";

import { sendEmail } from "./email";
import { parseError, parseResult } from "@/db/error";
import { db } from "@/db";
import { userNotifications, notifications } from "@/db/schema";
import { NotificationType } from "@/db/types/notification";
import { UserType } from "@/db/types/user";
import { filterData } from "@/utils/sanitize";
import { and, eq, isNull } from "drizzle-orm";
import { omit as _omit } from "lodash";
import { getAuthUser } from "./auth";
import { UserNotificationType } from "@/db/types/user-notifications";

export const sendNotification = async (
  notification: NotificationType,
  options: { email: boolean } = { email: true }
) => {
  try {
    if (notification?.userNotifications?.length) {
      const res = await db
        .insert(notifications)
        .values(_omit(notification, ["fromUser"]) as any)
        .returning();

      const newNotification = res?.[0];
      if (newNotification?.id) {
        for (let user of (notification.userNotifications as any[]) || []) {
          await db.insert(userNotifications).values({
            notificationId: newNotification?.id as string,
            userId: user.id,
          });
        }
      }

      if (options.email) {
        const toEmails = (
          (notification.userNotifications as any)?.map(
            (u: UserType) => u.email
          ) || []
        ).join();
        const to =
          (notification.userNotifications || []).length > 1
            ? notification.fromUser
            : toEmails;
        const bcc =
          (notification.userNotifications || []).length > 1
            ? toEmails
            : undefined;

        sendEmail({
          reply: notification.fromUser,
          to,
          bcc,
          template: "notification",
          subject: notification.subject as string,
          templateVariables: {
            title: notification.subject,
            content: notification.content,
          },
        });
      }

      return parseResult(res);
    }
    return null;
  } catch (error) {
    return parseError(error);
  }
};

export const updateUserNotification = async ({
  id,
  ...values
}: Partial<UserNotificationType>) => {
  try {
    const res = await db
      .update(userNotifications)
      .set({ ...values } as any)
      .where(eq(userNotifications.id, id as string))
      .returning();

    return parseResult(res, { filter: [""] });
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};

export const deleteUserNotification = async (id: string) => {
  try {
    const res = await db
      .update(userNotifications)
      .set({ deletedAt: new Date() } as any)
      .where(eq(userNotifications.id, id as string))
      .returning();

    return parseResult(res, { filter: [""] });
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};

export const getUserNotifications = async (params?: any) => {
  try {
    const user = await getAuthUser();
    if (user?.id) {
      const query: any = {
        columns: {
          id: true,
          notificationId: true,
          userId: true,
          viewed: true,
        },
        with: {
          notification: true,
        },
        where: and(
          eq(userNotifications.userId, user.id),
          isNull(userNotifications.deletedAt)
        ),
        orderBy: (notifications, { desc }) => [desc(notifications?.createdAt)],
      };

      if (params?.limit) query.limit = params.limit;
      if (params.where) query.where = params.where;

      const res = await db.query.userNotifications.findMany(query);
      return filterData(res, [""]);
    }
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};

export const getNotifications = async (query: object = {}) => {
  try {
    const res = await db.query.notifications.findMany(
      Object.assign(
        {},
        {
          orderBy: (notifications, { desc }) => [
            desc(notifications?.createdAt),
          ],
        },
        query
      )
    );
    return filterData(res, [""]);
  } catch (error) {
    if (error instanceof Error) return parseError(error);
  }
};
