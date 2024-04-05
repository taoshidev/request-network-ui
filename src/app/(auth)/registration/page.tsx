import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";

import { endpoints, validators } from "@/db/schema";

import { getAuthUser } from "@/actions/auth";
import { getSubnets } from "@/actions/subnets";
import { getValidators } from "@/actions/validators";

import { Registration } from "@/components/Registration";

export default async function Page() {
  const user = await getAuthUser();
  const subnets = await getSubnets({
    with: {
      endpoints: {
        with: {
          validators: {
            with: {
              endpoints: true,
            },
          },
        },
      },
    },
  });

  const validator = await getValidators({
    where: and(eq(validators.verified, true)),
    with: {
      endpoints: {
        where: and(eq(endpoints.enabled, true)),
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  return <Registration validator={validator} subnets={subnets} />;
}
