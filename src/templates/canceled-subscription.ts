import { TransactionType } from "@/db/types/transaction";
import { marked } from "marked";
const { convert: toText } = require("html-to-text");

export const canceledSubHTML = ({
  consumerApiUrl,
  validatorName,
  endpointUrl,
}: {
  consumerApiUrl: string;
  validatorName: string;
  endpointUrl: string;
}) => {
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
          <div style="text-align: center; max-width: 400px; margin: 0 auto">
            <h1 style="text-align: center">Subscription Canceled for ${validatorName}</h1>
            <div style="text-align: left; display: inline-block; margin: 0 auto;">
              <p>Api Url: ${consumerApiUrl}</p>
              <p>Endpoint Url: ${endpointUrl}</p>
            </div>
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

export const canceledSubText = ({
  consumerApiUrl,
  validatorName,
  endpointUrl,
}: {
  consumerApiUrl: string;
  validatorName: string;
  endpointUrl: string;
}) => {
  return `Subscription Canceled for  ${validatorName}

  Api Url: ${consumerApiUrl}
  Endpoint Url: ${endpointUrl}

  This email was sent from an address that cannot accept incoming email. Please do not reply to this message.`;
};
