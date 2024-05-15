import { getAuthUser } from "@/actions/auth";
import { getSubnets } from "@/actions/subnets";
import ValidatorStepper from "@/components/AddValidator/ValidatorStepper";
import { redirect } from "next/navigation";
import { DateTime } from "luxon";
import { getContracts } from "@/actions/contracts";
import { contracts } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export default async function AddValidatorPage() {
  const user = await getAuthUser();
  const subnets = await getSubnets();
  const userContracts = await getContracts({
    where: and(eq(contracts.userId, user?.id as string)),
    with: { services: true }
  });
  const expires = DateTime.now().plus({ months: 3 }).toJSDate();

  if (!user) {
    redirect("/login");
  } else if (user.user_metadata.role !== "validator") {
    redirect("dashboard");
  } else if (!user.user_metadata.onboarded) {
    redirect("/onboarding");
  }

  return (
    <ValidatorStepper
      user={user}
      subnets={subnets}
      contracts={userContracts}
      expires={expires}
    />
  );
}
