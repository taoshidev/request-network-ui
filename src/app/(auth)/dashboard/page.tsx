import { redirect } from "next/navigation";

import { getAuthUser } from "@/actions/auth";
import { getUserAPIKeys } from "@/actions/keys";
import { getValidator } from "@/actions/validators";

import { Consumer } from "./_components/Consumer";
import { Validator } from "./_components/Validator";

export default async function Page() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  // if user is a consumer, render consumer dashboard
  if (user.user_metadata.role === "consumer") {
    const {
      result: { keys },
    }: any = await getUserAPIKeys({ ownerId: user.id });

    return <Consumer user={user} keys={keys} />;

    // if user is a validator, render validator dashboard
  } else if (user.user_metadata.role === "validator") {
    const result: any = await getValidator({ id: user.id });

    return <Validator user={user} validator={result} />;
  }
}
