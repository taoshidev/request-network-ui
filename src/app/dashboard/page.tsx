import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Consumer } from "@/components/Dashboard/Consumer";
import { Validator } from "@/components/Dashboard/Validator";

export default async function Page() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  // if user is a consumer, render consumer dashboard
  if (user.user_metadata.type === "consumer") {
    return <Consumer user={user} />;

    // if user is a validator, render validator dashboard
  } else if (user.user_metadata.type === "validator") {
    return <Validator user={user} />;
  }
}
