import { and, eq } from "drizzle-orm";
import { contracts } from "@/db/schema";
import { getEndpoints } from "@/actions/endpoints";
import { getAuthUser } from "@/actions/auth";
import { getValidators } from "@/actions/validators";
import { getSubnets } from "@/actions/subnets";
import { Endpoints } from "@/components/Endpoints";
import { getContracts } from "@/actions/contracts";
import ClientRedirect from "@/components/ClientRedirect";

export default async function Page() {
  const user = await getAuthUser();

  if (!user)
    return <ClientRedirect href="/login" message="Session expired..." />;

  const endpoints = await getEndpoints();
  const validators = await getValidators();
  const subnets = await getSubnets();

  const userContracts = await getContracts({
    where: and(eq(contracts.userId, user?.id!)),
  });

  return (
    <Endpoints
      contracts={userContracts}
      endpoints={endpoints!}
      validators={validators}
      subnets={subnets!}
    />
  );
}
