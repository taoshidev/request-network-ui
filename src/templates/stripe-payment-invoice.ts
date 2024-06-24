import { TransactionType } from "@/db/types/transaction";
import { marked } from "marked";
const { convert: toText } = require("html-to-text");

export const invoiceHTML = ({
  consumerApiUrl,
  validatorName,
  endpointUrl,
  transaction,
}: {
  consumerApiUrl: string;
  validatorName: string;
  endpointUrl: string;
  transaction: TransactionType;
}) => {
  const { meta, amount } = transaction;

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
            <h1 style="text-align: center">Your Payment to ${validatorName}</h1>
            <div style="text-align: left; display: inline-block; margin: 0 auto; position: relative;">
              <p>Price: $${(Math.round((amount as number) * 100) / 100).toFixed(
                2
              )}</p>
              <p>Api Url: ${consumerApiUrl}</p>
              <p>Endpoint Url: ${endpointUrl}</p>
              <p><a href="${
                meta?.hosted_invoice_url
              }"><button style="padding: 8px 15px; background: #00008b; color: #fff; width: 100%; border: none;">View ${validatorName} Invoice</button></a></p>
              <p><a href="${
                meta?.invoice_pdf
              }"><button style="padding: 8px 15px; background: #00008b; color: #fff; width: 100%; border: none;">Download ${validatorName} Invoice</button></a></p>
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

export const invoiceText = ({
  consumerApiUrl,
  validatorName,
  endpointUrl,
  transaction,
}: {
  consumerApiUrl: string;
  validatorName: string;
  transaction: TransactionType;
  endpointUrl: string;
}) => {
  const { meta, amount } = transaction;

  return `Your Payment to ${validatorName}

  Price: $${(Math.round((amount as number) * 100) / 100).toFixed(2)}
  Api Url: ${consumerApiUrl}
  Endpoint Url: ${endpointUrl}
  View Invoice: ${meta?.hosted_invoice_url}
  Download Invoice: ${meta?.invoice_pdf}

  This email was sent from an address that cannot accept incoming email. Please do not reply to this message.`;
};
