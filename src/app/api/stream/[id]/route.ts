import { NextResponse } from "next/server";
import { NextRequestWithUnkeyContext, withUnkey } from "@unkey/nextjs";

import { verifyShortId } from "@/utils/ids";
import { isValid } from "./schema";

export const GET = withUnkey(
  async (request: NextRequestWithUnkeyContext, { params }) => {
    // verify endpoint
    const verified = verifyShortId(
      request.unkey.ownerId as string,
      (request.unkey.meta as any).validatorId,
      // @ts-ignore
      params.id
    );

    // ensure key is paired to endpoint
    if (!verified) {
      return new NextResponse("unauthorized", { status: 403 });
    }

    // ensure key is valid
    if (!request.unkey.valid) {
      return new NextResponse("unauthorized", { status: 403 });
    }

    // ensure key is from a consumer
    if ((request.unkey.meta as any).type !== "consumer") {
      return new NextResponse("unauthorized", { status: 403 });
    }

    const response = await fetch((request.unkey.meta as any).customEndpoint);
    const data = await response.json();

    // ensure key is from a consumer
    // penalize validator and choose another
    if (!isValid(data)) {
      return new NextResponse("Bad Request", { status: 500 });
    }

    return new NextResponse(JSON.stringify(data), { status: 200 });
  }
);
