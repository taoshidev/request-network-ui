"use client";

import { useCallback } from "react";
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
} from "@mantine/core";
import dayjs from "dayjs";
import { useRegistration } from "@/providers/registration";
import { ValidatorType, ValidatorWithInfo } from "@/db/types/validator";
import { SubnetType } from "@/db/types/subnet";
import { SubscriptionType } from "@/db/types/subscription";
import clsx from "clsx";
import { EndpointType } from "@/db/types/endpoint";
import { ServiceType } from "@/db/types/service";
import { IconAlertTriangle, IconCircleCheck } from "@tabler/icons-react";

export function SubnetValidator({
  currentSubscriptions,
  subnet,
  validators,
  mode,
}: {
  mode: "navigation" | "registration";
  subnet: SubnetType;
  validators?: ValidatorWithInfo[];
  currentSubscriptions?: SubscriptionType[];
}) {
  const { updateData, registrationData } = useRegistration();

  const handleSubscribeClick = useCallback(
    (validator: ValidatorType) => {
      if (registrationData?.validator?.id === validator.id) {
        updateData({ validator: null });
      } else {
        updateData({ validator });
      }
    },
    [updateData, registrationData?.validator?.id]
  );

  const checkFreeService = (endpoints?: EndpointType[] | null) => {
    return (endpoints ? endpoints : [])?.some((endpoint: EndpointType) =>
      endpoint.contract?.services?.some(
        (service: ServiceType) => +service?.price! === 0
      )
    );
  };

  const hasFreeService = useCallback(
    (endpoints?: EndpointType[] | null) => {
      return (endpoints ? endpoints : [])?.some((endpoint: EndpointType) =>
        endpoint.contract?.services?.some(
          (service: ServiceType) => +service?.price! === 0
        )
      );
    },
    //eslint-disable-next-line
    [currentSubscriptions]
  );

  const buttonText = useCallback(
    (validator: ValidatorType) => {
      const isFree = checkFreeService(validator?.endpoints);
      const isSubscribed = currentSubscriptions?.some(
        (s) => s.endpointId === validator?.endpoints?.[0]?.id && !s.deletedAt
      );
      return isSubscribed
        ? "Subscribed"
        : validator?.verified && (validator?.stripeEnabled || isFree)
        ? "Subscribe"
        : "Not Available";
    },
    [currentSubscriptions]
  );

  return (
    <Box className={clsx("my-8 slide", registrationData.direction)}>
      <Grid>
        {(validators || [])?.map?.((validator: ValidatorWithInfo) => (
          <Grid.Col key={validator.id} span={{ base: 12, md: 6, lg: 4 }}>
            <Box className="p-2">
              <Card
                shadow="sm"
                padding="lg"
                withBorder
                className={clsx(
                  "rn-select",
                  registrationData?.validator?.id === validator.id &&
                    "rn-selected"
                )}
              >
                <Box className="font-bold mb-4">
                  {validator.health?.message?.toLowerCase() === "ok" ? (
                    <IconCircleCheck className="mr-2 float-start text-green-600" />
                  ) : (
                    <IconAlertTriangle className="mr-2 float-start text-red-700" />
                  )}
                  <Text className="font-bold inline-block" truncate>
                    &nbsp;
                    {validator?.name || "Validator"}
                  </Text>
                  {validator.health?.message?.toLowerCase() === "ok" ? (
                    <Badge className="float-end bg-green-600">Online</Badge>
                  ) : (
                    <Badge className="float-end bg-red-700">Offline</Badge>
                  )}
                </Box>
                <Divider className="border-dashed" />
                <Group className="justify-between items-center my-1">
                  <Text className="text-sm">Active:</Text>
                  <Badge size="sm" variant="light">
                    {validator?.neuronInfo?.active?.toString() || "FALSE"}
                  </Badge>
                </Group>
                <Divider className="border-dashed" />
                <Group className="justify-between items-center my-1">
                  <Text className="text-sm">Updated:</Text>
                  <Badge size="sm" variant="light">
                    {dayjs(validator?.neuronInfo?.last_updated).format(
                      "MMM DD, YYYY"
                    ) || "-"}
                  </Badge>
                </Group>
                <Divider className="border-dashed" />
                <Group className="justify-between items-center my-1">
                  <Text className="text-sm">V-Trust:</Text>
                  <Badge size="sm" variant="light">
                    {validator?.neuronInfo?.validator_trust?.toString() || "-"}
                  </Badge>
                </Group>
                <Divider className="border-dashed" />
                <Group className="justify-between items-center my-1">
                  <Text className="text-sm">Trust:</Text>
                  <Badge size="sm" variant="light">
                    {validator?.neuronInfo?.trust?.toString() || "-"}
                  </Badge>
                </Group>
                <Divider className="border-dashed" />
                <Group className="justify-between items-center my-1">
                  <Text className="text-sm">Endpoints:</Text>
                  <Badge size="sm" variant="light">
                    {validator?.endpoints?.length}
                  </Badge>
                </Group>
                <Divider className="border-dashed" />
                <Group className="justify-between items-center my-1">
                  <Text className="text-sm">Consensus:</Text>
                  <Badge size="sm" variant="light">
                    {validator?.neuronInfo?.consensus?.toString() || "-"}
                  </Badge>
                </Group>
                <Divider className="border-dashed" />
                <Group className="justify-between items-center my-1">
                  <Text className="text-sm">Dividends:</Text>
                  <Badge size="sm" variant="light">
                    {validator?.neuronInfo?.dividends?.toString() || "-"}
                  </Badge>
                </Group>
                <Divider className="border-dashed" />
                <Group className="justify-between items-center my-1">
                  <Text className="text-sm">Emission:</Text>
                  <Badge size="sm" variant="light">
                    {validator?.neuronInfo?.emission?.toString() || "-"}
                  </Badge>
                </Group>
                <Divider className="border-dashed" />
                <Group className="justify-between items-center my-1">
                  <Text className="text-sm">Incentive:</Text>
                  <Badge size="sm" variant="light">
                    {validator?.neuronInfo?.incentive?.toString() || "-"}
                  </Badge>
                </Group>
                <Divider className="border-dashed" />
                <Group className="justify-between items-center my-1">
                  <Text className="text-sm">Rank:</Text>
                  <Badge size="sm" variant="light">
                    {validator?.neuronInfo?.rank?.toString() || "-"}
                  </Badge>
                </Group>
                <Divider className="border-dashed mb-5" />
                <Button
                  disabled={
                    !validator?.verified ||
                    !(
                      validator?.stripeEnabled ||
                      hasFreeService(validator?.endpoints)
                    )
                  }
                  variant={
                    registrationData &&
                    registrationData?.validator?.id === validator.id
                      ? ""
                      : "outline"
                  }
                  fullWidth
                  onClick={() => handleSubscribeClick(validator)}
                >
                  {buttonText(validator)}
                </Button>
              </Card>
            </Box>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
}
