import { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Modal,
  TextInput,
  Divider,
  Table,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useNotification } from "@/hooks/use-notification";
import { UserType } from "@/db/types/user";
import { ServiceForm } from "@/components/Services/ServiceForm";
import { useModals } from "@mantine/modals";
import { ServiceSchema, ServiceType } from "@/db/types/service";
import { createService, updateService } from "@/actions/services";
import { DateTime } from "luxon";
import dayjs from "dayjs";
import { ServiceFormInput } from "./Services/ServiceFormInput";

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
  const [services, setServices] = useState<ServiceType[]>([]);
  const serviceModalRef = useRef<string | null>(null);
  const editServiceIndexRef = useRef<number | null>(null);
  const { notifySuccess, notifyError } = useNotification();
  const modals = useModals();

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

      notifySuccess(`Contract ${service ? "updated" : "created"} successfully`);

      if (res?.data) {
        const { id: contractId } = res?.data?.[0];

        const reqs = services.map((s) => {
          if ("id" in s) delete s.id;
          const obj = {
            ...s,
            contractId,
          };
          return createService(obj);
        });

        const serviceRes = await Promise.all(reqs);

        serviceRes.forEach((r, i) => {
          if (r?.error) {
            notifyError(`Failed to create service ${services[i]?.name}`);
          } else {
            notifySuccess(
              `Service ${services[i]?.name} created successfully for service ${res.data?.name}`
            );
          }
        });
      }
      onSuccess?.(res?.data as ServiceType);
      form.reset();
      close();
    } catch (error: any) {
      notifyError(
        error.message || `Failed to ${service ? "update" : "create"} service`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleServicePrepped = (service: ServiceType) => {
    console.log("from handleServicePrepped", service);
    if (editServiceIndexRef.current !== null) {
      setServices((prevServices: ServiceType[]) =>
        prevServices?.map((s: ServiceType, index: number) =>
          index === editServiceIndexRef?.current ? service : s
        )
      );
    } else {
      setServices((prevServices) => [...prevServices, service]);
    }
    if (serviceModalRef.current) {
      modals.closeModal(serviceModalRef.current);
    }
  };

  const openServiceModal = (service?: ServiceType, index?: number) => {
    editServiceIndexRef.current = index !== undefined ? index : null;
    console.log("editServiceIndexRef.current", editServiceIndexRef.current);
    serviceModalRef.current = modals.openModal({
      centered: true,
      title: service ? "Edit Service" : "Add New Service",
      children: (
        <ServiceForm
          service={service}
          onDataPrepped={handleServicePrepped}
          user={user}
        />
      ),
    });
  };

  const handleServiceDelete = (index: number) => {
    setServices((prevServices) =>
      prevServices.filter((item, i) => i !== index)
    );
  };

  const openServiceDeleteConfirm = (index: number) =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      centered: true,
      children: (
        <Text size="sm">Are you sure you want to remove this service?</Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => handleServiceDelete(index),
    });

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
            <Button
              size="sm"
              variant="orange"
              type="submit"
              loading={loading}
            >
              {service ? "Update Service" : "Create Service"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
