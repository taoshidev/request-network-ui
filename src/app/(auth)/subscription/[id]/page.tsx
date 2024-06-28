import { getAuthUser } from "@/actions/auth";
import { getKey } from "@/actions/keys";
import { getSubscriptions } from "@/actions/subscriptions";
import ClientRedirect from "@/components/ClientRedirect";

import { Keys } from "@/components/Keys/Keys";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({ params }: any) {
  const user = await getAuthUser();

  if (!user) return;

  const { id } = params;
  const data = await getSubscriptions({
    where: eq(subscriptions.id, id),
    with: {
      service: true,
      validator: {
        columns: {
          id: true,
          baseApiUrl: true,
          apiPrefix: true,
          stripeEnabled: true,
        },
      },
      endpoint: {
        with: {
          validator: {
            columns: {
              signature: false,
              description: false,
              hotkey: false,
              account: false,
            },
          },
        },
      },
    },
  });

  if (user?.id !== data?.[0]?.userId)
    return (
      <ClientRedirect
        message="Page does not exist. Returning to previous page"
        delay={5000}
        back
      />
    );

  const { result } = await getKey({ keyId: data?.[0]?.keyId });

  return <Keys apiKey={result} subscription={data?.[0]} />;
}
