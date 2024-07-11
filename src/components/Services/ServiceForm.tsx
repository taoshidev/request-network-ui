import { useState, useEffect } from "react";
import { Box, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useNotification } from "@/hooks/use-notification";
import { ServiceSchema, ServiceType } from "@/db/types/service";
import { ServiceFormInput } from "@/components/Services/ServiceFormInput";
import { UserType } from "@/db/types/user";
import { createService } from "@/actions/services";
import { PAYMENT_TYPE } from "@/interfaces/enum/payment-type-enum";
import { useRouter } from "next/navigation";

export function ServiceForm({
  onComplete,
  onDataPrepped,
  service,
  user,
}: {
  onComplete?: () => void;
  onDataPrepped?: (values: ServiceType) => void;
  service?: ServiceType;
  user: UserType;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError, notifyInfo } = useNotification();
  const [tiers, setTiers] = useState([{ from: 0, to: 1000, price: 0, pricePerRequest: 0 }]);

  const getDefaultValues = () => ({
    id: service?.id || "",
    name: service?.name || "",
    userId: user?.id || "",
    currencyType: service?.currencyType || "",
    contractId: service?.contractId || "",
    price: service?.price || "0.00",
    limit: service?.limit || 10,
    remaining: service?.remaining || 10000,
    refillInterval: service?.refillInterval || 60000,
    expires:
      service?.expires ||
      new Date(new Date().setMonth(new Date().getMonth() + 3)),
    paymentType: service?.paymentType || "Free",
    tiers: service?.tiers || [{ from: 0, to: 1000, price: 0, pricePerRequest: 0 }],
  });

  const form = useForm<Partial<ServiceType>>({
    name: "create-new-service",
    initialValues: getDefaultValues(),
    validate: zodResolver(
      ServiceSchema.omit({
        id: !!onDataPrepped as true,
        contractId: !!onDataPrepped as true,
        active: true,
        updatedAt: true,
        createdAt: true,
        deletedAt: true,
      })
    ),
  });

  useEffect(() => {
    form.setValues(getDefaultValues());
    setTiers(service?.tiers || [{ from: 0, to: 1000, price: 0 }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service, user]);

  const onSubmit = async (values: Partial<ServiceType>) => {
    setLoading(true);
    if (values?.paymentType !== PAYMENT_TYPE.PAY_PER_REQUEST) {
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
    if (onDataPrepped) {
      onDataPrepped({ ...values } as ServiceType);
      form.reset();
      setLoading(false);
      return;
    }
    try {
      const res = await createService({ ...values } as ServiceType);
      if (res?.error) return notifyError(res?.message);
      onComplete?.();
      notifySuccess(res?.message as string);
    } catch (error: Error | unknown) {
      notifyInfo((error as Error).message);
    } finally {
      setLoading(false);
      router.refresh();
    }
  };

  return (
    <Box component="form" w="100%" onSubmit={form.onSubmit(onSubmit)}>
      <ServiceFormInput form={form} tiers={tiers} setTiers={setTiers} />
      <Box mt="xl" className="grid grid-cols-1 gap-4">
        <Button type="submit" loading={loading}>
          {onDataPrepped
            ? service
              ? "Update Service"
              : "Add Service"
            : "Submit"}
        </Button>
      </Box>
    </Box>
  );
}
