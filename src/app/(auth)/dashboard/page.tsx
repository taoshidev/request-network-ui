import { redirect } from "next/navigation";
import { getAuthUser } from "@/actions/auth";
import { getEndpoints } from "@/actions/endpoints";
import { getValidators } from "@/actions/validators";
import { getSubnets } from "@/actions/subnets";
import { Consumer } from "@/components/Consumer";
import { ValidatorDashboard } from "@/components/ValidatorDashbord";
import { getSubscriptions } from "@/actions/subscriptions";
import { and, eq } from "drizzle-orm";
import { subscriptions } from "@/db/schema";

export default async function Page() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  if (!user.user_metadata.onboarded) {
    redirect("/onboarding");
  }

  const validators = await getValidators({
    with: {
      endpoints: {
        with: {
          subnets: true,
        },
      },
    },
  });

  // if user is a consumer, render consumer dashboard
  if (user.user_metadata.role === "consumer") {
    const subs = await getSubscriptions({
      where: and(eq(subscriptions.userId, user.id)),
      with: {
        endpoint: {
          with: {
            validators: true,
          },
        },
      },
    });

    return <Consumer subscriptions={subs} validators={validators} />;

    // if user is a validator, render validator dashboard
  } else if (user.user_metadata.role === "validator") {
    const endpoints = await getEndpoints();
    const subnets = await getSubnets();

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
