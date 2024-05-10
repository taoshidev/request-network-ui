"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Title, Group, Table, Button, Modal, Badge } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { isEmpty } from "lodash";
import { KeyModal, keyType } from "@components/KeyModal/KeyModal";
import { TextEditor } from "@/components/TextEditor";

type KeyType = { apiKey: string; apiSecret: string };

export function Contract({ user, subnets, validators }: any) {
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
    <Box className="mb-4">
      <KeyModal
        apiKey={keys.apiKey}
        apiSecret={keys?.apiSecret}
        opened={keyModalOpened}
        onClose={() => setKeyModalOpened(false)}
        onCopy={(key: keyType) => setKeys((prev) => ({ ...prev, [key]: "" }))}
        title="API Access Key"
      />

      <Modal
        size="xl"
        centered
        opened={opened}
        onClose={close}
        title="Add Terms of Service"
      >
        <TextEditor />
        {/* <CreateValidator
          user={user}
          subnets={subnets}
          onComplete={handleRegistrationComplete}
        /> */}
      </Modal>

      <Box>
        <Group className="justify-between mt-7">
          {/* <Title order={2}>Contracts</Title> */}
          <Button onClick={open}>Add Terms of Service</Button>
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
