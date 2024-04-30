"use client";

import { useState, useEffect, Fragment } from "react";
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
  Anchor,
  Notification,
} from "@mantine/core";
import { isEmpty } from "lodash";
import dayjs from "dayjs";
import { IconAlertCircle } from "@tabler/icons-react";
import { SubscriptionType } from "@/db/types/subscription";
import { getUserAPIKeys } from "@/actions/keys";
import { EndpointType } from "@/db/types/endpoint";
import { ValidatorType } from "@/db/types/validator";

type SubscriptionEndpointValidatorType = SubscriptionType & { keys: any } & {
  endpoint: EndpointType & { validators: ValidatorType };
};

export function Consumer({
  subscriptions,
  validators,
}: {
  subscriptions: SubscriptionEndpointValidatorType[];
  validators: Array<ValidatorType>;
}) {
  const [subscriptionData, setSubscriptionData] = useState<
    SubscriptionEndpointValidatorType[] | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKeys = async () => {
      const updatedSubscriptions: SubscriptionEndpointValidatorType[] = [];

      for (const sub of subscriptions) {
        const { result } = await getUserAPIKeys({
          apiId: sub?.endpoint?.validators?.apiId as string,
          ownerId: sub?.userId!,
        });
        const updatedSub = { ...sub, ...result } as any;
        updatedSubscriptions.push(updatedSub);
      }

      setSubscriptionData(updatedSubscriptions);
      setIsLoading(false);
    };

    fetchKeys();
  }, [subscriptions]);

  return (
    <Container className="my-8">
      {!validators && (
        <Notification title="No Validators Found">
          To obtain a key, their needs to be at least one validator available.
        </Notification>
      )}

      {!isLoading && (
        <Group className="justify-between my-5">
          <Title className="text-2xl">API Keys</Title>
          <Box>
            <Button component="a" href="/registration">
              {!subscriptionData ? "Register" : "Browse Subnets"}
            </Button>
          </Box>
        </Group>
      )}

      {!isLoading && isEmpty(subscriptionData) && (
        <Alert className="mb-8" color="orange" icon={<IconAlertCircle />}>
          <Text className="mb-2">You don&apos;t have any API Keys yet</Text>
          <Text>Create your first API key and start receiving requests.</Text>
        </Alert>
      )}

      {(subscriptionData || []).map((subscription, index) => (
        <Fragment key={index}>
          <Title order={2}>{subscription.endpoint.validators.name}</Title>
          <Table className="mt-3 mb-6">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Created</Table.Th>
                <Table.Th>Role</Table.Th>
                <Table.Th>Request</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {(subscription?.keys || []).map((key: any) => (
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
                  <Table.Td>
                    {dayjs(key.createdAt).format("MMM DD, YYYY")}
                  </Table.Td>
                  <Table.Td>{key.meta.type}</Table.Td>
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
        </Fragment>
      ))}
      {/* TODO: Add Products */}
      {/* <Space h="xl" />
      <ProductInfo />
      <Space h="xl" />
      <ProductInfo /> */}
    </Container>
  );
}
