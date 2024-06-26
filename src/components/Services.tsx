import { useState } from "react";
import { Box, Title, Group, Table, Button, Text, Alert } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { UserType } from "@/db/types/user";
import { useNotification } from "@/hooks/use-notification";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/ConfirmModal";
import { IconAlertCircle } from "@tabler/icons-react";
import dayjs from "dayjs";
import { ServiceType } from "@/db/types/service";
import ServiceModal from "./ServiceModal";
import { deleteService } from "@/actions/services";
import CurrencyFormatter from "./Formatters/CurrencyFormatter";
import FixedFormatter from "./Formatters/FixedFormatter";

export default function Services({
  user,
  services,
}: {
  user: UserType;
  services: ServiceType[];
}) {
  const router = useRouter();
  const { notifySuccess, notifyError } = useNotification();
  const [selectedService, setSelectedService] = useState<ServiceType | null>();
  const [opened, { open, close }] = useDisclosure(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleEdit = (service: ServiceType) => {
    setSelectedService(service);
    open();
  };

  const handleCreate = () => {
    setSelectedService(null);
    open();
  };

  const openDeleteConfirm = (service: ServiceType) => {
    setSelectedService(service);
    setConfirmDelete(true);
  };

  const handleDeleteConfirmed = async () => {
    if (selectedService) {
      const deleted = await deleteService(selectedService);
      if (deleted?.error) {
        notifyError(deleted.error.message || "Failed to delete service");
      } else {
        notifySuccess("Service deleted successfully");
        setSelectedService(null);
        setConfirmDelete(false);
        router.refresh();
      }
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setSelectedService(null);
  };

  return (
    <Box className="mb-16">
      <ServiceModal
        onSuccess={() => setSelectedService(null)}
        service={selectedService}
        opened={opened}
        close={close}
        user={user}
      />
      <ConfirmModal
        opened={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this service? This action is irreversible."
        onConfirm={handleDeleteConfirmed}
        onCancel={handleCancelDelete}
      />

      <Box>
        <Group className="justify-between mb-4">
          <Title order={2}>Services</Title>
          {/* <Button onClick={handleCreate}>Add Services</Button> */}
        </Group>
        {services.length > 0 && (
          <Table highlightOnHover striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Title</Table.Th>
                <Table.Th>Payment Type</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Created</Table.Th>
                <Table.Th>Updated</Table.Th>
                <Table.Th className="text-right"></Table.Th>
                <Table.Th className="text-right"></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {(services || []).map((service: any) => (
                <Table.Tr key={service?.id}>
                  <Table.Td>{service?.name}</Table.Td>
                  <Table.Td>
                    {service?.paymentType
                      ?.toLowerCase()
                      .charAt(0)
                      .toUpperCase() +
                      service?.paymentType
                        ?.toLowerCase()
                        .slice(1)
                        ?.split("_")
                        ?.join(" ")}
                  </Table.Td>
                  <Table.Td>
                    <CurrencyFormatter
                      price={service?.price}
                      currencyType={service?.currencyType}
                    />
                  </Table.Td>
                  <Table.Td>{service?.active ? "Active" : "Inactive"}</Table.Td>
                  <Table.Td>
                    {dayjs(service?.createdAt).format("MMM DD, YYYY")}
                  </Table.Td>
                  <Table.Td>
                    {dayjs(service?.updatedAt).format("MMM DD, YYYY")}
                  </Table.Td>
                  <Table.Td className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(service)}
                    >
                      Edit
                    </Button>
                  </Table.Td>
                  <Table.Td className="text-right">
                    <Button
                      size="sm"
                      variant="light"
                      onClick={() => openDeleteConfirm(service)}
                    >
                      Delete
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
        {services.length === 0 && (
          <Alert
            className="shadow-sm"
            color="orange"
            icon={<IconAlertCircle />}
          >
            <Text className="mb-7">
              You don&apos;t have any services yet. Add a service here or from
              the add contract modal.{" "}
            </Text>
            <Box>
              <Group className="justify-between">
                <Button onClick={open}>Add Service</Button>
              </Group>
            </Box>
          </Alert>
        )}
      </Box>
    </Box>
  );
}
