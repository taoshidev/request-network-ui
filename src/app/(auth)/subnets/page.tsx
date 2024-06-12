import { getAuthUser } from "@/actions/auth";
import { getSubnets } from "@/actions/subnets";
import ClientRedirect from "@/components/ClientRedirect";
import { Subnets } from "@/components/Subnets";

export default async function Page() {
  const user = await getAuthUser();
  
  if (!user) return <ClientRedirect href="/login" message="Session expired..."/>;

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
