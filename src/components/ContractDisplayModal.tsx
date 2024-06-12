import { useCallback, useState } from "react";
import {
  Box,
  Button,
  Card,
  Modal,
  Text,
  Group,
  Badge,
  Divider,
} from "@mantine/core";
import { TextEditor } from "@/components/TextEditor";
import { useNotification } from "@/hooks/use-notification";
import { ContractType } from "@/db/types/contract";
import { useRegistration } from "@/providers/registration";
import { ServiceType } from "@/db/types/service";
import dayjs from "dayjs";
import clsx from "clsx";
import { ValidatorType } from "@/db/types/validator";

export function ContractDisplayModal({
  html,
  opened,
  close,
  onTermsAccepted,
  review = false,
  services,
  validator,
  subscribedServiceId,
}: {
  html: string;
  opened: boolean;
  review?: boolean;
  close: () => void;
  services: ServiceType[];
  validator?: ValidatorType;
  subscribedServiceId?: string;
  onTermsAccepted?: ({
    termsAccepted,
    selectedService,
  }: {
    termsAccepted: boolean;
    selectedService: ServiceType;
  }) => void;
}) {
  const { notifySuccess, notifyInfo, notifyError } = useNotification();
  const { registrationData } = useRegistration();
  const [termsAccepted, setTermsAccepted] = useState<boolean>(
    registrationData?.endpoint?.termsAccepted || false
  );
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    registrationData?.endpoint?.selectedService?.id || null
  );
  const numColumns = Math.min(services?.length, 3);

  const handleAcceptTerms = async (termsAccepted: boolean) => {
    if (!selectedServiceId) {
      notifyInfo("Please select a service before accepting the terms.");
      return;
    }
    if (!termsAccepted) {
      setSelectedServiceId(null);
    }
    notifySuccess(`Terms ${termsAccepted ? "Accepted" : "Declined"}!`);
    setTermsAccepted(termsAccepted);
    onTermsAccepted?.({
      termsAccepted,
      selectedService: services.find(
        (s) => s?.id === selectedServiceId
      ) as ServiceType,
    });
    close();
  };

  const disabled = useCallback(
    (service: ServiceType) => {
      return +service?.price! !== 0 && !validator?.stripeEnabled;
    },
    // eslint-disable-next-line
    [services, validator]
  );

  const handleDisabled = (service: ServiceType) => {
    notifyError(`Service "${service?.name}" is not currently available.`);
  };

  const handleServiceSelect = (serviceId: string) => {
    if (!review) setSelectedServiceId(serviceId);
  };

  return (
    <Modal size="xl" opened={opened} onClose={close} title="Service Contract">
      <Box>
        <Text className="font-bold mb-4 text-center w-full" truncate>
          Select a Service
        </Text>

        <Box
          className="mx-8 mt-8"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${review ? 1 : numColumns}, 1fr)`,
            gap: "16px",
          }}
        >
          {services
            ?.filter(
              (service) =>
                !review ||
                [selectedServiceId, subscribedServiceId].includes(service?.id)
            )
            .map((service) => (
              <Card
                withBorder
                shadow="sm"
                padding="lg"
                key={service?.id}
                className={clsx(
                  "p-1 m-0 cursor-pointer rn-select",
                  disabled(service) && "opacity-70 brightness-95",
                  !review &&
                    !disabled(service) &&
                    "border-2 hover:border-orange-400",
                  !review &&
                    !disabled(service) &&
                    [selectedServiceId, subscribedServiceId].includes(
                      service?.id
                    ) &&
                    "rn-selected",
                  [selectedServiceId, subscribedServiceId].includes(
                    service?.id
                  ) && "border-2 border-orange-400"
                )}
                onClick={
                  disabled(service)
                    ? () => handleDisabled(service)
                    : () => handleServiceSelect(service?.id as string)
                }
              >
                <Group className="justify-between items-center m-2">
                  <Text className="font-bold mb-4 text-center w-full" truncate>
                    {service?.name || "-"}
                  </Text>
                </Group>

                <Group className="justify-between items-center m-2">
                  <Text className="text-xs">Expires:</Text>
                  <Badge size="sm" variant="light">
                    {dayjs(service?.expires).format("MMM DD, YYYY") || "-"}
                  </Badge>
                </Group>
                <Divider className="border-dashed" />

                <Group className="justify-between items-center m-2">
                  <Text className="text-xs">Payment Method:</Text>
                  <Badge size="sm" variant="light">
                    {service?.currencyType}
                  </Badge>
                </Group>
                <Divider className="border-dashed" />

                <Group className="justify-between items-center m-2">
                  <Text className="text-xs">Price:</Text>
                  <Badge size="sm" variant="light">
                    {service?.price}
                  </Badge>
                </Group>
                <Divider className="border-dashed" />

                <Group className="justify-between items-center m-2">
                  <Text className="text-xs">Refill Interval:</Text>
                  <Badge size="sm" variant="light">
                    {service.refillInterval}
                  </Badge>
                </Group>
                <Divider className="border-dashed" />

                <Group className="justify-between items-center m-2">
                  <Text className="text-xs">Limit:</Text>
                  <Badge size="sm" variant="light">
                    {service?.limit}
                  </Badge>
                </Group>
                <Divider className="border-dashed" />

                <Group className="justify-between items-center m-2">
                  <Text className="text-xs">Refill Rate:</Text>
                  <Badge size="sm" variant="light">
                    {service.refillRate}
                  </Badge>
                </Group>
                <Divider className="border-dashed" />

                <Group className="justify-between items-center m-2">
                  <Text className="text-xs">Request Limit</Text>
                  <Badge size="sm" variant="light">
                    {service?.remaining}
                  </Badge>
                </Group>
              </Card>
            ))}
        </Box>

        <Box className="!p-0 flex flex-col">
          <Box className="flex-1 p-4">
            <TextEditor<ContractType>
              type="BubbleEditor"
              editable={false}
              html={html}
            />
          </Box>
        </Box>
      </Box>
      {!review && (
        <Box className="flex justify-between p-4 bg-white border-t border-gray-200 sticky bottom-0 -mb-4 -mx-4">
          <Button
            size="sm"
            variant={termsAccepted ? "outline" : "filled"}
            className="flex-1 mr-2"
            onClick={() => handleAcceptTerms(false)}
          >
            {termsAccepted ? "Decline" : "Decline Terms"}
          </Button>
          <Button
            size="sm"
            variant={termsAccepted ? "filled" : "outline"}
            className="flex-1 ml-2"
            onClick={() => handleAcceptTerms(true)}
          >
            {termsAccepted ? "Terms Accepted" : "Accept Terms"}
          </Button>
        </Box>
      )}
    </Modal>
  );
}
