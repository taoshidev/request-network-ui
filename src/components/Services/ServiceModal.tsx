import { useState, useEffect } from "react";
import { Box, Button, Modal, TextInput, Divider, Text } from "@mantine/core";
import { TextEditor } from "@/components/TextEditor";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useNotification } from "@/hooks/use-notification";
import { ServiceType } from "@/db/types/service";
import { ServiceSchema } from "@/db/types/service";
import { createService, updateService } from "@/actions/services";
import { UserType } from "@/db/types/user";
import { ServiceForm } from "@/components/Services/ServiceForm";

export function ServiceModal({
  user,
  opened,
  onClose,
  service,
  onSuccess,
  classNames = ""
}: {
  user: UserType;
  opened: boolean;
  service?: ServiceType | null;
  onClose: () => void;
  onSuccess?: (service: ServiceType) => void;
  classNames?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([{}]);
  const { notifySuccess, notifyError } = useNotification();

  const getDefaultValues = (service: ServiceType | null) => ({
    id: service?.id || "",
    userId: user?.id || "",
  });

  const form = useForm<Partial<ServiceType>>({
    initialValues: getDefaultValues(service as ServiceType),
    validate: zodResolver(
      ServiceSchema.omit({
        id: !service,
        active: true,
        createdAt: true,
        updatedAt: true,
      })
    ),
  });

  useEffect(() => {
    form.setValues(getDefaultValues(service as ServiceType));
  }, [service]);

  const onSubmit = async (values: Partial<ServiceType>) => {
    setLoading(true);
    try {
      if (!service) delete values.id;
      const res = service
        ? await updateService(values as ServiceType)
        : await createService(values as ServiceType);

      notifySuccess(
        `Service ${service ? "updated" : "created"} successfully`
      );
      onSuccess?.(res?.data as ServiceType);
      form.reset();
      close();
    } catch (error: any) {
      notifyError(error.message || "Failed to create/update contract");
    } finally {
      setLoading(false);
    }
  };

  const handleServiceFormComplete = () => {
    form.reset();
    close();
  };

  const addService = () => {
    setServices((prevServices) => [...prevServices, {}]);
    console.log('services', services)
  };

  return (
    <Modal
      className={classNames}
      size="xl"
      centered
      opened={opened}
      fullScreen
      onClose={() => {
        form.reset();
        setServices([{}]);
        onClose();
      }}
      title={`${service ? "Edit" : "Add"} Terms of Service`}
    >
      <Box component="form" className="w-full" onSubmit={form.onSubmit(onSubmit)}>
      <Text size="sm">
        This action is so important that you are required to confirm it with a modal. Please click
        one of these buttons to proceed.
      </Text>

        {/* <TextInput
          mb="md"
          withAsterisk
          label="Contract Title"
          placeholder="Enter a title for your contract"
          {...form.getInputProps("title")}
        />
        <TextEditor<ServiceType>
          type="RichTextEditor"
          prop="content"
          form={form}
          label={{ text: "Contract Content", required: true }}
        />
        <Box className="flex justify-end mt-4">
          <Button size="sm" variant="orange" onClick={addService}>
            Add More Service
          </Button>
        </Box>
        <Box
          className={`mt-3 grid gap-4`}
          style={{
            gridTemplateColumns: `repeat(${Math.min(services.length, 2)}, minmax(0, 1fr))`,
          }}
        
        >
          {services.map((svcs, index) => (
            <ServiceForm
              key={index}
              onComplete={handleServiceFormComplete}
              user={user}
            />
          ))}
        </Box> */}
       
        <Button
          size="sm"
          variant="orange"
          type="submit"
          className="w-full mt-4"
          loading={loading}
        >
          {service ? "Update Service" : "Create Service"}
        </Button>
      </Box>
    </Modal>
  );
}
