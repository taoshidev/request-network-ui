import { NextRequest, NextResponse } from "next/server";
import { signRequest } from "@/actions/apis";
import { getValidators, updateValidator } from "@/actions/validators";
import { eq, and } from "drizzle-orm";
import { validators } from "@/db/schema";

/**
 * Handles POST requests for validator registration.
 */
export const POST = async (req: NextRequest): Promise<NextResponse> => {
  const body = await req.json();
  const apiId = req.headers.get("x-taoshi-validator-request-key");
  const nonce = req.headers.get("x-taoshi-nonce")?.toString() || "";
  const token =
    req.headers.get("authorization")?.replace("Bearer ", "").trim() || "";

  if (!apiId) {
    return jsonResponse(403, "x-taoshi header not present");
  }

  const data = await verifyApiId(apiId);
  if (data?.error) {
    return jsonResponse(403, data.error.message);
  }

  const validator = await fetchValidator(apiId);
  if (!validator) {
    return jsonResponse(404, "Validator not found");
  }

  if (!validateSignature(body, validator, nonce, token)) {
    return jsonResponse(403, "Unauthorized");
  }

  return await registerValidator(body.apiUrl, validator.id);
};

/**
 * Verifies the API ID with external UNKEY API.
 */
const verifyApiId = async (apiId: string): Promise<any> => {
  const response = await fetch(
    `${process.env.UNKEY_API_URL}/apis.getApi?apiId=${apiId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.UNKEY_ROOT_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.json();
};

/**
 * Fetches the validator from the database.
 */
const fetchValidator = async (apiId: string) => {
  const response = await getValidators({
    where: and(eq(validators.apiId, apiId)),
  });
  return response?.[0];
};

/**
 * Validates the provided signature against the expected signature.
 */
const validateSignature = (
  body: any,
  validator: any,
  nonce: string,
  token: string
): boolean => {
  const { signature } = signRequest({
    method: "POST",
    path: "/api/register",
    body: JSON.stringify(body),
    apiKey: validator.apiId,
    apiSecret: validator.apiSecret,
    nonce: nonce,
  });
  return token === signature;
};

/**
 * Registers the validator with the provided API URL.
 */
const registerValidator = async (
  apiUrl: string,
  validatorId: string
): Promise<NextResponse> => {
  const updated = await updateValidator({
    id: validatorId,
    baseApiUrl: apiUrl,
  });
  if (updated?.data) {
    return jsonResponse(200, "Registration complete");
  } else {
    return jsonResponse(500, "Failed to update validator information");
  }
};

/**
 * Create JSON responses.
 */
const jsonResponse = (status: number, message: string): NextResponse => {
  return NextResponse.json({ message, status });
};
