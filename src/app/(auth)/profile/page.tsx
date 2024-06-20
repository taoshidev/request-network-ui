import { createClient } from "@/lib/supabase/server";

import { Profile } from "@/components/Profile";

export default async function ProfilePage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    return;
  }

  return <Profile user={data.user} />;
}
