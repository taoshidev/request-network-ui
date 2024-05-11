import { getEndpointWithSubscription, getEndpoint } from "@/actions/endpoints";
import { subscriptions } from "@/db/schema";
import { getSubscriptions } from "@/actions/subscriptions";
import { and, eq } from "drizzle-orm";

import { UpdateEndpoint } from "@/components/UpdateEndpoint";
interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = params;
  const [result = {}] = (await getEndpointWithSubscription({ id })) ?? [];
  const subs = await getSubscriptions({
    where: and(eq(subscriptions.endpointId, id)),
  });

  return (
    <UpdateEndpoint endpoint={result} subscriptionCount={subs?.length || 0} />
  );
}
