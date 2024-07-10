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
import { ContractDisplayModal } from "../ContractDisplayModal";
import clsx from "clsx";
import { useModals } from "@mantine/modals";
import { useRef } from "react";
import AgreeTOSModal from "@/components/AgreeTOSModal";
import { UserType } from "@/db/types/user";
import CurrencyFormatter from "@/components/Formatters/CurrencyFormatter";
import FixedFormatter from "@/components/Formatters/FixedFormatter";
import { randomBytes } from "crypto";
import ContractDisplayTierPricing from "../ContractDisplayTierPricing";
import { PAYMENT_TYPE } from "@/interfaces/enum/payment-type-enum";
import { constructEndpointUrl } from "@/utils/endpoint-url";
import { PERCENT_REALTIME_LABEL } from "@/interfaces/enum/percent-realtime-enum";

export function SubnetValidatorReview({ user }: { user: UserType }) {
  const { registrationData } = useRegistration();
  const [opened, { open, close }] = useDisclosure(false);
  const modals = useModals();
  const agreeModalRef = useRef<string | null>(null);
  const tierModalRef = useRef<string | null>(null);

  const viewTOS = () => {
    agreeModalRef.current = `rn-modal-${randomBytes(10).toString("hex")}`;
    agreeModalRef.current = modals.openModal({
      modalId: agreeModalRef.current!,
      centered: true,
      size: "xl",
      title: "Terms of Service Agreement",
      children: (
        <AgreeTOSModal user={user} mode="view" modalRef={agreeModalRef} />
      ),
    });
  };

  const viewTier = () => {
    tierModalRef.current = modals.openModal({
      modalId: tierModalRef.current!,
      centered: true,
      size: "xl",
      onClose: () => modals.closeModal(tierModalRef.current!),
      title:
        registrationData?.endpoint?.selectedService?.name +
        " - Pay Per Request / Tier Pricing",
      children: (
        <ContractDisplayTierPricing
          service={registrationData?.endpoint?.selectedService}
        />
      ),
    });
  };

  return (
    <Box className={clsx("mt-10 slide", registrationData.direction)}>
      <Card withBorder shadow="sm" padding="lg" className="my-14 pb-8">
        <Title className="text-xl mb-4">
          {registrationData?.validator?.name}
        </Title>
        <Group className="flex flex-wrap justify-between items-start gap-8">
          <Box className="flex-none w-full md:flex-1">
            <Box className="h-[353px] mb-5 overflow-auto">
              <TextEditor<ValidatorType>
                type="BubbleEditor"
                editable={false}
                html={registrationData?.validator?.description as string}
              />
            </Box>
            <Box
              className={clsx(
                "grid grid-cols-1 md:grid-cols-1 gap-4 px-4",
                registrationData?.endpoint?.selectedService?.paymentType ===
                  PAYMENT_TYPE.PAY_PER_REQUEST
                  ? "sm:grid-cols-3 lg:grid-cols-3"
                  : "sm:grid-cols-2 lg:grid-cols-2"
              )}
            >
              <Button onClick={open}>View Terms</Button>
              <Button onClick={viewTOS} variant="outline">
                View Taoshi TOS
              </Button>
              {registrationData?.endpoint?.selectedService?.paymentType ===
                PAYMENT_TYPE.PAY_PER_REQUEST && (
                <Button onClick={viewTier} variant="outline">
                  View Tier Pricing
                </Button>
              )}
            </Box>
            <ContractDisplayModal
              services={registrationData?.endpoint?.contract?.services}
              validator={registrationData?.validator!}
              review={true}
              html={registrationData?.endpoint?.contract?.content}
              opened={opened}
              close={close}
            />
          </Box>
          <Stack className="flex-none w-full md:flex-1 gap-2">
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
              <Text className="text-sm">
                {constructEndpointUrl(
                  registrationData?.endpoint?.url,
                  registrationData?.endpoint?.percentRealtime
                )}
              </Text>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">Realtime Tier</Text>
              <Text className="text-sm">
                {
                  PERCENT_REALTIME_LABEL[
                    registrationData?.endpoint?.percentRealtime
                  ]
                }
              </Text>
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
                <CurrencyFormatter
                  price={registrationData?.endpoint?.selectedService.price}
                  currencyType={
                    registrationData?.endpoint?.selectedService?.currencyType
                  }
                />
              </Text>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">Request Limit</Text>
              <Text className="text-sm">
                <FixedFormatter
                  value={registrationData?.endpoint?.selectedService.remaining}
                />
              </Text>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">Limit</Text>
              <Text className="text-sm">
                <FixedFormatter
                  value={registrationData?.endpoint?.selectedService.limit}
                />
              </Text>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">Refill Interval</Text>
              <Text className="text-sm">
                <FixedFormatter
                  value={
                    registrationData?.endpoint?.selectedService.refillInterval
                  }
                />{" "}
                ms
              </Text>
            </Group>
            <Divider className="border-dashed" />
            <Group className="justify-between items-center">
              <Text className="text-sm">Expiry</Text>
              <Text className="text-sm">
                {registrationData?.endpoint?.selectedService?.expires
                  ? dayjs(
                      registrationData?.endpoint?.selectedService?.expires
                    ).format("MMM DD, YYYY")
                  : "No Expiry"}
              </Text>
            </Group>
          </Stack>
        </Group>
      </Card>
    </Box>
  );
}
