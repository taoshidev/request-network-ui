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
} from "@mantine/core";
import dayjs from "dayjs";
import { useRegistration } from "@/providers/registration";
import { ValidatorType } from "@/db/types/validator";
import { SubnetType } from "@/db/types/subnet";
import { SubscriptionType } from "@/db/types/subscription";

export function SubnetValidator({
  currentSubscriptions,
  subnet,
  validators,
  mode,
}: {
  mode: "navigation" | "registration";
  subnet: SubnetType;
  validators?: ValidatorType & { neuronInfo: any }[];
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

  const buttonText = useCallback(
    (validator: ValidatorType) => {
      const isSubscribed = currentSubscriptions?.some(
        (s) => s.endpointId === validator?.endpoints?.[0]?.id
      );
      return isSubscribed
        ? "Subscribed"
        : validator.verified
        ? "Subscribe"
        : "Not Available";
    },
    [currentSubscriptions]
  );

  return (
    <Box>
      <Title className="text-2xl text-center my-8">
        Choose a Validator for {registrationData?.subnet?.label} Subnet
      </Title>
      <Grid>
        {(validators || [])?.map((validator: ValidatorType) => (
          <Grid.Col key={validator.id} span={3}>
            <Card>
              <Text className="font-bold mb-4" truncate>
                {validator?.name || "Validator"}
              </Text>
              <Group className="justify-between items-center mb-2">
                <Text className="text-sm">Active:</Text>
                <Badge size="sm" variant="light">
                  {validator?.neuronInfo?.active!.toString() || "FALSE"}
                </Badge>
              </Group>
              <Group className="justify-between items-center mb-2">
                <Text className="text-sm">Updated:</Text>
                <Badge size="sm" variant="light">
                  {dayjs(validator?.neuronInfo?.last_updated).format(
                    "MMM DD, YYYY"
                  ) || "-"}
                </Badge>
              </Group>
              <Group className="justify-between items-center mb-2">
                <Text className="text-sm">V-Trust:</Text>
                <Badge size="sm" variant="light">
                  {validator?.neuronInfo?.validator_trust!.toString() || "-"}
                </Badge>
              </Group>
              <Group className="justify-between items-center mb-2">
                <Text className="text-sm">Trust:</Text>
                <Badge size="sm" variant="light">
                  {validator?.neuronInfo?.trust!.toString() || "-"}
                </Badge>
              </Group>
              <Group className="justify-between items-center mb-2">
                <Text className="text-sm">Endpoints:</Text>
                <Badge size="sm" variant="light">
                  {validator?.endpoints?.length}
                </Badge>
              </Group>
              <Group className="justify-between items-center mb-2">
                <Text className="text-sm">Consensus:</Text>
                <Badge size="sm" variant="light">
                  {validator?.neuronInfo?.consensus!.toString() || "-"}
                </Badge>
              </Group>
              <Group className="justify-between items-center mb-2">
                <Text className="text-sm">Dividends:</Text>
                <Badge size="sm" variant="light">
                  {validator?.neuronInfo?.dividends!.toString() || "-"}
                </Badge>
              </Group>
              <Group className="justify-between items-center mb-2">
                <Text className="text-sm">Emission:</Text>
                <Badge size="sm" variant="light">
                  {validator?.neuronInfo?.emission!.toString() || "-"}
                </Badge>
              </Group>
              <Group className="justify-between items-center mb-2">
                <Text className="text-sm">Incentive:</Text>
                <Badge size="sm" variant="light">
                  {validator?.neuronInfo?.incentive!.toString() || "-"}
                </Badge>
              </Group>
              <Group className="justify-between items-center mb-6">
                <Text className="text-sm">Rank:</Text>
                <Badge size="sm" variant="light">
                  {validator?.neuronInfo?.rank!.toString() || "-"}
                </Badge>
              </Group>

              <Button
                disabled={!validator.verified}
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
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
}
