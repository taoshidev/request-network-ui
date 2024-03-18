import { redirect } from "next/navigation";

import { getAuthUser } from "@/actions/auth";
import { getUserAPIKeys } from "@/actions/keys";
import { getEndpoints } from "@/actions/endpoints";
import { getValidators } from "@/actions/validators";
import { getSubnets } from "@/actions/subnets";

import { Consumer } from "@/components/Consumer";
import { ValidatorDashboard } from "@/components/ValidatorDashbord";

export default async function Page() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  if (!user.user_metadata.onboarded) {
    redirect("/onboarding");
  }

  // if user is a consumer, render consumer dashboard
  if (user.user_metadata.role === "consumer") {
    const {
      result: { keys },
    }: any = await getUserAPIKeys({ ownerId: user.id });

    return <Consumer user={user} keys={keys} />;

    // if user is a validator, render validator dashboard
  } else if (user.user_metadata.role === "validator") {
    const endpoints = await getEndpoints();
    const subnets = await getSubnets();
    const validators = await getValidators();

    return (
      <ValidatorDashboard
        user={user}
        subnets={subnets}
        endpoints={endpoints}
        validators={validators}
      />
    );
  }
}
