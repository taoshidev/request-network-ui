import { useState, useEffect } from "react";
import {
  Box,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useNotification } from "@/hooks/use-notification";
import { ServiceSchema, ServiceType } from "@/db/types/service";
import { ServiceFormInput } from "@/components/Services/ServiceFormInput";
import { UserType } from "@/db/types/user";
import { createService } from "@/actions/services";

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
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError, notifyInfo } = useNotification();
  const [tiers, setTiers] = useState([{ from: 0, to: 1000, price: 0 }]);

  const getDefaultValues = () => ({
    id: service?.id || "",
    name: service?.name || "",
    userId: user?.id || "",
    currencyType: service?.currencyType || "",
    contractId: service?.contractId || "",
    price: service?.price || "0.00",
    limit: service?.limit || 10,
    remaining: service?.remaining || 10000,
    refillRate: service?.refillRate || 1,
    refillInterval: service?.refillInterval || 1000,
    expires:
      service?.expires ||
      new Date(new Date().setMonth(new Date().getMonth() + 3)),
    paymentType: service?.paymentType || "Free",
    tiers: service?.tiers || [{ from: 0, to: 1000, price: 0 }],
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
    if (values?.paymentType !== "PAY_PER_REQUEST") {
      values.tiers = [];
    } else {
      values.tiers = [...tiers];
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
