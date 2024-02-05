// @ts-nocheck

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Container,
  Box,
  TextInput,
  Button,
  Text,
  Title,
  Table,
  Group,
  Modal,
  Loader,
  Center,
  Anchor,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { isEmpty, set } from "lodash";
import dayjs from "dayjs";
import { z } from "zod";

import { getUserAPIKeys, createAPIKey } from "@/actions/keys";

const userSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
});

type User = z.infer<typeof userSchema>;

export function Dashboard() {
  const supabase = createClientComponentClient();

  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [keys, setKeys] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit: SubmitHandler<User> = async (values) => {
    setLoading(true);
    const { data, error: GetUserError } = await supabase.auth.getUser();

    if (GetUserError) return;

    const { result, error: CreateAPIKeyError } = await createAPIKey({
      name: values.name,
      ownerId: data.user.id,
    });

    console.log(result);
    if (CreateAPIKeyError) return;

    setLoading(false);
    close();
  };

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) return;

      setUser(data.user as any);
    };

    if (isEmpty(user)) {
      getUser();
    }
  }, [user, supabase]);

  useEffect(() => {
    const fetchKeys = async () => {
      const { result } = await getUserAPIKeys({ ownerId: (user as any).id });
      console.log(result);
      if (result) {
        setKeys(result.keys as any);
      }
    };

    if (!keys && user) {
      fetchKeys();
    }
  }, [keys, user]);

  const createKeyComponent = (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} w="100%">
      <Box mb="md">
        <TextInput
          withAsterisk
          label="Name"
          placeholder="Name"
          {...register("name", { required: true })}
          error={errors.name?.message}
        />
      </Box>

      <Box mt="lg">
        <Button type="submit" loading={loading} w="100%">
          Create
        </Button>
      </Box>
    </Box>
  );

  if (!keys) {
    return (
      <Container>
        <Center>
          <Loader size="xl" />
        </Center>
      </Container>
    );
  }

  return (
    <Container>
      <Modal opened={opened} onClose={close} title="Create a new API key">
        {createKeyComponent}
      </Modal>
      {isEmpty(keys) ? (
        <>
          <Box mb="md">
            <Title order={3}>You don&apos;t have any API Keys yet</Title>
            <Text>Create your first API key and start receiving requests.</Text>
          </Box>
          {createKeyComponent}
        </>
      ) : (
        <>
          <Group justify="space-between" mb="xl">
            <Title order={3}>API Keys</Title>
            <Button onClick={open}>Create New API Key</Button>
          </Group>

          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Created</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Request</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {keys.map((key: any) => (
                <Table.Tr key={key.id}>
                  <Table.Td>{key.name}</Table.Td>
                  <Table.Td>
                    {dayjs(key.createdAt).format("MMM DD, YYYY")}
                  </Table.Td>
                  <Table.Td>{key.meta.role}</Table.Td>
                  <Table.Td>52,184</Table.Td>
                  <Table.Td>
                    <Anchor component={Link} href={`/keys/${key.id}`}>
                      View Stats
                    </Anchor>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </>
      )}
    </Container>
  );
}
