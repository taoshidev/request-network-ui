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
              Aliquip laborum id enim minim dolore cillum et aute ex et minim
              Lorem nisi nostrud non. Nisi ut irure mollit occaecat duis
              consequat eu laborum. Do mollit non do in Lorem culpa consectetur.
              Nostrud voluptate nulla aute.
            </Text>
            <Text className="text-sm">
              Consequat velit enim anim velit nostrud et in. Commodo consequat
              velit ad non incididunt enim culpa eiusmod exercitation labore
              tempor.
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
              <Text className="text-sm">Vtrust</Text>
              <Text className="text-sm">
                {registrationData?.validator.vtrust || "HIGH"}
              </Text>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">Latency</Text>
              <Text className="text-sm">0.8ms</Text>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">Uptime</Text>
              <Text className="text-sm">90%</Text>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">Refill Rate</Text>
              <Text className="text-sm">
                {registrationData?.subnet?.endpoints?.[0].refillRate}
              </Text>
            </Group>
          </Stack>
        </Group>
      </Card>
    </Box>
  );
}
