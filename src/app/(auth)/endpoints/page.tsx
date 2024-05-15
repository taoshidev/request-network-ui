import { redirect } from "next/navigation";
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
  const endpoints = await getEndpoints();
  const validators = await getValidators();
  const subnets = await getSubnets();

  if (!user) {
    redirect("/login");
  }

  const userContracts = await getContracts({
    where: and(eq(contracts.userId, user.id))
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
