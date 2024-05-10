"use client";

import {
  Container,
  Box,
  Image,
  Title,
  Text,
  TextInput,
  Grid,
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

  function getTitle(title) {
    return (
      (title?.[0] || "").toUpperCase() + (title || "").slice(1).toLowerCase()
    );
  }

  return (
    <Container h="100%">
      <Box mb="xl">
        <Grid grow>
          <Grid.Col span={6} order={{ base: 2, xs: 1 }}>
            <Text size="sm">Account Email</Text>
            <Title>{user.email}</Title>
          </Grid.Col>
          <Grid.Col span={3} order={{ base: 1, xs: 2 }}>
            {user.user_metadata?.avatar_url && (
              <Image
                src={user.user_metadata.avatar_url}
                radius="md"
                h={75}
                w={75}
                fit="cover"
                className="float-right"
              />
            )}
          </Grid.Col>
        </Grid>
      </Box>

      <Box mb="xl">
        <Title order={2}>Basic Details</Title>
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
          placeholder="Role"
          defaultValue={getTitle(user.identities?.[0]?.provider)}
          readOnly
        />
        <TextInput
          label="Role"
          placeholder="Role"
          defaultValue={getTitle(user.user_metadata.role)}
          readOnly
        />
      </Box>

      <Box mb="xl">
        <Title order={2}>Profile</Title>
        <TextInput label="Discord Username" placeholder="Discord Username" />
      </Box>
    </Container>
  );
}
