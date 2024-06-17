import { getAuthUser } from "@/actions/auth";
import { Onboarding } from "@/components/Onboarding";

export default async function Page() {
  // we now have a onboarded prop on the user to check
  // if the user has already onboarded
  const user = await getAuthUser();
  
  if (!user) return;

  return <Onboarding />;
}
