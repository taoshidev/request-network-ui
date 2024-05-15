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
import { TextEditor } from "@/components/TextEditor";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { useNotification } from "@/hooks/use-notification";
import { ContractType } from "@/db/types/contract";
import { ContractSchema } from "@/db/types/contract";
import { createContract, updateContract } from "@/actions/contracts";
import { UserType } from "@/db/types/user";
import { ServiceForm } from "@/components/Services/ServiceForm";
import { useModals } from "@mantine/modals";
import { ServiceType } from "@/db/types/service";
import { createService } from "@/actions/services";
import dayjs from "dayjs";

export function ContractModal({
  user,
  opened,
  close,
  contract,
  onSuccess,
}: {
  user: UserType;
  opened: boolean;
  contract?: ContractType | null;
  close: () => void;
  onSuccess?: (contract: ContractType) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<ServiceType[]>([]);
  const serviceModalRef = useRef<string | null>(null);
  const editServiceIndexRef = useRef<number | null>(null);
  const { notifySuccess, notifyError } = useNotification();
  const modals = useModals();

  const getDefaultValues = (contract: ContractType | null) => ({
    id: contract?.id || "",
    title: contract?.title || "",
    content: contract?.content || "",
    userId: user?.id || "",
  });

  const form = useForm<Partial<ContractType>>({
    initialValues: getDefaultValues(contract as ContractType),
    validate: zodResolver(
      ContractSchema.omit({
        id: !contract,
        active: true,
        createdAt: true,
        updatedAt: true,
      })
    ),
  });

  useEffect(() => {
    form.setValues(getDefaultValues(contract as ContractType));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  const onSubmit = async (values: Partial<ContractType>) => {
    setLoading(true);
    try {
      if (!contract) delete values.id;
      const res = contract
        ? await updateContract(values as ContractType)
        : await createContract(values as ContractType);

      notifySuccess(
        `Contract ${contract ? "updated" : "created"} successfully`
      );

      if(res?.data) {
        const { id: contractId } = res?.data?.[0];

        const reqs = services.map((s) => {
          if("id" in s) delete s.id;
          const obj = {
            ...s,
            contractId,
          }
          return createService(obj)
        });

        const serviceRes = await Promise.all(reqs);

        serviceRes.forEach((r, i) => { 
          if (r?.error) {
            notifyError(`Failed to create service ${services[i]?.name}`);
          } else {
            notifySuccess(`Service ${services[i]?.name} created successfully for contract ${res.data?.title}`);
          }
        });
      }
      onSuccess?.(res?.data as ContractType);
      form.reset();
      close();
    } catch (error: any) {
      notifyError(error.message || `Failed to ${contract ? "update" : "create"} contract`);
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
        title={`${contract ? "Edit" : "Add"} Terms of Service`}
      >
        <Box
          component="form"
          className="w-full"
          onSubmit={form.onSubmit(onSubmit)}
        >
          <TextInput
            mb="md"
            withAsterisk
            label="Contract Title"
            placeholder="Enter a title for your contract"
            {...form.getInputProps("title")}
          />
          <TextEditor<ContractType>
            type="RichTextEditor"
            prop="content"
            form={form}
            label={{ text: "Contract Content", required: true }}
          />

          <Box className="mt-7">
            {services.length > 0 && (
              <Table highlightOnHover striped>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Service</Table.Th>
                    <Table.Th>Expires</Table.Th>
                    <Table.Th>Price</Table.Th>
                    <Table.Th>Limit</Table.Th>
                    <Table.Th>Requests</Table.Th>
                    <Table.Th>Refill</Table.Th>
                    <Table.Th>Interval</Table.Th>
                    <Table.Th className="text-right"></Table.Th>
                    <Table.Th className="text-right"></Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {services.map((service: ServiceType, index: number) => (
                    <Table.Tr key={index}>
                      <Table.Td>{service?.name}</Table.Td>
                      <Table.Td>
                        {dayjs(contract?.expires).format("MMM DD, YYYY")}
                      </Table.Td>
                      <Table.Td>{service?.price}</Table.Td>
                      <Table.Td>{service?.limit}</Table.Td>
                      <Table.Td>{service?.remaining}</Table.Td>
                      <Table.Td>{service?.refillRate}</Table.Td>
                      <Table.Td>{service?.refillInterval}</Table.Td>
                      <Table.Td className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openServiceModal(service, index)}
                        >
                          Edit
                        </Button>
                      </Table.Td>
                      <Table.Td className="text-right">
                        <Button
                          size="sm"
                          variant="light"
                          onClick={() => openServiceDeleteConfirm(index)}
                        >
                          Delete
                        </Button>
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
          </Box>
          <Divider my="md" />
          <Box className="grid grid-cols-2 mt-4 gap-4">
            <Button
              size="sm"
              variant="orange"
              type="submit"
              loading={loading}
              disabled={services.length === 0}
            >
              {contract ? "Update Contract" : "Create Contract"}
            </Button>
            <Button
              size="sm"
              variant="orange"
              onClick={() => openServiceModal()}
            >
              Add Services
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
