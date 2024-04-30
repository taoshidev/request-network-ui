import { redirect } from "next/navigation";
import { getAuthUser } from "@/actions/auth";
import { getEndpoints } from "@/actions/endpoints";
import { getValidators } from "@/actions/validators";
import { getSubnets } from "@/actions/subnets";
import { Consumer } from "@/components/Consumer";
import { ValidatorDashboard } from "@/components/ValidatorDashbord";
import { getSubscriptions } from "@/actions/subscriptions";
import { and, eq } from "drizzle-orm";
import { subscriptions, validators } from "@/db/schema";
import { getUserAPIKeys } from "@/actions/keys";
import { ValidatorType } from "@/db/types/validator";

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
          subnets: true,
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
            validators: true,
          },
        },
      },
    });

    if (subs?.error) subs = [];

    return <Consumer subscriptions={subs} validators={validatorArr} />;

    // if user is a validator, render validator dashboard
  } else if (user.user_metadata.role === "validator") {
    const endpoints = await getEndpoints();
    const subnets = await getSubnets();

    const promises = (validatorArr || [])?.map(async (v: ValidatorType) => {
      const res = await getUserAPIKeys({ apiId: v.apiId as string });
      return { validator: { ...v, ...res?.result } };
    });
    const stats = await Promise.all(promises);

    return (
      <ValidatorDashboard
        user={user}
        subnets={subnets}
        endpoints={endpoints}
        validators={validatorArr}
        stats={stats}
      />
    );
  }
}
