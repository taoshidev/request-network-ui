"use client";

import { useRouter } from "next/navigation";
import {
  Box,
  Title,
  Group,
  Table,
  Button,
  Modal,
  Badge,
  Anchor,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { isEmpty } from "lodash";

import { CreateValidator } from "@/components/CreateValidator";

export function Validators({ user, subnets, validators }: any) {
  console.log(validators);
  const router = useRouter();

  const [opened, { open, close }] = useDisclosure(false);

  const onVerified = () => {
    close();
  };

  const handleEdit = (validator: any) => {
    router.push(`/validators/${validator?.id}`);
  };

  return (
    <Box className="mb-16">
      <Modal
        centered
        opened={opened}
        onClose={close}
        title="Add Your Validator"
      >
        <CreateValidator
          user={user}
          subnets={subnets}
          onComplete={onVerified}
        />
      </Modal>

      <Box>
        <Group className="justify-between my-8">
          <Title order={2}>Validators</Title>
          <Button onClick={open}>Add Your Validator</Button>
        </Group>

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Validator</Table.Th>
              <Table.Th>Subnet</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {validators &&
              !isEmpty(validators) &&
              validators.map((validator: any) => (
                <Table.Tr key={validator.id}>
                  <Table.Td>{validator.name}</Table.Td>
                  <Table.Td>
                    <Group>
                      {(validator.endpoints || []).map((endpoint: any) => (
                        <Badge key={endpoint.id} color="grey">
                          {endpoint?.subnets?.label}
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
      </Box>
    </Box>
  );
}
