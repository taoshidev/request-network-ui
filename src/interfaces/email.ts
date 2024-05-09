export interface IAttachment {
  content?: string,
  filename: string,
  path?: string,
  cid?: string
}

export interface IEmailOptions {
  to: string;
  from?: string;
  reply?: string;
  cc?: string;
  bcc?: string;
  subject: string;
  template: string;
  templateVariables: object;
  attachments?: IAttachment[] | undefined;
}

export interface IEmailHeaders {
  to: string, 
  from: string,
  cc?: string,
  bcc?: string
  replyTo: string,
  subject: string,
}