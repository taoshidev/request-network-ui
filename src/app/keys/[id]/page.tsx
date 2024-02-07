import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getKey } from "@/actions/keys";

import { Keys } from "@/components/Keys";

export default async function Page({ params }: any) {
  const supabase = createServerComponentClient({ cookies });

  const { id } = params;
  const { result } = await getKey({ keyId: id });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  return <Keys apiKey={result} />;
}
