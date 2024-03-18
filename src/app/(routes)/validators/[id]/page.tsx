import { getValidator } from "@/actions/validators";

import { ValidatorEdit } from "@/components/ValidatorEdit";

export default async function Page({ params }: any) {
  const { id } = params;
  const validator = await getValidator({ id });

  return <ValidatorEdit validator={validator} />;
}
