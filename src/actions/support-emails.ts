"use server";

import { sendEmail } from "./email";
import { parseError, parseResult } from "@/db/error";
import { db } from "@/db";
import { userNotifications, notifications } from "@/db/schema";
import { SupportEmailType } from "@/db/types/support-email";
import { UserType } from "@/db/types/user";
import { filterData } from "@/utils/sanitize";
import { and, eq, isNull } from "drizzle-orm";
import { omit as _omit } from "lodash";
import { getAuthUser } from "./auth";
import { UserNotificationType } from "@/db/types/user-notifications";
import { notifyHTML, notifyText } from "@/templates/notification";
import { randomBytes } from "crypto";
import { emailImg } from "@/templates/email-image";

export const sendSupportEmail = async (
  supportEmail: SupportEmailType,
  user: UserType
) => {
  try {
    const res = await db
      .insert(supportEmails)
      .returning();

    const newNotification = res?.[0];

    const to = 'support@taoshi.io';
    const from = user.email;

    const attachments = [
      {
        filename: "request-network.png",
        path: emailImg(),
        cid: `${randomBytes(10).toString("hex")}-request-network.png`, //same cid value as in the html img src
      },
    ];

    sendEmail({
      reply: from,
      to,
      html: notifyHTML({
        title: supportEmail.subject,
        content: supportEmail.content,
        attachments,
      }),
      text: notifyText({
        title: supportEmail.subject,
        content: supportEmail.content,
      }),
      attachments,
      subject: supportEmail.subject as string,
    });

    sendEmail({
      reply: to,
      to: from,
      html: notifyHTML({
        title: `Support Email: ${supportEmail.subject}`,
        content: `The following is your support email.\r\n\r\n${supportEmail.content}`,
        attachments,
      }),
      text: notifyText({
        title: `Support Email: ${supportEmail.subject}`,
        content: `The following is your support email.\r\n\r\n${supportEmail.content}`,
      }),
      attachments,
      subject: supportEmail.subject as string,
    });

    return parseResult(res);
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
      if (params?.where) query.where = params.where;

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
