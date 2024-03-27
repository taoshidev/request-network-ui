"use client";

import { useEffect, useState } from "react";
import { Title, Text, Box, Grid, Card, Badge, Button } from "@mantine/core";

import styles from "./subnet-validator.module.css";
import { ValidatorType } from "@/actions/validators";
import {
  useRegistration,
  RegistrationData,
} from "@/providers/registration-provider";

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
      <Title my="xl" order={2} ta="center">
        Choose a Validator for {subnet?.label} Subnet
      </Title>
      <Grid>
        {filteredValidators?.map((validator) => (
          <Grid.Col key={validator.id} span={3}>
            <Card radius="sm" className={styles.card}>
              <Text ta="center" size="lg" fw={500} style={{ marginBottom: 15 }}>
                {validator?.name || "Validator"}
              </Text>

              <Box className={styles.statItem}>
                <Text>Subnets:</Text>
                <Badge color="orange" variant="outline">
                  {validator?.endpoints?.length}
                </Badge>
              </Box>
              <Box className={styles.statItem}>
                <Text>Latency:</Text>
                <Badge color="orange" variant="outline">
                  0.8 ms
                </Badge>
              </Box>
              <Box className={styles.statItem}>
                <Text>Uptime:</Text>
                <Badge color="orange" variant="outline">
                  90%
                </Badge>
              </Box>
              <Box className={styles.statItem}>
                <Text>Vtrust:</Text>
                <Badge color="orange" variant="outline">
                  {validator?.vtrust || "High"}
                </Badge>
              </Box>

              <Text size="sm" style={{ marginTop: 10, marginBottom: 10 }}>
                {validator?.description}
              </Text>

              <Button
                variant={
                  registrationData?.validator === validator ? "" : "outline"
                }
                fullWidth
                onClick={() => handleSubscribeClick(validator)}
              >
                Subscribe
              </Button>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </Box>
  );
}
