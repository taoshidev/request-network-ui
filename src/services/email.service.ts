import "server-only";
import { IEmailHeaders, IEmailOptions } from "@/interfaces/email";
import * as aws from "@aws-sdk/client-ses";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import * as nodemailer from "nodemailer";
import path from "path";
import { compileFile } from "pug";
import { DateTime } from "luxon";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { readFileSync } from "fs";
const { convert: toText } = require("html-to-text");

const templates = {
  layout: path.join(process.cwd(), "static", "templates", "layout.pug"),
  "layout-text": path.join(
    process.cwd(),
    "static",
    "templates",
    "layout-text.pug"
  ),
  "created-endpoint": path.join(
    process.cwd(),
    "static",
    "templates",
    "created-endpoint.pug"
  ),
  "created-endpoint.text": path.join(
    process.cwd(),
    "static",
    "templates",
    "created-endpoint.text.pug"
  ),
  notification: path.join(
    process.cwd(),
    "static",
    "templates",
    "notification.pug"
  ),
  "notification.text": path.join(
    process.cwd(),
    "static",
    "templates",
    "notification.text.pug"
  ),
  "subscription-created": path.join(
    process.cwd(),
    "static",
    "templates",
    "subscription-created.pug"
  ),
  "subscription-created.text": path.join(
    process.cwd(),
    "static",
    "templates",
    "subscription-created.text.pug"
  ),
};

Object.keys(templates).forEach((key) => {
  readFileSync(templates[key]);
});

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

  protected getTextPath(mailerConfig: IEmailOptions) {
    console.log("text path: ", templates[`${mailerConfig.template}.text`]);
    return templates[`${mailerConfig.template}.text`];
  }

  protected getHtmlPath(mailerConfig: IEmailOptions) {
    console.log("html path: ", templates[`${mailerConfig.template}.text`]);
    return templates[mailerConfig.template];
  }

  async compileText(mailerConfig: IEmailOptions) {
    return compileFile(this.getTextPath(mailerConfig))(
      mailerConfig.templateVariables
    );
  }

  protected async compileHtml(mailerConfig: IEmailOptions) {
    return compileFile(this.getHtmlPath(mailerConfig))(
      mailerConfig.templateVariables
    );
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
    mailerConfig.templateVariables.DateTime = DateTime;
    mailerConfig.templateVariables.marked = marked;
    mailerConfig.templateVariables.sanitizeHtml = sanitizeHtml;
    mailerConfig.templateVariables.toText = toText;
    try {
      if (this.mailTransport) {
        await this.mailTransport.sendMail({
          html: await this.compileHtml(mailerConfig),
          text: await this.compileText(mailerConfig),
          from: headers.from,
          replyTo: headers.replyTo,
          subject: headers.subject,
          to: headers.to,
          cc: headers.cc,
          bcc: headers.bcc,
          attachments: mailerConfig.attachments,
        });
      } else {
        throw Error("Transport credentials not set.");
      }
      return true;
    } catch (error) {
      const { template } = mailerConfig;
      console.error(
        `Error: Email delivery failure. To: ${headers.to}, Subject: ${headers.subject}, Template: ${template}`,
        error
      );
      return false;
    }
  }
}
