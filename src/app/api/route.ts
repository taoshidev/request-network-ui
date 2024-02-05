import { NextResponse } from "next/server";
import { NextRequestWithUnkeyContext, withUnkey } from "@unkey/nextjs";

export const GET = withUnkey(async (request: NextRequestWithUnkeyContext) => {
  if (!request.unkey.valid) {
    return new NextResponse("unauthorized", { status: 403 });
  }

  const response = await fetch("http://localhost:3002");
  const data = await response.json();

  return new NextResponse(JSON.stringify(data), { status: 200 });
});
