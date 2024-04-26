import { getValidator } from "@/actions/validators";
import { ValidatorType } from '@/db/types/validator';
import { ValidatorEdit } from "@/components/ValidatorEdit";

export default async function Page({ params }: any) {
  const { id } = params;
  const validator: ValidatorType = await getValidator({ id });

  return <ValidatorEdit validator={validator} />;
}
