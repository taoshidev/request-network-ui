import { getAuthUser } from "@/actions/auth";
import { getKey } from "@/actions/keys";
import { getSubscriptions } from "@/actions/subscriptions";

import { Keys } from "@/components/Keys";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({ params }: any) {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = params;
  const { result } = await getKey({ keyId: id });

  const data = await getSubscriptions({
    where: eq(subscriptions.id, (result?.meta?.subscription as any)?.id),
    with: {
      service: true,
      validator: {
        columns: {
          id: true,
          baseApiUrl: true,
          apiPrefix: true
        }
      },
      endpoint: {
        with: {
          validator: {
            columns: {
              signature: false,
              description: false,
              hotkey: false,
              account: false
            },
          },
        },
      },
    },
  });

  return <Keys apiKey={result} subscription={data?.[0]} />;
}
