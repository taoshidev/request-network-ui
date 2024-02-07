import { NextResponse } from "next/server";
import { NextRequestWithUnkeyContext, withUnkey } from "@unkey/nextjs";

import { verifyShortId } from "@/utils/ids";

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

    return new NextResponse(JSON.stringify(data), { status: 200 });
  }
);
