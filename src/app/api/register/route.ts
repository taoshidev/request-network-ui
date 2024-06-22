import { NextRequest, NextResponse } from "next/server";
import { updateValidator } from "@/actions/validators";
import {
  jsonResponse,
  verifyApiServerRequest,
} from "@/utils/verify-api-server-request";
import { StripeCheckType } from "@/db/types/stripe-check";

/**
 * Handles POST requests for validator registration.
 */
export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const { status, message, body, validator } = await verifyApiServerRequest(
    req
  );

  if (status !== 200) {
    return jsonResponse(status, message);
  }

  const resp = await registerValidator(body, validator?.id as string);

  if (resp?.status === 500) {
    return resp;
  }

  return await syncValidators(body.validators);
};

/**
 * Registers the validator with the provided API URL.
 */
const registerValidator = async (
  body: {
    baseApiUrl: string;
    apiPrefix: string;
    stripeStatus: StripeCheckType;
  },
  validatorId: string
): Promise<NextResponse> => {
  const { baseApiUrl, apiPrefix, stripeStatus } = body;

  const updated = await updateValidator({
    id: validatorId,
    ...{ baseApiUrl, apiPrefix, stripeLiveMode: stripeStatus?.stripeLiveMode },
  });
  if (updated?.data) {
    return jsonResponse(200, "Registration complete");
  } else {
    return jsonResponse(500, "Failed to update validator information");
  }
};

/**
 * Sync validators with apiPrefixes.
 */
const syncValidators = async (
  validators: Array<{ id: string; apiPrefix: string; baseApiUrl: string }>
): Promise<NextResponse> => {
  try {
    if (validators.length > 0) {
      const promises = validators.map(
        (validator: { id: string; apiPrefix: string }) => {
          return updateValidator({
            ...validator,
          });
        }
      );

      const resArr = await Promise.all(promises);

      return jsonResponse(200, "Validator's API Prefixes synced.");
    }
    return jsonResponse(200, "Validator has no subscriptions to sync.");
  } catch (error) {
    return jsonResponse(500, "Failed to sync validator.");
  }
};
