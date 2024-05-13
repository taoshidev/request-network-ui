import { getValidator } from "@/actions/validators";
import { ValidatorType } from "@/db/types/validator";
import { ValidatorEdit } from "@/components/ValidatorEdit";
import { getAuthUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import { getContracts } from "@/actions/contracts";
import { and, eq } from "drizzle-orm";
import { contracts } from "@/db/schema";

export default async function Page({ params }: any) {
  const { id } = params;
  const validator: ValidatorType = await getValidator({ id });
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }

  const userContracts = await getContracts({
    where: and(eq(contracts.userId, user.id)),
  });

  return (
    <ValidatorEdit
      user={user}
      validator={validator}
      contracts={userContracts}
    />
  );
}
