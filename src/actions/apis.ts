"use server";

import crypto, { randomBytes } from "crypto";
const UNKEY_ROOT_KEY = process.env.UNKEY_ROOT_KEY as string;
const UNKEY_API_URL = process.env.UNKEY_API_URL as string;
import { getValidator } from "./validators";
import { ValidatorType } from "@/db/types/validator";

export const createUnkeyApiKey = async ({ name }: { name: object }) => {
  try {
    const res = await fetch(UNKEY_API_URL + "/apis.createApi", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UNKEY_ROOT_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();

    return {
      data,
      error: null,
    };
  } catch (error) {
    return { data: null, error };
  }
};

export const signRequest = ({
  method,
  path,
  body,
  apiKey,
  apiSecret,
}: {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  body: string | object;
  apiKey: string;
  apiSecret: string;
}) => {
  const nonce = Date.now();
  const message = `${method}${path}${body}${apiKey}${nonce}`;
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(message)
    .digest("hex");

  return { apiKey, signature, nonce };
};

export const generateApiKey = () => {
  return randomBytes(16).toString("hex");
};

export const generateApiSecret = () => {
  return randomBytes(32).toString("hex");
};

export const sendToProxy = async ({
  validatorId,
  endpoint,
  data,
}: {
  endpoint: {
    url: string;
    method: "GET" | "POST" | "PUT" | "DELETE";
    path: string;
  };
  validatorId: string;
  data: any;
}) => {
  try {
    const { url, method, path } = endpoint;
    const body = JSON.stringify(data);
    const validator = await getValidator({ id: validatorId } as ValidatorType);
    const { apiKey, apiSecret } = validator;
    const { signature, nonce } = signRequest({
      method,
      path,
      body,
      apiKey,
      apiSecret,
    });
    console.log("from signRequest:", {
      method,
      path,
      body,
      apiKey,
      apiSecret,
    });
    const res = await fetch(`${url}${path}`, {
      method: method,
      body: data ? JSON.stringify(data) : null,
      headers: {
        "Content-Type": "application/json",
        "x-taoshi-request-key": apiKey,
        "x-taoshi-signature": signature,
        "x-taoshi-nonce": nonce.toString(),
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res?.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(error);
  }
};