import "server-only";
import { IEmailHeaders, IEmailOptions } from "@/interfaces/email";
import * as aws from "@aws-sdk/client-ses";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import * as nodemailer from "nodemailer";

/**
 * EmailService class provides for sending emails using node-mailer.
 */
export default class EmailService {
  mailTransport: any;
  defaults = {
    from: process.env.EMAIL_FROM || "",
    replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM || "",
  };

  constructor() {
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    const user = process.env.EMAIL_FROM;
    const pass = process.env.EMAIL_PASS;

    if (region && accessKeyId && secretAccessKey) {
      const ses = new aws.SES({
        region,
        apiVersion: "2010-12-01",
        defaultProvider,
      } as any);

      this.mailTransport = nodemailer.createTransport({
        SES: { ses, aws },
      });
    } else if (user && pass) {
      this.mailTransport = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user, pass },
      });
    }
  }

  protected getHeaders(mailerConfig: IEmailOptions) {
    const envName = process.env.NEXT_PUBLIC_ENV_NAME
      ? `${process.env.NEXT_PUBLIC_ENV_NAME}: `
      : "";
    const emailHeaders: IEmailHeaders = {
      from: mailerConfig.from || this.defaults.from,
      replyTo: mailerConfig.reply || mailerConfig.from || this.defaults.replyTo,
      subject: `${envName}${mailerConfig.subject}`,
      to: mailerConfig.to,
    };

    if (mailerConfig.cc) emailHeaders.cc = mailerConfig.cc;
    if (mailerConfig.bcc) emailHeaders.bcc = mailerConfig.bcc;

    return emailHeaders;
  }

  async send(mailerConfig: IEmailOptions) {
    const headers = this.getHeaders(mailerConfig);

    try {
      if (this.mailTransport) {
        console.log(mailerConfig);
        const sentMail = await this.mailTransport.sendMail({
          html: mailerConfig.html,
          text: mailerConfig.text,
          from: headers.from,
          replyTo: headers.replyTo,
          subject: headers.subject,
          to: headers.to,
          cc: headers.cc,
          bcc: headers.bcc,
          attachments: mailerConfig.attachments,
        });
        console.log(sentMail);
      } else {
        throw Error("Transport credentials not set.");
      }
      return true;
    } catch (error) {
      console.error(
        `Error: Email delivery failure. To: ${headers.to}, Subject: ${headers.subject}`,
        error
      );
      return false;
    }
  }
}
