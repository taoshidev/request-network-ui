import { createClient } from "@/lib/supabase/server";
import { Box, Title } from "@mantine/core";
import ValidatorStatus from "@/components/ValidatorStatus";
import { getValidators } from "@/actions/validators";
import { and, eq } from "drizzle-orm";
import { validators } from "@/db/schema";

export default async function StatusPage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  const where: any[] = [];

  if (data?.user?.user_metadata?.role === 'validator' ) {
    where.push(eq(validators.userId, data?.user?.id as string));
  }
  let validatorsRes = await getValidators(
    {
      where: and(...where),
      with: {
        endpoints: {
          with: {
            subnet: true,
            contract: {
              with: {
                services: true,
              },
            },
          },
        },
      },
    },
    { withStatus: true }
  );

  if (validatorsRes?.error) validatorsRes = [];

  if (error || !data?.user) {
    return;
  }

  return (
    <Box>
      <ValidatorStatus user={data.user} validators={validatorsRes} />
    </Box>
  );
}
