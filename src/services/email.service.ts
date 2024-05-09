import 'server-only';
import { IEmailHeaders, IEmailOptions } from '@/interfaces/email';
import * as aws from 'aws-sdk';
import * as nodemailer from 'nodemailer';
import path from 'path';
import { compileFile } from 'pug';

/**
 * EmailService class provides for sending emails using node-mailer.
 */
export default class EmailService {
  mailTransport: any;
  templateDir = path.resolve(process.cwd(), 'src/templates');
  defaults = {
    from: process.env.EMAIL_FROM || '',
    replyTo: process.env.EMAIL_REPLY_TO || process.env.EMAIL_FROM || ''
  }


  constructor() {
    const region = process.env.AWS_REGION;
    const accessKeyId = process.env.AWS_KEY;
    const secretAccessKey = process.env.AWS_SECRET;
    const user = process.env.EMAIL_FROM;
    const pass = process.env.EMAIL_PASS;

    if (region && accessKeyId && secretAccessKey) {
      const SES = new aws.SES({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_KEY,
        secretAccessKey: process.env.AWS_SECRET,
        apiVersion: '2010-12-01'
      });
      
      this.mailTransport = nodemailer.createTransport({
        SES
      });
    } else if (user && pass) {
      this.mailTransport = nodemailer.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_FROM,
          pass: process.env.EMAIL_PASS,
        },
      });
    }
  }

  protected getTextPath(mailerConfig: IEmailOptions) {
    return `${this.templateDir}/${mailerConfig.template}.text.pug`;
  }

  protected getHtmlPath(mailerConfig: IEmailOptions) {
    return `${this.templateDir}/${mailerConfig.template}.pug`;
  }

  async compileText(mailerConfig: IEmailOptions) {
    return compileFile(this.getTextPath(mailerConfig))(mailerConfig.templateVariables);
  }

  protected async compileHtml(mailerConfig: IEmailOptions) {
    return compileFile(this.getHtmlPath(mailerConfig))(mailerConfig.templateVariables);
  }

  protected getHeaders(mailerConfig: IEmailOptions) {
    const envName = process.env.ENV_NAME ? `${process.env.ENV_NAME}: ` : '';
    const emailHeaders: IEmailHeaders = {
      from: mailerConfig.from || this.defaults.from,
      replyTo: mailerConfig.reply || mailerConfig.from || this.defaults.replyTo,
      subject: `${envName}${mailerConfig.subject}`,
      to: mailerConfig.to
    };

    if (mailerConfig.cc) emailHeaders.cc = mailerConfig.cc;
    if (mailerConfig.bcc) emailHeaders.bcc = mailerConfig.bcc;

    return emailHeaders;
  }

  async send(mailerConfig: IEmailOptions) {
    const headers = this.getHeaders(mailerConfig);

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
        throw Error('Transport credentials not set.');
      }
      return true;
    } catch (error) {
      const { template } = mailerConfig;
      console.error(`Error: Email delivery failure. To: ${headers.to}, Subject: ${headers.subject}, Template: ${template}`, error);
      return false;
    }
  }
}
