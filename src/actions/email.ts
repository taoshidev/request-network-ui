"use server";

import { IEmailOptions } from "@/interfaces/email";
import EmailService from "@/services/email.service";

const emailService = new EmailService();

export const sendEmail = async (mailerConfig: IEmailOptions) => {
  return emailService.send(mailerConfig);
}