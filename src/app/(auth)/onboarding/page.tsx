import { getAuthUser } from "@/actions/auth";
import ClientRedirect from "@/components/ClientRedirect";
import { Onboarding } from "@/components/Onboarding";

export default async function Page() {
  // we now have a onboarded prop on the user to check
  // if the user has already onboarded
  const user = await getAuthUser();
  
  if (!user) return <ClientRedirect href="/login" message="Session expired..."/>;

  return <Onboarding />;
}
