"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Title, Group, Table, Button, Modal, Badge } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { isEmpty } from "lodash";
import { CreateValidator } from "@/components/CreateValidator";
import { KeyModal, keyType } from "@components/KeyModal/KeyModal";
import { UserType } from "@/db/types/user";
import { SubnetType } from "@/db/types/subnet";
import { ValidatorType } from "@/db/types/validator";
import { ContractType } from "@/db/types/contract";

export type KeyType = { apiKey: string; apiSecret: string };

export function Validators({
  user,
  subnets,
  validators,
  contracts,
}: {
  user: UserType;
  subnets: SubnetType[];
  validators: ValidatorType[];
  contracts: ContractType[];
}) {
  const router = useRouter();

  const [opened, { open, close }] = useDisclosure(false);
  const [keyModalOpened, setKeyModalOpened] = useState(false);

  const [keys, setKeys] = useState<KeyType>({ apiKey: "", apiSecret: "" });

  const handleRegistrationComplete = ({ apiKey, apiSecret }: KeyType) => {
    close();
    setKeys({ apiKey, apiSecret });
    setKeyModalOpened(true);
    // send validator created email
  };

  const handleEdit = (validator: any) => {
    router.push(`/validators/${validator?.id}`);
  };

  return (
    <Box className="mb-16">
      <KeyModal
        apiKey={keys.apiKey}
        apiSecret={keys?.apiSecret}
        opened={keyModalOpened}
        onClose={() => setKeyModalOpened(false)}
        onCopy={(key: keyType) => setKeys((prev) => ({ ...prev, [key]: "" }))}
        title="Api Access Key"
      />

      <Modal
        size="xl"
        centered
        opened={opened}
        onClose={close}
        title="Add Your Validator"
      >
        <CreateValidator
          user={user}
          subnets={subnets}
          contracts={contracts}
          onComplete={handleRegistrationComplete}
        />
      </Modal>

      <Box>
        <Group className="justify-between my-8">
          <Title order={2}>Validators</Title>
          <Button onClick={open}>Add Your Validator</Button>
        </Group>
        {validators && !isEmpty(validators) && (
          <Table highlightOnHover striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Validator</Table.Th>
                <Table.Th>Endpoint</Table.Th>
                <Table.Th>Subnet</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {(validators || []).map((validator: any) => (
                <Table.Tr key={validator?.id}>
                  <Table.Td>{validator?.name}</Table.Td>
                  <Table.Td>
                    {validator?.baseApiUrl +
                      (validator?.apiPrefix ? validator?.apiPrefix : "")}
                  </Table.Td>
                  <Table.Td>
                    <Group>
                      {(validator.endpoints || []).map((endpoint: any) => (
                        <Badge key={endpoint.id} color="grey">
                          {endpoint?.subnet?.label}
                        </Badge>
                      ))}
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    {validator.verified ? (
                      <Badge>Verified</Badge>
                    ) : (
                      <Badge color="black">Unverified</Badge>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Button
                      size="sm"
                      variant="subtle"
                      onClick={() => handleEdit(validator)}
                    >
                      Edit
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Box>
    </Box>
  );
}
