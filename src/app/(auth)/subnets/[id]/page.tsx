import { getSubnets } from "@/actions/subnets";
import { getValidators } from "@/actions/validators";
import { SubnetValidator } from "@/components/SubnetValidator";
import { eq, and } from "drizzle-orm";
import { endpoints, subnets, validators } from "@/db/schema";
import { SubnetType } from "@/db/types/subnet";

export default async function Page({ params }: any) {
  const { id } = params;
  const vali = await getValidators({
    where: and(eq(validators.verified, true)),
    with: {
      endpoints: {
        where: and(eq(endpoints.enabled, true)),
      },
    },
  });

  const subnet = await getSubnets({
    where: eq(subnets.id, id),
    with: {
      endpoints: {
        with: {
          validators: true,
        },
      },
    },
  });

  return (
    <SubnetValidator
      mode="navigation"
      subnet={subnet?.[0] as SubnetType}
      validators={vali}
    />
  );
}
