import { getSubnets } from "@/actions/subnets";
import { Subnets } from "@/components/Subnets";

export default async function Page() {
  const subnets = await getSubnets({
    with: {
      endpoints: {
        columns: {},
        with: {
          validators: true,
        },
      },
    },
  });

  return <Subnets subnets={subnets!} />;
}
