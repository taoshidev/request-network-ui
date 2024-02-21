import { redirect } from "next/navigation";

import { getAuthUser } from "@/actions/auth";
import { getUserAPIKeys } from "@/actions/keys";
import { getEndpoints } from "@/actions/endpoints";

import { Consumer } from "@/components/Consumer";
import { Endpoints } from "@/components/Endpoints";

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

    return <Endpoints user={user} endpoints={endpoints} />;
  }
}
