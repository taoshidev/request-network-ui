import { createClient } from "@/lib/supabase/server";
import { Box, Title } from "@mantine/core";
import ValidatorStatus from "@/components/ValidatorStatus";
import { getValidatorStatusPage } from "@/actions/validators";
import { and, eq } from "drizzle-orm";
import { validators } from "@/db/schema";

export default async function StatusPage() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  const where: any[] = [];

  if (data?.user?.user_metadata?.role === "validator") {
    where.push(eq(validators.userId, data?.user?.id as string));
  }

  if (error || !data?.user) {
    return;
  }

  let validatorsRes = await getValidatorStatusPage(data?.user);

  if (validatorsRes?.error) validatorsRes = [];

  return (
    <Box>
      <ValidatorStatus user={data.user} initialValidators={validatorsRes} />
    </Box>
  );
}