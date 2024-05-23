import { getEndpointWithSubscription } from "@/actions/endpoints";
import { subscriptions } from "@/db/schema";
import { getSubscriptions } from "@/actions/subscriptions";
import { and, count, eq } from "drizzle-orm";
import { getContracts } from "@/actions/contracts";
import { contracts } from "@/db/schema";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/actions/auth";
import { UpdateEndpoint } from "@/components/UpdateEndpoint";
import { EndpointType } from "@/db/types/endpoint";
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

  const result: EndpointType = await getEndpointWithSubscription({ id });

  const userContracts = await getContracts({
    where: and(eq(contracts.userId, user.id)),
    with: { services: true },
  });
  return (
    <UpdateEndpoint
      endpoint={result || {}}
      contracts={userContracts}
      subscriptionCount={result?.subscriptions?.length || 0}
    />
  );
}
