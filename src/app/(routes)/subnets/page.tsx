import { redirect } from "next/navigation";

import { getAuthUser } from "@/actions/auth";
import { getSubnets } from "@/actions/subnets";

import { Subnets } from "@/components/Subnets";

export default async function Page() {
  const user = await getAuthUser();
  const subnets = await getSubnets({ with: { validators: true } });
  console.log(subnets);

  if (!user) {
    redirect("/login");
  }

  return <Subnets subnets={subnets} />;
}
