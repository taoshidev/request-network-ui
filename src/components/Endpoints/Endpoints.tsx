"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Title, Box, Table, Badge, Button, Group, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { some } from "lodash";
import { isEmpty } from "lodash";
import { Limits } from "@/components/Limits";
import { getUserAPIKeys } from "@/actions/keys";
import { ValidatorKeyType } from "@/components/StatTable";
import { EndpointType } from "@/db/types/endpoint";
import { ValidatorType } from "@/db/types/validator";
import { SubnetType } from "@/db/types/subnet";

export function Endpoints({
  endpoints,
  validators,
  subnets,
}: {
  endpoints: EndpointType[];
  validators: ValidatorType[];
  subnets: SubnetType[];
}) {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);

  const handleEdit = (endpoint: any) => {
    router.push(`/endpoints/${endpoint?.id}`);
  };

  const enabled = useMemo(() => {
    const verified = some(validators, { verified: true });
    return verified;
  }, [validators]);

  return (
    <>
      <Modal
        centered
        opened={opened}
        onClose={close}
        title="Create a new Endpoint"
      >
        <Limits onComplete={close} validators={validators} subnets={subnets} />
      </Modal>

      {endpoints && !isEmpty(endpoints) && (
        <Box className="mb-16">
          <Group justify="space-between" my="xl">
            <Title order={2}>Endpoints</Title>
            <Button onClick={open} disabled={!enabled}>
              Create New Endpoint
            </Button>
          </Group>

          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Validator</Table.Th>
                <Table.Th>Endpoint</Table.Th>
                <Table.Th>Subnet</Table.Th>
                <Table.Th>Enabled</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {endpoints.map((endpoint: any) => (
                <Table.Tr key={endpoint.id}>
                  <Table.Td>
                    {
                      validators.find((v: any) => v.id === endpoint.validator)
                        ?.name
                    }
                  </Table.Td>
                  <Table.Td>{endpoint.url}</Table.Td>
                  <Table.Td>{endpoint.subnets?.label}</Table.Td>
                  <Table.Td>
                    {endpoint.enabled ? (
                      <Badge>Enabled</Badge>
                    ) : (
                      <Badge color="black">Disabled</Badge>
                    )}
                  </Table.Td>
                  <Table.Td>
                    <Button
                      size="sm"
                      variant="subtle"
                      onClick={() => handleEdit(endpoint)}
                    >
                      Edit
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Box>
      )}
    </>
  );
}
