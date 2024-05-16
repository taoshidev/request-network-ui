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
  onSuccess?: (contract: ServiceType) => void;
}) {
  const [loading, setLoading] = useState(false);
  const { notifySuccess, notifyError } = useNotification();
  const getDefaultValues = (service: ServiceType | null) => ({
    id: service?.id || "",
    name: service?.name || "",
    userId: service?.userId || user.id,
    contractId: service?.contractId || "",
    price: service?.price || "",
    currencyType: service?.currencyType || "",
    limit: service?.limit || 10,
    remaining: service?.remaining || 10000,
    refillRate: service?.refillRate || 1,
    refillInterval: service?.refillInterval || 1000,
    expires: service?.expires || DateTime.now().plus({ months: 3 }).toJSDate(),
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
      })
    ),
  });

  useEffect(() => {
    form.setValues(getDefaultValues(service as ServiceType));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service]);

  const onSubmit = async (values: Partial<ServiceType>) => {
    setLoading(true);
    try {
      if (!service) delete values.id;
      const res = service
        ? await updateService(values as ServiceType)
        : await createService(values as ServiceType);

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
          <ServiceFormInput form={form} />
          <Divider my="md" />
          <Box className="grid grid-cols-1 mt-4 gap-4">
            <Button size="sm" variant="orange" type="submit" loading={loading}>
              {service ? "Update Service" : "Create Service"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
