import { useState } from "react";
import { Box, Title, Group, Table, Button, Text, Alert } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { UserType } from "@/db/types/user";
import { ContractType } from "@/db/types/contract";
import { ContractModal } from "@/components/ContractModal";
import { deleteContract } from "@/actions/contracts";
import { useNotification } from "@/hooks/use-notification";
import { useRouter } from "next/navigation";
import { ConfirmModal } from "@/components/ConfirmModal";
import { IconAlertCircle } from "@tabler/icons-react";
import dayjs from "dayjs";

export function Contracts({
  user,
  contracts,
}: {
  user: UserType;
  contracts: ContractType[];
}) {
  const router = useRouter();
  const { notifySuccess, notifyError, notifyInfo } = useNotification();
  const [selectedContract, setSelectedContract] =
    useState<ContractType | null>();
  const [opened, { open, close }] = useDisclosure(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleEdit = (contract: ContractType) => {
    setSelectedContract(contract);
    open();
  };

  const handleCreate = () => {
    setSelectedContract(null);
    open();
  };

  const openDeleteConfirm = (contract: ContractType) => {
    setSelectedContract(contract);
    setConfirmDelete(true);
  };

  const handleDeleteConfirmed = async () => {
    if (selectedContract) {
      const deleted = await deleteContract(selectedContract);
      if (deleted?.error) {
        notifyError(deleted.error.message || "Failed to delete contract");
      } else {
        notifySuccess("Contract deleted successfully");
        setSelectedContract(null);
        setConfirmDelete(false);
        router.refresh();
      }
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setSelectedContract(null);
  };
  console.log("selectedContract::::", selectedContract);
  return (
    <Box className="mb-16">
      <ContractModal
        onSuccess={() => setSelectedContract(null)}
        contract={selectedContract}
        opened={opened}
        close={close}
        user={user}
      />
      <ConfirmModal
        opened={confirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this contract? This action is irreversible."
        onConfirm={handleDeleteConfirmed}
        onCancel={handleCancelDelete}
      />

      <Box>
        <Group className="justify-between mb-4">
          <Title order={2}>Contracts</Title>
          <Button onClick={handleCreate}>Add Contracts</Button>
        </Group>
        {contracts.length > 0 && (
          <Table highlightOnHover striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Title</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Created</Table.Th>
                <Table.Th>Updated</Table.Th>
                <Table.Th className="text-right"></Table.Th>
                <Table.Th className="text-right"></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {(contracts || []).map((contract: any) => (
                <Table.Tr key={contract?.id}>
                  <Table.Td>{contract?.title}</Table.Td>
                  <Table.Td>
                    {contract?.active ? "Active" : "Inactive"}
                  </Table.Td>
                  <Table.Td>
                    {dayjs(contract?.createdAt).format("MMM DD, YYYY")}
                  </Table.Td>
                  <Table.Td>
                    {dayjs(contract?.updatedAt).format("MMM DD, YYYY")}
                  </Table.Td>
                  <Table.Td className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(contract)}
                    >
                      Edit
                    </Button>
                  </Table.Td>
                  <Table.Td className="text-right">
                    <Button
                      size="sm"
                      variant="light"
                      onClick={() => openDeleteConfirm(contract)}
                    >
                      Delete
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
        {contracts.length === 0 && (
          <Alert
            className="shadow-sm"
            color="orange"
            icon={<IconAlertCircle />}
          >
            <Text className="mb-7">
              You don&apos;t have any service contracts yet. Add your Terms of
              Service and attach them to your endpoints.
            </Text>
            <Box>
              <Group className="justify-between">
                <Button onClick={open}>Add Service Contract</Button>
              </Group>
            </Box>
          </Alert>
        )}
      </Box>
    </Box>
  );
}
