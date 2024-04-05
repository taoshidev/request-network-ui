import { redirect } from "next/navigation";

import { getAuthUser } from "@/actions/auth";

import { Onboarding } from "@/components/Onboarding";

export default async function Page() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  // we now have a onboarded prop on the user to check
  // if the user has already onboarded
  return <Onboarding />;
}
