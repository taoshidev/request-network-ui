"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Container,
  Box,
  Alert,
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
import { IconAlertCircle } from "@tabler/icons-react";

import { createKey } from "@/actions/keys";
import { getEndpoints } from "@/actions/endpoints";

import { TAOSHI_REQUEST_KEY } from "@/constants";
import { generateShortId } from "@/utils/ids";

import { ProductInfo } from "@/components/ProductInfo";

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
    handleSubmit,
    formState: { errors },
  } = useForm<User>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit: SubmitHandler<User> = async (values) => {
    setLoading(true);

    // get a random validator
    // in the future, we will select validator based on criteria
    const endpoints = await getEndpoints();

    if (!endpoints || endpoints.length === 0) {
      setLoading(false);
      setError("No validators found");
      return;
    }

    // create id from user and validator
    const shortId = generateShortId(user.id, endpoints[0].id);

    // create key tied to user and validator
    const { result, error: CreateKeyError } = await createKey({
      name: values.name,
      ownerId: user.id,
      meta: {
        shortId,
        type: "consumer",
        validatorId: endpoints[0].id,
        customEndpoint: endpoints[0].url,
      },
    });

    if (CreateKeyError) return;

    setLocalStorage({ id: result?.key });

    router.push(`/keys/${result?.keyId}`);

    setLoading(false);
    close();
  };

  return (
    <Container className="my-8">
      {error && (
        <Notification title="No Validators Found">
          To obtain a key, their needs to be at least one validator available.
        </Notification>
      )}

      {isEmpty(keys) && (
        <Alert className="mb-8" color="orange" icon={<IconAlertCircle />}>
          <Text className="mb-2">You don&apos;t have any API Keys yet</Text>
          <Text>Create your first API key and start receiving requests.</Text>
        </Alert>
      )}

      <Group className="justify-between my-5">
        <Title className="text-2xl">API Keys</Title>
        <Box>
          <Button component="a" href="/registration">
            Register
          </Button>
        </Box>
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
                  className="font-semibold text-black"
                  component={Link}
                  href={`/keys/${key.id}`}
                >
                  {key.name}
                </Anchor>
              </Table.Td>
              <Table.Td>{dayjs(key.createdAt).format("MMM DD, YYYY")}</Table.Td>
              <Table.Td>{key.meta.role}</Table.Td>
              <Table.Td>52,184</Table.Td>
              <Table.Td className="text-right">
                <Anchor
                  className="text-sm"
                  component={Link}
                  href={`/keys/${key.id}`}
                >
                  View Stats
                </Anchor>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      {/* TODO: Add Products */}
      {/* <Space h="xl" />
      <ProductInfo />
      <Space h="xl" />
      <ProductInfo /> */}
    </Container>
  );
}
