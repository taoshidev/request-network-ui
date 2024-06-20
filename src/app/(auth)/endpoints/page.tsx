import { and, eq } from "drizzle-orm";
import { contracts } from "@/db/schema";
import { getEndpoints } from "@/actions/endpoints";
import { getAuthUser } from "@/actions/auth";
import { getValidators } from "@/actions/validators";
import { getSubnets } from "@/actions/subnets";
import { Endpoints } from "@/components/Endpoints";
import { getContracts } from "@/actions/contracts";

export default async function Page() {
  const user = await getAuthUser();

  if (!user) return;

  const endpoints = await getEndpoints();
  const validators = await getValidators({
    columns: {
      apiKey: false,
      apiSecret: false,
    },
  });
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
