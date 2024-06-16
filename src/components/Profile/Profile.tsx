"use client";

import {
  Container,
  Box,
  Image,
  Title,
  Text,
  TextInput,
  Grid,
  Avatar,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { UserSchema } from "@/db/types/user";

export function Profile({ user }: any) {
  const [visible, { toggle }] = useDisclosure(false);
  const form = useForm<Partial<any>>({
    initialValues: {},
    validate: zodResolver(UserSchema),
  });
  const provider = getTitle(user.identities?.[0]?.provider);
  const role = getTitle(user.user_metadata.role);

  function getTitle(title) {
    return (
      (title?.[0] || "").toUpperCase() + (title || "").slice(1).toLowerCase()
    );
  }

  return (
    <Container h="100%">
      <Box mb="xl">
        <Grid grow>
          <Grid.Col span="auto">
            {user.user_metadata?.avatar_url && (
              <Avatar
                src={user.user_metadata.avatar_url}
                radius={100}
                size="xl"
              />
            )}
          </Grid.Col>
          <Grid.Col span={10}>
            <Text size="sm">Account Email</Text>
            <Title order={2}>{user.email}</Title>
          </Grid.Col>
        </Grid>
      </Box>

      <Box mb="xl">
        <Title order={3}>Basic Details</Title>
        <TextInput
          label="Email Address"
          placeholder="Email Address"
          defaultValue={user.email}
          readOnly
        />
        {user.user_metadata?.name && (
          <TextInput
            label="Name"
            placeholder=""
            defaultValue={user.user_metadata.name}
            readOnly
          />
        )}
        {user.user_metadata?.user_name && (
          <TextInput
            label="User Name"
            placeholder=""
            defaultValue={user.user_metadata.user_name}
            readOnly
          />
        )}
        <TextInput
          label="Logged in With"
          placeholder="Provider"
          defaultValue={provider}
          readOnly
        />
        <TextInput
          label="Role"
          placeholder="Role"
          defaultValue={role}
          readOnly
        />
      </Box>

      <Box mb="xl">
        <Title order={3}>Profile</Title>
        <TextInput label="Discord Username" placeholder="Discord Username" />
      </Box>
    </Container>
  );
}
