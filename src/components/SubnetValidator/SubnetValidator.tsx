"use client";

import { useEffect, useState } from "react";
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

import { ValidatorType } from "@/db/types/validator";

import { useRegistration, RegistrationData } from "@/providers/registration";

//TODO: uptime, v-trust and latency data for each validator
export function SubnetValidator({
  subnet,
  validators,
  mode,
}: {
  mode: "navigation" | "registration";
  subnet: {
    endpoints: any;
    id: string;
    label: string;
    value: string;
  };
  validators?: Array<ValidatorType>;
}) {
  const { updateData, registrationData } = useRegistration();
  const [filteredValidators, setFilteredValidators] = useState<
    Array<ValidatorType>
  >(validators || []);

  useEffect(() => {
    if (registrationData?.subnet?.endpoints) {
      const updatedValidators = registrationData.subnet.endpoints.flatMap(
        (endpoint: any) => endpoint.validators
      );
      setFilteredValidators(updatedValidators);
    }
  }, [registrationData]);

  const handleSubscribeClick = (validator: ValidatorType) => {
    updateData({ validator } as RegistrationData);
  };

  return (
    <Box>
      <Title className="text-2xl text-center my-8">
        Choose a Validator for {subnet?.label} Subnet
      </Title>
      <Grid>
        {filteredValidators?.map((validator) => (
          <Grid.Col key={validator.id} span={3}>
            <Card>
              <Text className="font-bold mb-4">
                {validator?.name || "Validator"}
              </Text>

              <Group className="justify-between items-center mb-2">
                <Text className="text-sm">Subnets:</Text>
                <Badge size="sm" variant="light">
                  {validator?.endpoints?.length}
                </Badge>
              </Group>
              <Group className="justify-between items-center mb-2">
                <Text className="text-sm">Latency:</Text>
                <Badge size="sm" variant="light">
                  0.8 ms
                </Badge>
              </Group>
              <Group className="justify-between items-center mb-2">
                <Text className="text-sm">Uptime:</Text>
                <Badge size="sm" variant="light">
                  90%
                </Badge>
              </Group>
              <Group className="justify-between items-center mb-4">
                <Text className="text-sm">Vtrust:</Text>
                <Badge size="sm" variant="light">
                  {validator?.vtrust || "High"}
                </Badge>
              </Group>

              <Text className="text-xs mb-4">{validator?.description}</Text>

              <Button
                disabled={!validator?.verified}
                variant={
                  registrationData?.validator === validator ? "" : "outline"
                }
                fullWidth
                onClick={() => handleSubscribeClick(validator)}
              >
                {!validator?.verified ? 'Not Available' : 'Subscribe'}
              </Button>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
}
