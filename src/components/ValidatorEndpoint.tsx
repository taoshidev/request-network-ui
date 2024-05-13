"use client";

import { useCallback, useState } from "react";
import {
  Title,
  Text,
  Box,
  Grid,
  Card,
  Badge,
  Button,
  Group,
} from "@mantine/core";
import dayjs from "dayjs";
import { useRegistration } from "@/providers/registration";
import { EndpointType } from "@/db/types/endpoint";
import { SubscriptionType } from "@/db/types/subscription";
import { useDisclosure } from "@mantine/hooks";
import { ContractDisplayModal } from "@/components/ContractDisplayModal";

export function ValidatorEndpoint({
  currentSubscriptions,
}: {
  currentSubscriptions?: SubscriptionType[];
}) {
  const { updateData, registrationData } = useRegistration();
  const [selectedEndpoint, setSelectedEndpoint] = useState<EndpointType | null>(
    null
  );
  const [opened, { open, close }] = useDisclosure(false);

  const handleSubscribeClick = useCallback(
    (endpoint: EndpointType) => {
      if (registrationData?.endpoint?.id === endpoint.id) {
        updateData({ endpoint: null });
      } else {
        updateData({ endpoint });
      }
    },
    [updateData, registrationData?.endpoint?.id]
  );

  const disabled = useCallback(
    (endpoint: EndpointType) => {
      const isAlreadySubscribed = currentSubscriptions?.some(
        (s) => s.endpointId === endpoint?.id
      );
      const isEnabled = endpoint?.enabled;
      const termsAccepted = endpoint?.termsAccepted;
      console.log(isAlreadySubscribed, isEnabled, termsAccepted);
      return !isEnabled || isAlreadySubscribed || !termsAccepted;
    },
    [currentSubscriptions]
  );

  const buttonText = useCallback(
    (endpoint: EndpointType) => {
      const isSubscribed = currentSubscriptions?.some(
        (s) => s.endpointId === endpoint.id
      );
      return isSubscribed
        ? "Subscribed"
        : endpoint?.enabled
        ? "Subscribe"
        : "Not Available";
    },
    [currentSubscriptions]
  );

  const handleAcceptTerms = useCallback((endpoint, { termsAccepted }) => {
    endpoint.termsAccepted = termsAccepted;
  }, []);

  const openContractModal = (endpoint) => {
    setSelectedEndpoint(endpoint);
    open();
  };

  return (
    <Box>
      <Title className="text-2xl text-center my-8">
        Choose an Endpoint for {registrationData?.validator?.name} Subnet
      </Title>
      <Grid>
        <ContractDisplayModal
          html={selectedEndpoint?.contract?.content}
          opened={opened}
          close={close}
          review={currentSubscriptions?.some(
            (s) => s.endpointId === selectedEndpoint?.id
          )}
          onTermsAccepted={({ termsAccepted }) =>
            handleAcceptTerms(selectedEndpoint, { termsAccepted })
          }
        />

        {registrationData?.validator?.endpoints?.map(
          (endpoint: EndpointType) => (
            <Grid.Col key={endpoint.id} span={3}>
              <Card>
                <Text className="font-bold mb-4" truncate>
                  {endpoint?.url || "-"}
                </Text>
                <Group className="justify-between items-center mb-2">
                  <Text className="text-sm">Currency</Text>
                  <Badge size="sm" variant="light">
                    {endpoint?.currencyType}
                  </Badge>
                </Group>
                <Group className="justify-between items-center mb-2">
                  <Text className="text-sm">Expires:</Text>
                  <Badge size="sm" variant="light">
                    {dayjs(endpoint?.expires).format("MMM DD, YYYY") || "-"}
                  </Badge>
                </Group>
                <Group className="justify-between items-center mb-2">
                  <Text className="text-sm">Payment Method:</Text>
                  <Badge size="sm" variant="light">
                    {endpoint?.currencyType}
                  </Badge>
                </Group>
                <Group className="justify-between items-center mb-2">
                  <Text className="text-sm">Price:</Text>
                  <Badge size="sm" variant="light">
                    {endpoint?.price}
                  </Badge>
                </Group>
                <Group className="justify-between items-center mb-2">
                  <Text className="text-sm">Refill Interval:</Text>
                  <Badge size="sm" variant="light">
                    {endpoint.refillInterval}
                  </Badge>
                </Group>
                <Group className="justify-between items-center mb-2">
                  <Text className="text-sm">Limit:</Text>
                  <Badge size="sm" variant="light">
                    {endpoint?.limit}
                  </Badge>
                </Group>
                <Group className="justify-between items-center mb-2">
                  <Text className="text-sm">Refill Rate:</Text>
                  <Badge size="sm" variant="light">
                    {endpoint.refillRate}
                  </Badge>
                </Group>
                <Group className="justify-between items-center mb-2">
                  <Text className="text-sm">Request Limit</Text>
                  <Badge size="sm" variant="light">
                    {endpoint?.remaining}
                  </Badge>
                </Group>
                <Box className="mt-4 flex flex-row justify-between items-center">
                  <Button
                    variant="outline"
                    onClick={() => openContractModal(endpoint)}
                  >
                    Agreement
                  </Button>
                  <Button
                    disabled={disabled(endpoint)}
                    variant={
                      registrationData &&
                      registrationData?.endpoint?.id === endpoint.id
                        ? ""
                        : "outline"
                    }
                    onClick={() => handleSubscribeClick(endpoint)}
                  >
                    {buttonText(endpoint)}
                  </Button>
                </Box>
              </Card>
            </Grid.Col>
          )
        )}
      </Grid>
    </Box>
  );
}
