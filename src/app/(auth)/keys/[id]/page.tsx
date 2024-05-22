import { getKey } from "@/actions/keys";
import { getSubscriptions } from "@/actions/subscriptions";

import { Keys } from "@/components/Keys";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({ params }: any) {
  const { id } = params;
  const { result } = await getKey({ keyId: id });

  const data = await getSubscriptions({
    where: eq(subscriptions.id, (result?.meta?.subscription as any)?.id),
    with: {
      service: true,
      endpoint: {
        with: {
          validator: {
            columns: {
              signature: false,
              description: false,
            },
          },
        },
      },
    },
  });

  return <Keys apiKey={result} subscription={data?.[0]} />;
}
