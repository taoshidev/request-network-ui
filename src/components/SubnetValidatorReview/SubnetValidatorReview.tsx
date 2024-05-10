"use client";

import {
  Title,
  Box,
  Badge,
  Card,
  Group,
  Text,
  Stack,
  Divider,
} from "@mantine/core";
import dayjs from "dayjs";
import { useRegistration } from "@/providers/registration";
export function SubnetValidatorReview() {
  const { registrationData } = useRegistration();

  return (
    <Box>
      <Title className="text-center my-8 text-2xl">Review Selection</Title>
      <Card className="my-14 pb-8">
        <Title className="text-xl mb-4">
          {registrationData?.validator?.name}
        </Title>
        <Group className="justify-between items-start gap-8">
          <Box className="flex-1">
            <Text className="text-sm mb-4">
              {registrationData?.validator?.description}
            </Text>
          </Box>
          <Stack className="flex-1 gap-2">
            <Group className="justify-between items-center text-sm">
              <Text className="text-sm">Subnet</Text>
              <Text className="text-sm">{registrationData?.subnet?.label}</Text>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">Verified</Text>
              <Box>
                {registrationData?.validator?.verified ? (
                  <Badge>Verified</Badge>
                ) : (
                  <Badge color="black">Unverified</Badge>
                )}
              </Box>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">Endpoint</Text>
              <Text className="text-sm">{registrationData?.endpoint?.url}</Text>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">Payment Method</Text>
              <Text className="text-sm">
                {registrationData?.endpoint?.currencyType}
              </Text>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">V-Trust</Text>
              <Text className="text-sm">
                {registrationData?.validator?.neuronInfo?.validator_trust ||
                  "LOW"}
              </Text>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">Price</Text>
              <Text className="text-sm">
                {registrationData?.endpoint?.price}
              </Text>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">Request Limit</Text>
              <Text className="text-sm">
                {registrationData?.endpoint?.remaining}
              </Text>
            </Group>
            <Group className="justify-between items-center">
              <Text className="text-sm">Limit</Text>
              <Text className="text-sm">
                {registrationData?.endpoint?.limit}
              </Text>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">Refill Interval</Text>
              <Text className="text-sm">
                {registrationData?.endpoint?.refillInterval}
              </Text>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">Refill Rate</Text>
              <Text className="text-sm">
                {registrationData?.endpoint?.refillRate}
              </Text>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">Expiry</Text>
              <Text className="text-sm">
                {dayjs(registrationData?.endpoint?.expires).format(
                  "MMM DD, YYYY"
                )}
              </Text>
            </Group>
          </Stack>
        </Group>
      </Card>
    </Box>
  );
}
