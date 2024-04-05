import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { Profile } from "@/components/Profile";

export default async function Page() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  return <Profile user={data.user} />;
}
