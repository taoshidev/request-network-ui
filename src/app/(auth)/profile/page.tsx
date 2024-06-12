import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { Profile } from "@/components/Profile";
import ClientRedirect from "@/components/ClientRedirect";

export default async function Page() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return <ClientRedirect href="/login" message="Session expired..." />;
  }

  return <Profile user={data.user} />;
}
