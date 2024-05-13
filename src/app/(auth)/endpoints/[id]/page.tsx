import { getEndpointWithSubscription } from "@/actions/endpoints";
import { subscriptions } from "@/db/schema";
import { getSubscriptions } from "@/actions/subscriptions";
import { and, eq } from "drizzle-orm";
import { getContracts } from "@/actions/contracts";
import { contracts } from "@/db/schema";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/actions/auth";
import { UpdateEndpoint } from "@/components/UpdateEndpoint";
interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = params;

  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  const [result = {}] = (await getEndpointWithSubscription({ id })) ?? [];
  const subs = await getSubscriptions({
    where: and(eq(subscriptions.endpointId, id)),
  });
  const userContracts = await getContracts({
    where: and(eq(contracts.userId, user.id)),
  });
  return (
    <UpdateEndpoint
      endpoint={result}
      contracts={userContracts}
      subscriptionCount={subs?.length || 0}
    />
  );
}
