import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Onboarding } from "@/components/Onboarding";

export default async function Page() {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
    error: GetUserError,
  } = await supabase.auth.getUser();

  if (!user || GetUserError) {
    redirect("/auth/sign-in");
  }

  return <Onboarding />;
}
