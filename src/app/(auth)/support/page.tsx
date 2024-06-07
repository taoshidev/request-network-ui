import { getAuthUser } from "@/actions/auth";
import { Box, Group, Title } from "@mantine/core";
import { redirect } from "next/navigation";
import SupportEmailForm from "@/components/SupportEmailForm";

export default async function SupportPage() {
  const user = await getAuthUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <Box className="container max-w-5xl mx-auto mb-32">
      <Box className="max-w-3xl mx-auto mb-16">
        <Group justify="space-between">
          <Title order={2} className="mb-5">
            Contact our Support Team
          </Title>
        </Group>
        <SupportEmailForm />
      </Box>
    </Box>
  );
}
