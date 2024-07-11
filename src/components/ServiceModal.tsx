import { useState, useEffect, useRef } from "react";
import { Box, Button, Modal, Divider } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useNotification } from "@/hooks/use-notification";
import { UserType } from "@/db/types/user";
import { ServiceSchema, ServiceType } from "@/db/types/service";
import { createService, updateService } from "@/actions/services";
import { DateTime } from "luxon";
import { ServiceFormInput } from "./Services/ServiceFormInput";
import { useRouter } from "next/navigation";
import { PAYMENT_TYPE } from "@/interfaces/enum/payment-type-enum";
import { TierType, DEFAULT_TIER } from "@/components/Services/ServiceForm";

export default function ServiceModal({
  user,
  opened,
  close,
  service,
  onSuccess,
}: {
  user: UserType;
  opened: boolean;
  service?: ServiceType | null;
  close: () => void;
  onSuccess?: (service: ServiceType) => void;
}) {
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError } = useNotification();
  const [tiers, setTiers] = useState([DEFAULT_TIER],);
  const getDefaultValues = (service: ServiceType | null) => ({
    id: service?.id || "",
    name: service?.name || "",
    userId: service?.userId || user.id,
    contractId: service?.contractId || "",
    price: service?.price || "0.00",
    currencyType: service?.currencyType || "",
    limit: service?.limit || 10,
    remaining: service?.remaining || 10000,
    refillInterval: service?.refillInterval || 60000,
    expires: service?.expires || DateTime.now().plus({ months: 3 }).toJSDate(),
    paymentType: service?.paymentType || "Free",
    tiers: service?.tiers || [
      { from: 1, to: 1000, price: "0.00", pricePerRequest: "0.000" },
    ],
  });

  const router = useRouter();

  const form = useForm<Partial<ServiceType>>({
    initialValues: getDefaultValues(service as ServiceType),
    validate: zodResolver(
      ServiceSchema.omit({
        id: !service as true,
        active: true,
        createdAt: true,
        updatedAt: true,
        contractId: !!service as true,
        deletedAt: true,
      })
    ),
  });

  useEffect(() => {
    if (opened) form.setValues(getDefaultValues(service as ServiceType));
    setTiers(
      service?.tiers || [DEFAULT_TIER]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, opened]);

  const onSubmit = async (values: Partial<ServiceType>) => {
    setLoading(true);
    try {
      if (!service) delete values.id;
      if (service?.paymentType !== PAYMENT_TYPE.PAY_PER_REQUEST) {
        values.tiers = [];
        if (values?.paymentType == PAYMENT_TYPE.SUBSCRIPTION) {
          values.expires = null;
        }
      } else {
        values.tiers = [...tiers].sort((a, b) => a.to - b.to);
        values.expires = null;
        const freeTier = values.tiers?.find((tier) => +tier.price === 0);
        if (freeTier) {
          values.remaining = freeTier.to;
        } else {
          values.remaining = 0;
        }
      }
      const res = service
        ? await updateService({ ...values } as ServiceType)
        : await createService({ ...values } as ServiceType);

      notifySuccess(`Service ${service ? "updated" : "created"} successfully`);
      onSuccess?.(res?.data as ServiceType);
      form.reset();
      close();
      router.refresh();
    } catch (error: any) {
      notifyError(
        error.message || `Failed to ${service ? "update" : "create"} service`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        size="xl"
        centered
        opened={opened}
        onClose={() => {
          form.reset();
          close();
        }}
        title={`${service ? "Edit" : "Add"} Service`}
      >
        <Box
          component="form"
          className="w-full"
          onSubmit={form.onSubmit(onSubmit)}
        >
          <ServiceFormInput form={form} tiers={tiers} setTiers={setTiers} />
          <Box className="grid grid-cols-1 mt-4 gap-4 sticky bg-white border-t border-gray-200 p-4 bottom-0 -mb-4 -mx-4 z-10">
            <Button size="sm" variant="orange" type="submit" loading={loading}>
              {service ? "Update Service" : "Create Service"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
