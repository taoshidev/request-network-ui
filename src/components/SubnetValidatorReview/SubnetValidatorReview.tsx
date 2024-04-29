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
          {registrationData?.validator.name}
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
              <Text className="text-sm">{registrationData?.subnet.label}</Text>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">Verified</Text>
              <Box>
                {registrationData?.validator.verified ? (
                  <Badge>Verified</Badge>
                ) : (
                  <Badge color="black">Unverified</Badge>
                )}
              </Box>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">V-Trust</Text>
              <Text className="text-sm">
                {registrationData?.validator.validator_trust || "LOW"}
              </Text>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">Price</Text>
              <Text className="text-sm">
                {registrationData?.validator?.selectedEndpoint?.price || "-"}
              </Text>
            </Group>
            <Group className="justify-between items-center">
              <Text className="text-sm">Limit</Text>
              <Text className="text-sm">
                {registrationData?.validator?.selectedEndpoint?.limit || "-"}
              </Text>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">Refill Interval</Text>
              <Text className="text-sm">
                {registrationData?.validator?.selectedEndpoint
                  ?.refillInterval || "-"}
              </Text>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">Refill Rate</Text>
              <Text className="text-sm">
                {registrationData?.validator?.selectedEndpoint?.refillRate}
              </Text>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">Expiry</Text>
              <Text className="text-sm">
                {dayjs(
                  registrationData?.validator?.selectedEndpoint?.expires
                ).format("MMM DD, YYYY") || "-"}
              </Text>
            </Group>
          </Stack>
        </Group>
      </Card>
    </Box>
  );
}
