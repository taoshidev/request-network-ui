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
import clsx from "clsx";
import { ServiceType } from "@/db/types/service";

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

  const hasFreeService = (endpoint: EndpointType | null) => {
    return endpoint?.contract?.services?.some(
      (service: ServiceType) => +service?.price! === 0
    );
  };

  const disabled = useCallback(
    (endpoint: EndpointType) => {
      const stripeEnabled = registrationData?.validator?.stripeEnabled;
      const isAlreadySubscribed = currentSubscriptions?.some(
        (s) => s.endpointId === endpoint?.id
      );
      const isEnabled =
        endpoint?.enabled && (stripeEnabled || hasFreeService(endpoint));
      const termsAccepted = endpoint?.termsAccepted;
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
        : endpoint?.enabled &&
          (registrationData?.validator?.stripeEnabled ||
            hasFreeService(endpoint))
        ? "Subscribe"
        : "Not Available";
    },
    [currentSubscriptions]
  );

  const handleAcceptTerms = useCallback(
    (endpoint, { termsAccepted, selectedService }) => {
      endpoint.termsAccepted = termsAccepted;
      endpoint.selectedService = selectedService;
    },
    []
  );

  const openContractModal = (endpoint) => {
    setSelectedEndpoint(endpoint);
    open();
  };

  return (
    <Box className={clsx("mt-8 slide", registrationData.direction)}>
      <Grid>
        <ContractDisplayModal
          services={
            registrationData?.validator?.endpoints?.find(
              (e) => e.id === selectedEndpoint?.id
            )?.contract?.services
          }
          subscribedServiceId={
            currentSubscriptions?.find(
              (s) => s.endpointId === selectedEndpoint?.id
            )?.serviceId!
          }
          html={selectedEndpoint?.contract?.content}
          opened={opened}
          close={close}
          review={currentSubscriptions?.some(
            (s) => s.endpointId === selectedEndpoint?.id
          )}
          onTermsAccepted={({ termsAccepted, selectedService }) =>
            handleAcceptTerms(selectedEndpoint, {
              termsAccepted,
              selectedService,
            })
          }
        />

        {registrationData?.validator?.endpoints?.map(
          (endpoint: EndpointType) => (
            <Grid.Col key={endpoint.id} span={3}>
              <Card
                shadow="sm"
                padding="lg"
                withBorder
                className={clsx(
                  "rn-select",
                  registrationData?.endpoint?.id === endpoint.id &&
                    "rn-selected"
                )}
              >
                <Text className="font-bold mb-4" truncate>
                  {endpoint?.url || "-"}
                </Text>
                <Group className="justify-between items-center mb-2">
                  <Text className="text-sm">Date Created</Text>
                  <Badge size="sm" variant="light">
                    {dayjs(endpoint?.createdAt).format("MMM DD, YYYY") || "-"}
                  </Badge>
                </Group>
                <Group className="justify-between items-center mb-2">
                  <Text className="text-sm">Last Updated</Text>
                  <Badge size="sm" variant="light">
                    {dayjs(endpoint?.updatedAt).format("MMM DD, YYYY") || "-"}
                  </Badge>
                </Group>
                <Group className="justify-between items-center mb-2">
                  <Text className="text-sm">Status:</Text>
                  <Badge size="sm" variant="light">
                    {endpoint?.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </Group>
                <Group className="justify-between items-center mb-2">
                  <Text className="text-sm">Active:</Text>
                  <Badge size="sm" variant="light">
                    {endpoint?.active ? "Yes" : "No"}
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
