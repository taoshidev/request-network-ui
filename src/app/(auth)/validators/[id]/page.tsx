import { getValidator } from "@/actions/validators";
import { ValidatorType } from "@/db/types/validator";
import { ValidatorEdit } from "@/components/ValidatorEdit";
import { getAuthUser } from "@/actions/auth";
import { getContracts } from "@/actions/contracts";
import { and, eq } from "drizzle-orm";
import { contracts, services } from "@/db/schema";
import { getServices } from "@/actions/services";
import ClientRedirect from "@/components/ClientRedirect";

export default async function Page({ params }: any) {
  const { id } = params;
  const validator: ValidatorType = await getValidator({ id });
  const user = await getAuthUser();

  if (!user) return;

  const userContracts = await getContracts({
    where: and(eq(contracts.userId, user?.id!)),
    with: { services: true }
  });

  const userServices = await getServices({
    where: and(eq(services.userId, user?.id!))
  });

  return (
    <ValidatorEdit
      user={user!}
      validator={validator}
      contracts={userContracts}
      services={userServices}
    />
  );
}
