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
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { isEmpty } from "lodash";
import dayjs from "dayjs";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { getUserAPIKeys, createKey } from "@/actions/keys";
import { TAOSHI_REQUEST_KEY } from "@/constants";
import { generateShortId } from "@/utils/ids";

import styles from "./consumer.module.css";

const userSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
});

type User = z.infer<typeof userSchema>;

interface ConsumerProps {
  user: any;
}

export function Consumer({ user }: ConsumerProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [keys, setKeys] = useState([]);

  const [_, setLocalStorage]: Array<any> = useLocalStorage({
    key: TAOSHI_REQUEST_KEY,
    defaultValue: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit: SubmitHandler<User> = async (values) => {
    setLoading(true);

    // get a random validator
    // in the future, we will select validator based on criteria
    const { data: validators, error: GetValidatorError } = await supabase
      .from("validators")
      .select("*")
      .neq("end_point", null);

    if (GetValidatorError) return;

    // create id from user and validator
    const shortId = generateShortId(user.id, validators[0].id);

    // create key tied to user and validator
    const { result, error: CreateKeyError } = await createKey({
      name: values.name,
      ownerId: user.id,
      meta: {
        shortId,
        type: "consumer",
        validatorId: validators[0].id,
        customEndpoint: validators[0].end_point,
      },
    });

    setLoading(false);
    if (CreateKeyError) return;

    setLocalStorage({ id: result?.key });

    router.push(`/keys/${result?.keyId}`);
    close();
  };

  useEffect(() => {
    const fetchKeys = async () => {
      const { result }: any = await getUserAPIKeys({ ownerId: user.id });

      if (result) {
        setKeys(result.keys);
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
      <Container my="xl">
        <Center>
          <Loader size="xl" />
        </Center>
      </Container>
    );
  }

  return (
    <Container>
      <Modal
        centered
        opened={opened}
        onClose={close}
        title="Create a new API key"
      >
        {createKeyComponent}
      </Modal>
      {isEmpty(keys) ? (
        <>
          <Box my="xl">
            <Title order={3}>You don&apos;t have any API Keys yet</Title>
            <Text>Create your first API key and start receiving requests.</Text>
          </Box>
          {createKeyComponent}
        </>
      ) : (
        <>
          <Group justify="space-between" my="xl">
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
                  <Table.Td>
                    <Anchor
                      className={styles.anchor}
                      component={Link}
                      href={`/keys/${key.id}`}
                    >
                      {key.name}
                    </Anchor>
                  </Table.Td>
                  <Table.Td>
                    {dayjs(key.createdAt).format("MMM DD, YYYY")}
                  </Table.Td>
                  <Table.Td>{key.meta.role}</Table.Td>
                  <Table.Td>52,184</Table.Td>
                  <Table.Td align="right">
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
