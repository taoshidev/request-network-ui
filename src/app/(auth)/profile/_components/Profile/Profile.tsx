"use client";

import { useState } from "react";
import {
  Container,
  Center,
  Box,
  Title,
  Text,
  Stack,
  PasswordInput,
  Button,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

export function Profile({ user }: any) {
  const [visible, { toggle }] = useDisclosure(false);

  return (
    <Container h="100%">
      <Box mb="xl">
        <Text size="sm">Account Email</Text>
        <Title>{user.email}</Title>
      </Box>

      <Box mb="xl">
        <Title order={2}>Basic Details</Title>
        <TextInput
          label="Email Address"
          placeholder="Email Address"
          defaultValue={user.email}
        />
      </Box>

      <Box mb="xl">
        <Title order={2}>Password</Title>
        <Stack>
          <PasswordInput
            label="Password"
            defaultValue="secret"
            visible={visible}
            onVisibilityChange={toggle}
          />
          <PasswordInput
            label="Confirm password"
            defaultValue="secret"
            visible={visible}
            onVisibilityChange={toggle}
          />
        </Stack>
      </Box>

      <Box mb="xl">
        <Title order={2}>Profile</Title>
        <TextInput label="Discord Username" placeholder="Discord Username" />
      </Box>
    </Container>
  );
}
