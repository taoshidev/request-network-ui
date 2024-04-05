import { getValidator, ValidatorType } from "@/actions/validators";

import { ValidatorEdit } from "@/components/ValidatorEdit";

export default async function Page({ params }: any) {
  const { id } = params;
  const validator: ValidatorType = await getValidator({ id });

  return <ValidatorEdit validator={validator} />;
}
