"use client";

import { useState, useEffect } from "react";
import { Box, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useNotification } from "@/hooks/use-notification";
import { ServiceSchema, ServiceType } from "@/db/types/service";
import { ServiceFormInput } from "@/components/Services/ServiceFormInput";
import { sendEmail } from "@/actions/email";
import { getAuthUser } from "@/actions/auth";
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

  const getDefaultValues = () => ({
    id: service?.id || "",
    name: service?.name || "",
    userId: user?.id || "",
    currencyType: service?.currencyType || "",
    contractId: service?.contractId || "",
    price: service?.price || "",
    limit: service?.limit || 10,
    remaining: service?.remaining || 10000,
    refillRate: service?.refillRate || 1,
    refillInterval: service?.refillInterval || 1000,
    expires:
      service?.expires ||
      new Date(new Date().setMonth(new Date().getMonth() + 3)),
  });

  const form = useForm<Partial<ServiceType>>({
    name: "create-new-service",
    initialValues: getDefaultValues(),
    validate: zodResolver(
      ServiceSchema.omit({
        id: !!onDataPrepped,
        contractId: !!onDataPrepped,
        active: true,
        updatedAt: true,
        createdAt: true,
        deletedAt: true,
      })
    ),
  });

  useEffect(() => {
    form.setValues(getDefaultValues());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service]);

  const onSubmit = async (values: Partial<ServiceType>) => {
    setLoading(true);

    if (onDataPrepped) {
      onDataPrepped(values as ServiceType);
      form.reset();
      setLoading(false);
      return;
    }

    try {
      const user = await getAuthUser();
      const res = await createService(values as ServiceType);
      if (res?.error) return notifyError(res?.message);
      onComplete?.();
      notifySuccess(res?.message as string);

      sendEmail({
        to: user?.email as string,
        template: "created-endpoint",
        subject: "New Endpoint Created",
        templateVariables: {
          request: values.remaining,
          expires: new Date(values?.expires!),
          limit: values.limit,
          refillRate: values.refillRate,
          refillInterval: values.refillInterval,
        },
      });
    } catch (error: Error | unknown) {
      notifyInfo((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" w="100%" onSubmit={form.onSubmit(onSubmit)}>
      <ServiceFormInput form={form} />
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
