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
  Button,
} from "@mantine/core";
import dayjs from "dayjs";
import { useRegistration } from "@/providers/registration";
import { ValidatorType } from "@/db/types/validator";
import { TextEditor } from "@/components/TextEditor";
import { useDisclosure } from "@mantine/hooks";
import { ContractDisplayModal } from "@/components/ContractDisplayModal";

export function SubnetValidatorReview() {
  const { registrationData } = useRegistration();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Box>
      <Title className="text-center my-8 text-2xl">Review Selection</Title>
      <Card className="my-14 pb-8">
        <Title className="text-xl mb-4">
          {registrationData?.validator?.name}
        </Title>
        <Group className="justify-between items-start gap-8">
          <Box className="flex-1">
            <Box className="h-[353px] mb-5 overflow-auto">
              <TextEditor<ValidatorType>
                type="BubbleEditor"
                editable={false}
                html={registrationData?.validator?.description as string}
              />
            </Box>
            <Button onClick={open}>View Accepted Terms</Button>
            <ContractDisplayModal
              services={registrationData?.endpoint?.contract?.services}
              review={true}
              html={registrationData?.endpoint?.contract?.content}
              opened={opened}
              close={close}
            />
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
                {registrationData?.endpoint?.selectedService.currencyType}
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
                {registrationData?.endpoint?.selectedService.price}
              </Text>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">Request Limit</Text>
              <Text className="text-sm">
                {registrationData?.endpoint?.selectedService.remaining}
              </Text>
            </Group>
            <Group className="justify-between items-center">
              <Text className="text-sm">Limit</Text>
              <Text className="text-sm">
                {registrationData?.endpoint?.selectedService.limit}
              </Text>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">Refill Interval</Text>
              <Text className="text-sm">
                {registrationData?.endpoint?.selectedService.refillInterval}
              </Text>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">Refill Rate</Text>
              <Text className="text-sm">
                {registrationData?.endpoint?.selectedService.refillRate}
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
