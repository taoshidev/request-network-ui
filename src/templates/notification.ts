import { marked } from "marked";
const { convert: toText } = require("html-to-text");

export const notifyHTML = ({ attachments, title, content }) => {
  return `
<!DOCTYPE html>
<html lang="english">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="only" />
    <style type="text/css">
      .body,
      .darkmode,
      .darkmode div {
        color-scheme: light only;
      }
      .darkmode img,
      .darkmode p,
      .darkmode h1,
      .darkmode h4,
      .darkmode li {
        color-scheme: light only;
      }
    </style>
  </head>
  <body>
    <container>
    <row style="padding: 0; width: 100%; position: relative">
      <columns style="margin: 0 auto; padding-left: 16px; padding-bottom: 16px">
        <div style="text-align: center; background-color: #ffffff !important">
            <img
              class="image"
              src="cid:${attachments[0].cid}"
              width="400"
              style="width: 400px; display: inline-block"
            />
          </div>
          <br />
          <div style="text-align: center; max-width: 400px; margin: 0 auto">
            <h1 class="text-center">${title}</h1>
            <p>${marked(content)}</p>
            <p></p>
            <p style="font-style: italic">
              This email was sent from an address that cannot accept incoming
              email. Please do not reply to this message.
            </p>
          </div>
        </columns>
      </row>
    </container>
  </body>
</html>`;
};

export const notifyText = ({ title, content }) => {
  return `${title}
  ${toText(content, { wordWrap: 130 })}
  
  This email was sent from an address that cannot accept incoming email. Please do not reply to this message.`;
};
