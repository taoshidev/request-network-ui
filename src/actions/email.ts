"use server";

import { IEmailOptions } from "@/interfaces/email";
import EmailService from "@/services/email.service";
import { randomBytes } from "crypto";

const emailService = new EmailService();

export const sendEmail = async (mailerConfig: IEmailOptions) => {
  const attachments = [
    {
      filename: "request-network.png",
      path: `${process.cwd()}/src/assets/request-network.png`,
      cid: `${randomBytes(10).toString("hex")}-request-network.png`, //same cid value as in the html img src
    },
  ];

  if (!mailerConfig.attachments) {
    mailerConfig.attachments = attachments;
    mailerConfig.templateVariables.attachments = attachments;
  }

  return emailService.send(mailerConfig);
}