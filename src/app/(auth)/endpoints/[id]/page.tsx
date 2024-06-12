import { getEndpointWithSubscription } from "@/actions/endpoints";
import { and, eq } from "drizzle-orm";
import { getContracts } from "@/actions/contracts";
import { contracts } from "@/db/schema";
import { getAuthUser } from "@/actions/auth";
import { UpdateEndpoint } from "@/components/UpdateEndpoint";
import { EndpointType } from "@/db/types/endpoint";
import ClientRedirect from "@/components/ClientRedirect";
interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { id } = params;
  const user = await getAuthUser();

  if (!user) return <ClientRedirect href="/login" message="Session expired..."/>;

  const result: EndpointType = await getEndpointWithSubscription({ id });

  const userContracts = await getContracts({
    where: and(eq(contracts.userId, user?.id!)),
    with: { services: true },
  });
  return (
    <UpdateEndpoint
      user={user!}
      endpoint={result || {}}
      contracts={userContracts}
      subscriptionCount={result?.subscriptions?.length || 0}
    />
  );
}
