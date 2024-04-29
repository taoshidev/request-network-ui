"use client";

import { useEffect, useState, useCallback } from "react";
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
  validators?: ValidatorType[];
  currentSubscriptions?: SubscriptionType[];
}) {
  const { updateData, registrationData } = useRegistration();
  const [filteredValidators, setFilteredValidators] = useState<ValidatorType[]>(
    validators || []
  );

  useEffect(() => {
    if (registrationData?.subnet?.endpoints) {
      const updatedValidators = registrationData.subnet.endpoints.flatMap(
        (endpoint: EndpointType) => endpoint?.validators
      );
      const validatorsWithStats = updatedValidators.map(
        (validator: ValidatorType) => {
          const endpoint = validators
            ?.filter((vali) => vali.id === validator.id)?.[0]
            .endpoints.find(
              (endpoint: EndpointType) =>
                endpoint.subnet === registrationData.subnet.id
            );
          return {
            ...validator,
            selectedEndpoint: endpoint,
            stats: endpoint?.stats,
          };
        }
      );
      setFilteredValidators(validatorsWithStats);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registrationData]);

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

  const disabled = useCallback(
    (validator: ValidatorType) => {
      const isAlreadySubscribed = currentSubscriptions?.some(
        (s) => s.endpointId === validator?.endpoints?.[0]?.id
      );
      const isEnabled = validator?.endpoints?.some(
        (e) => e?.subnet === registrationData?.subnet?.id && e.enabled
      );
      return !validator.verified || !isEnabled || isAlreadySubscribed;
    },
    [currentSubscriptions, registrationData?.subnet?.id]
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
        {filteredValidators?.map((validator: ValidatorType) => (
          <Grid.Col key={validator.id} span={3}>
            <Card>
              <Text className="font-bold mb-4" truncate>
                {validator?.name || "Validator"}
              </Text>
              <Group className="justify-between items-center mb-2">
                <Text className="text-sm">Active:</Text>
                <Badge size="sm" variant="light">
                  {validator?.stats?.active.toString() || "FALSE"}
                </Badge>
              </Group>
              <Group className="justify-between items-center mb-2">
                <Text className="text-sm">Updated:</Text>
                <Badge size="sm" variant="light">
                  {dayjs(validator?.stats?.last_updated).format(
                    "MMM DD, YYYY"
                  ) || "-"}
                </Badge>
              </Group>
              <Group className="justify-between items-center mb-2">
                <Text className="text-sm">V-Trust:</Text>
                <Badge size="sm" variant="light">
                  {validator?.stats?.validator_trust.toString() || "-"}
                </Badge>
              </Group>
              <Group className="justify-between items-center mb-2">
                <Text className="text-sm">Trust:</Text>
                <Badge size="sm" variant="light">
                  {validator?.stats?.trust.toString() || "-"}
                </Badge>
              </Group>
              <Group className="justify-between items-center mb-2">
                <Text className="text-sm">Subnets:</Text>
                <Badge size="sm" variant="light">
                  {validator?.endpoints?.length}
                </Badge>
              </Group>
              <Group className="justify-between items-center mb-2">
                <Text className="text-sm">Consensus:</Text>
                <Badge size="sm" variant="light">
                  {validator?.stats?.consensus.toString() || "-"}
                </Badge>
              </Group>
              <Group className="justify-between items-center mb-2">
                <Text className="text-sm">Dividends:</Text>
                <Badge size="sm" variant="light">
                  {validator?.stats?.dividends.toString() || "-"}
                </Badge>
              </Group>
              <Group className="justify-between items-center mb-2">
                <Text className="text-sm">Emission:</Text>
                <Badge size="sm" variant="light">
                  {validator?.stats?.emission.toString() || "-"}
                </Badge>
              </Group>
              <Group className="justify-between items-center mb-2">
                <Text className="text-sm">Incentive:</Text>
                <Badge size="sm" variant="light">
                  {validator?.stats?.incentive.toString() || "-"}
                </Badge>
              </Group>
              <Group className="justify-between items-center mb-6">
                <Text className="text-sm">Rank:</Text>
                <Badge size="sm" variant="light">
                  {validator?.stats?.rank.toString() || "-"}
                </Badge>
              </Group>

              <Button
                disabled={disabled(validator)}
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
