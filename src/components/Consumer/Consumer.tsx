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
import { getKey } from "@/actions/keys";
import { EndpointType } from "@/db/types/endpoint";
import { ValidatorType } from "@/db/types/validator";
import Loading from "@/app/(auth)/loading";
import { useRouter } from "next/navigation";
import { UserType } from "@/db/types/user";

type SubscriptionEndpointValidatorType = SubscriptionType & {
  keyId: string;
  endpoint: EndpointType;
};

export function Consumer({
  subscriptions,
  validators,
  user,
}: {
  user: UserType;
  subscriptions: SubscriptionType &
    {
      keyId: string;
      endpoint: EndpointType;
    }[];
  validators: Array<ValidatorType>;
}) {
  const [subscriptionData, setSubscriptionData] = useState<
    SubscriptionEndpointValidatorType[] | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchKeys = async () => {
      const validatorsMap = new Map();
      for (const sub of subscriptions) {
        const { result: keyData } = await getKey({
          keyId: sub.keyId as string,
        });
        const validatorId = sub.endpoint.validator.id;
        if (!validatorsMap.has(validatorId)) {
          validatorsMap.set(validatorId, {
            ...sub.endpoint.validator,
            subscriptions: [],
          });
        }
        const validator = validatorsMap.get(validatorId);
        validator.subscriptions.push({
          ...sub,
          keyData,
        });
      }

      setSubscriptionData(Array.from(validatorsMap.values()));
      setIsLoading(false);
    };

    fetchKeys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subscriptions]);

  return isLoading ? (
    <Loading />
  ) : (
    <Container className="mx-0 px-0 max-w-6xl">
      {!validators && (
        <Notification title="No Validators Found">
          To obtain a key, their needs to be at least one validator available.
        </Notification>
      )}

      {!isLoading && (
        <Group className="justify-between mb-10">
          <Title className="text-2xl">Api Keys</Title>
          <Box>
            <Button component="a" href="/registration">
              {!subscriptionData ? "Register" : "Browse Subnets"}
            </Button>
            {subscriptionData?.length! > 0 && (
              <Button
                variant="outline"
                className="ml-2"
                component="a"
                href={`/dashboard/${user?.id}/consumer-payment-dashboard`}
              >
                Insights
              </Button>
            )}
          </Box>
        </Group>
      )}

      {!isLoading && isEmpty(subscriptionData) && (
        <Alert
          className="mb-8 shadow-sm"
          color="orange"
          icon={<IconAlertCircle />}
        >
          <Text className="mb-2 text-base">
            You don&apos;t have any subscriptions yet. Browse available subnets,
          </Text>
          <Text className="mb-2 text-base">
            subscribe to your favorite validators and start receiving data.
          </Text>
        </Alert>
      )}

      {!isLoading &&
        subscriptionData &&
        subscriptionData.length > 0 &&
        subscriptionData.map((validator: any) => (
          <Fragment key={validator?.id}>
            <Title order={2}>{validator?.name}</Title>
            <Table.ScrollContainer minWidth={700}>
              <Table className="mt-3 mb-6">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Domain</Table.Th>
                    <Table.Th>Validator</Table.Th>
                    <Table.Th>Created</Table.Th>
                    <Table.Th>Role</Table.Th>
                    <Table.Th>Request</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {validator?.subscriptions?.map?.((subscription) => (
                    <Table.Tr key={subscription?.id}>
                      <Table.Td>
                        <Anchor
                          className="font-semibold text-black"
                          component={Link}
                          href={`/keys/${subscription?.keyData?.id}`}
                        >
                          {subscription?.keyData?.name}
                        </Anchor>
                      </Table.Td>
                      <Table.Td>{subscription?.consumerApiUrl}</Table.Td>
                      <Table.Td>
                        {subscription?.endpoint?.validator?.name}
                      </Table.Td>
                      <Table.Td>
                        {dayjs(subscription?.keyData?.createdAt).format(
                          "MMM DD, YYYY"
                        )}
                      </Table.Td>
                      <Table.Td>{subscription?.keyData?.meta?.type}</Table.Td>
                      <Table.Td>{subscription?.keyData?.remaining}</Table.Td>
                      <Table.Td className="text-right">
                        <Anchor
                          className="text-sm"
                          component={Link}
                          href={`/keys/${subscription?.keyData?.id}`}
                        >
                          View Subscription
                        </Anchor>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Fragment>
        ))}
    </Container>
  );
}
