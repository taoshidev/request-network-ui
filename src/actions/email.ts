"use server";

import { IEmailOptions } from "@/interfaces/email";
import EmailService from "@/services/email.service";
import { randomBytes } from "crypto";
import path from "path";

const emailService = new EmailService();

export const sendEmail = async (mailerConfig: IEmailOptions) => {
  console.log('image path: ', path.resolve('./public', 'images', 'request-network.png'));
  const attachments = [
    {
      filename: "request-network.png",
      path: path.resolve('./public', 'images', 'request-network.png'),
      cid: `${randomBytes(10).toString("hex")}-request-network.png`, //same cid value as in the html img src
    },
  ];

  if (!mailerConfig.attachments) {
    mailerConfig.attachments = attachments;
    mailerConfig.templateVariables.attachments = attachments;
  }

  return emailService.send(mailerConfig);
}