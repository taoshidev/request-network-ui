"use server";

import { sendEmail } from "./email";
import { parseError, parseResult } from "@/db/error";
import { db } from "@/db";
import { SupportEmailType } from "@/db/types/support-email";
import { UserType } from "@/db/types/user";
import { omit as _omit } from "lodash";
import { notifyHTML, notifyText } from "@/templates/notification";
import { randomBytes } from "crypto";
import { emailImg } from "@/templates/email-image";

export const sendSupportEmail = async (
  supportEmail: SupportEmailType,
  user: UserType
) => {
  try {
    // const res = await db
    //   .insert(supportEmails)
    //   .returning();

    // const newNotification = res?.[0];

    const to = "support@taoshi.io";
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

    return parseResult({ sent: true });
  } catch (error) {
    return parseError(error);
  }
};
