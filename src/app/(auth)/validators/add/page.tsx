import { getAuthUser } from "@/actions/auth";
import { getSubnets } from "@/actions/subnets";
import ValidatorStepper from "@/components/AddValidator/ValidatorStepper";
import { DateTime } from "luxon";
import { getContracts } from "@/actions/contracts";
import { contracts } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { SubnetType } from "@/db/types/subnet";
import ClientRedirect from "@/components/ClientRedirect";

export default async function AddValidatorPage() {
  const user = await getAuthUser();

  if (!user) return;

  const subnets = await getSubnets();
  const userContracts = await getContracts({
    where: and(eq(contracts.userId, user?.id as string)),
    with: { services: true },
  });
  const expires = DateTime.now().plus({ months: 3 }).toJSDate();

  if (user?.user_metadata?.role !== "validator") {
    return <ClientRedirect href="/dashboard" />;
  } else if (!user.user_metadata.onboarded) {
    return <ClientRedirect href="/onboarding" />;
  }

  return (
    <ValidatorStepper
      user={user}
      subnets={subnets as SubnetType[]}
      contracts={userContracts}
    />
  );
}
