import { redirect } from "next/navigation";

import { getEndpoints } from "@/actions/endpoints";
import { getAuthUser } from "@/actions/auth";
import { getValidators } from "@/actions/validators";
import { getSubnets } from "@/actions/subnets";
import { Endpoints } from "@/components/Endpoints";

export default async function Page() {
  const user = await getAuthUser();
  const endpoints = await getEndpoints();
  const validators = await getValidators();
  const subnets = await getSubnets();

  if (!user) {
    redirect("/login");
  }

  return (
    <Endpoints
      endpoints={endpoints}
      validators={validators}
      subnets={subnets}
      user={user}
    />
  );
}
