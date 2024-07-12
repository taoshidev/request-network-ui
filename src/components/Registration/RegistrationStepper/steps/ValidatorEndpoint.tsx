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
  Divider,
  Alert,
} from "@mantine/core";
import dayjs from "dayjs";
import { useRegistration } from "@/providers/registration";
import { EndpointType } from "@/db/types/endpoint";
import { SubscriptionType } from "@/db/types/subscription";
import { useDisclosure } from "@mantine/hooks";
import { ContractDisplayModal } from "../ContractDisplayModal";
import clsx from "clsx";
import { ServiceType } from "@/db/types/service";
import { IconAlertCircle } from "@tabler/icons-react";
import { PAYMENT_TYPE } from "@/interfaces/enum/payment-type-enum";
import { constructEndpointUrl } from "@/utils/endpoint-url";

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
        (s) => s.endpointId === endpoint?.id && !s.deletedAt
      );
      const isEnabled =
        endpoint?.enabled && (stripeEnabled || hasFreeService(endpoint));
      const termsAccepted = endpoint?.termsAccepted;
      return !isEnabled || isAlreadySubscribed || !termsAccepted;
    },
    [currentSubscriptions, registrationData?.validator?.stripeEnabled]
  );

  const buttonText = useCallback(
    (endpoint: EndpointType) => {
      const isSubscribed = currentSubscriptions?.some(
        (s) => s.endpointId === endpoint.id && !s.deletedAt
      );
      return isSubscribed
        ? "Subscribed"
        : endpoint?.enabled &&
          (registrationData?.validator?.stripeEnabled ||
            hasFreeService(endpoint))
        ? "Subscribe"
        : "Not Available";
    },
    [currentSubscriptions, registrationData?.validator?.stripeEnabled]
  );

  const handleAcceptTerms = useCallback(
    (endpoint, { termsAccepted, selectedService }) => {
      endpoint.termsAccepted = termsAccepted;
      endpoint.selectedService = selectedService;
      if (selectedService.paymentType === PAYMENT_TYPE.PAY_PER_REQUEST) {
        const hasPreviouslySubscribed = currentSubscriptions?.some(
          (s) =>
            s.endpointId === endpoint.id && s.serviceId === selectedService.id
        );
        if (hasPreviouslySubscribed) {
          endpoint.selectedService.remaining = 0;
        }
      }
      setTimeout(() => handleSubscribeClick(endpoint), 500);
    },
    //eslint-disable-next-line react-hooks/exhaustive-deps
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
          validator={registrationData?.validator!}
          subscribedServiceId={
            currentSubscriptions?.find(
              (s) => s.endpointId === selectedEndpoint?.id && !s?.deletedAt
            )?.serviceId!
          }
          html={selectedEndpoint?.contract?.content}
          opened={opened}
          close={close}
          review={currentSubscriptions?.some(
            (s) => s.endpointId === selectedEndpoint?.id && !s.deletedAt
          )}
          onTermsAccepted={({ termsAccepted, selectedService }) =>
            handleAcceptTerms(selectedEndpoint, {
              termsAccepted,
              selectedService,
            })
          }
        />
        {!registrationData?.validator?.endpoints?.length ? (
          <Alert
            className={clsx(
              "w-full mt-8 shadow-sm slide",
              registrationData?.direction
            )}
            color="orange"
            icon={<IconAlertCircle />}
          >
            <Text className="mb-2 text-base">
              There are no endpoints available for{" "}
              {registrationData?.validator?.name} at the moment. Please check
              back soon!
            </Text>
          </Alert>
        ) : (
          registrationData?.validator?.endpoints?.map(
            (endpoint: EndpointType) => (
              <Grid.Col key={endpoint.id} span={{ base: 12, md: 6, lg: 4 }}>
                <Box className="p-2">
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
                      {constructEndpointUrl(
                        endpoint?.url,
                        endpoint?.percentRealtime
                      )}
                    </Text>
                    <Divider className="border-dashed" />
                    <Group className="justify-between items-center my-2">
                      <Text className="text-sm">Date Created</Text>
                      <Badge size="sm" variant="light">
                        {dayjs(endpoint?.createdAt).format("MMM DD, YYYY") ||
                          "-"}
                      </Badge>
                    </Group>
                    <Divider className="border-dashed" />
                    <Group className="justify-between items-center my-2">
                      <Text className="text-sm">Last Updated</Text>
                      <Badge size="sm" variant="light">
                        {dayjs(endpoint?.updatedAt).format("MMM DD, YYYY") ||
                          "-"}
                      </Badge>
                    </Group>
                    <Divider className="border-dashed" />
                    <Group className="justify-between items-center my-2">
                      <Text className="text-sm">Status:</Text>
                      <Badge size="sm" variant="light">
                        {endpoint?.enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </Group>
                    <Divider className="border-dashed" />
                    <Group className="justify-between items-center my-2">
                      <Text className="text-sm">Active:</Text>
                      <Badge size="sm" variant="light">
                        {endpoint?.active ? "Yes" : "No"}
                      </Badge>
                    </Group>
                    <Divider className="border-dashed" />
                    <Box className="mt-6 grid grid-cols-2 gap-4 justify-items-stretch">
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
                </Box>
              </Grid.Col>
            )
          )
        )}
      </Grid>
    </Box>
  );
}
