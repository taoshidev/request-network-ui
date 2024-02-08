import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

import { getUserAPIKeys } from "@/actions/keys";
import { getValidator } from "@/actions/validators";

import { Consumer } from "@/components/Dashboard/Consumer";
import { Validator } from "@/components/Dashboard/Validator";

export default async function Page() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/auth/login");
  }

  // if user is a consumer, render consumer dashboard
  if (data.user.user_metadata.type === "consumer") {
    const {
      result: { keys },
    }: any = await getUserAPIKeys({ ownerId: data.user.id });

    return <Consumer user={data.user} keys={keys} />;

    // if user is a validator, render validator dashboard
  } else if (data.user.user_metadata.type === "validator") {
    const result: any = await getValidator({ id: data.user.id });

    return <Validator user={data.user} validator={result} />;
  }
}
