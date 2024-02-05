"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Loader,
  Title,
  Text,
  Group,
  Box,
  Button,
  TextInput,
  Mark,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import dayjs from "dayjs";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function Keys({ apiKey }) {
  const supabase = createClientComponentClient();

  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [keys, setKeys] = useState(null);

  // if (!keys) {
  //   return (
  //     <Container>
  //       <Center>
  //         <Loader size="xl" />
  //       </Center>
  //     </Container>
  //   );
  // }

  console.log(apiKey);

  return (
    <Container>
      <Group justify="space-between" mb="lg">
        <Box>
          <Title>{apiKey.name}</Title>
          <Text size="sm">Key: {apiKey.start}</Text>
          <Text size="sm">
            Created: {dayjs(apiKey.createdAt).format("MMM DD, YYYY")}
          </Text>
        </Box>

        <Group>
          <Button variant="default">Active Validators</Button>
          <Button variant="default">All Validators</Button>
          <Button variant="default">Settings</Button>
        </Group>
      </Group>

      <Box mb="lg">
        <Title order={2}>General Settings</Title>
        <TextInput
          withAsterisk
          label="Edit Key Name"
          placeholder="Name"
          defaultValue={apiKey.name}
        />
      </Box>

      <Box mb="lg">
        <Title order={2}>Requirements</Title>
      </Box>

      <Box mb="lg">
        <Title order={2}>Requirements</Title>
      </Box>
    </Container>
  );
}
