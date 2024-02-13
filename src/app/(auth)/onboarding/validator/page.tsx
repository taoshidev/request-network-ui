import { redirect } from "next/navigation";

import { Stepper } from "../_components/ValidatorSteps/Stepper";

import { getAuthUser } from "@/actions/auth";

export default async function Page() {
  const user = await getAuthUser();

  if (!user) {
    redirect("/login");
  }

  return <Stepper user={user} />;
}
