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
  Anchor,
  Space,
  Notification,
} from "@mantine/core";
import { useDisclosure, useLocalStorage } from "@mantine/hooks";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEmpty } from "lodash";
import dayjs from "dayjs";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { createKey } from "@/actions/keys";
import { getValidators, getSettings } from "@/actions/validators";

import { TAOSHI_REQUEST_KEY } from "@/constants";
import { generateShortId } from "@/utils/ids";

import { ProductInfo } from "../ProductInfo";

import styles from "./consumer.module.css";

const userSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
});

type User = z.infer<typeof userSchema>;

interface ConsumerProps {
  user: any;
  keys: any;
}

export function Consumer({ user, keys }: ConsumerProps) {
  const router = useRouter();

  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    const settings = await getSettings();
    console.log(settings);

    // get a random validator
    // in the future, we will select validator based on criteria
    const validators = await getValidators();

    if (!validators || validators.length === 0) {
      setLoading(false);
      setError("No validators found");
      return;
    }

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
        customEndpoint: validators[0].endpoint,
      },
    });

    if (CreateKeyError) return;

    setLocalStorage({ id: result?.key });

    router.push(`/keys/${result?.keyId}`);

    setLoading(false);
    close();
  };

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

  return (
    <Container>
      {error && (
        <Notification radius="0" title="No Validators Found">
          To obtain a key, their needs to be at least one validator available.
        </Notification>
      )}

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
            <Title order={2}>You don&apos;t have any API Keys yet</Title>
            <Text mb="sm">
              Create your first API key and start receiving requests.
            </Text>
            {createKeyComponent}
          </Box>
        </>
      ) : (
        <>
          <Group justify="space-between" my="xl">
            <Title order={2}>API Keys</Title>
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
      <Space h="xl" />
      <ProductInfo />
      <Space h="xl" />
      <ProductInfo />
    </Container>
  );
}
