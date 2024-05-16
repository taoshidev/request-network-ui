import { redirect } from "next/navigation";
import { getAuthUser } from "@/actions/auth";
import { getValidators } from "@/actions/validators";
import { getSubnets } from "@/actions/subnets";
import { Consumer } from "@/components/Consumer";
import { ValidatorDashboard } from "@/components/ValidatorDashbord";
import { getSubscriptions } from "@/actions/subscriptions";
import { and, eq } from "drizzle-orm";
import { subscriptions, validators, contracts, endpoints } from "@/db/schema";
import { getUserAPIKeys } from "@/actions/keys";
import { ValidatorType } from "@/db/types/validator";
import { getContracts } from "@/actions/contracts";

export default async function Page() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  if (!user.user_metadata.onboarded) {
    redirect("/onboarding");
  }

  let validatorArr = await getValidators({
    where: and(eq(validators.userId, user.id)),
    with: {
      endpoints: {
        with: {
          subnet: true,
          contract: {
            with: {
              services: true,
            },
          },
        },
      },
    },
  });

  if (validatorArr?.error) validatorArr = [];

  // if user is a consumer, render consumer dashboard
  if (user.user_metadata.role === "consumer") {
    let subs = await getSubscriptions({
      where: and(eq(subscriptions.userId, user.id)),
      with: {
        endpoint: {
          with: {
            validator: true,
          },
        },
      },
    });

    if (subs?.error) subs = [];

    return <Consumer subscriptions={subs} validators={validatorArr} />;
    // if user is a validator, render validator dashboard
  } else if (user.user_metadata.role === "validator") {
    const validatorEndpoints = validatorArr?.map((v) => v.endpoints);

    const subnets = await getSubnets();

    const promises = (validatorArr || [])?.map(async (v: ValidatorType) => {
      const res = await getUserAPIKeys({ apiId: v.apiId as string });
      return { validator: { ...v, ...res?.result } };
    });
    const stats = await Promise.all(promises);

    const userContracts = await getContracts({
      where: and(eq(contracts.userId, user.id)),
      with: { services: true }
    });

    return (
      <ValidatorDashboard
        user={user}
        contracts={userContracts}
        subnets={subnets}
        validators={validatorArr}
        stats={stats}
      />
    );
  }
}
