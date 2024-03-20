"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Title,
  rem,
  Box,
  Table,
  Badge,
  Button,
  Group,
  Modal,
  Alert,
  Flex,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { z } from "zod";
import { find, some } from "lodash";
import { IconSettings, IconGraph } from "@tabler/icons-react";
import { isEmpty } from "lodash";

import { getSubnets } from "@/actions/subnets";
import { createEndpoint } from "@/actions/endpoints";

import { Limits } from "@/components/Limits";

import styles from "./endpoint.module.css";

interface EndpointsProps {
  user: any;
  endpoints: any;
  validators: any;
  subnets: any;
}

export function Endpoints({
  user,
  endpoints,
  validators,
  subnets,
}: EndpointsProps) {
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
        <Limits
          user={user}
          onComplete={close}
          validators={validators}
          subnets={subnets}
        />
      </Modal>

      <Box>
        <Group justify="space-between" my="xl">
          <Title order={2}>Endpoints</Title>
          <Button onClick={open} disabled={!enabled}>
            Create New Endpoint
          </Button>
        </Group>

        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Endpoint</Table.Th>
              <Table.Th>Subnet</Table.Th>
              <Table.Th>Enabled</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {endpoints &&
              !isEmpty(endpoints) &&
              endpoints.map((endpoint: any) => (
                <Table.Tr key={endpoint.id}>
                  <Table.Td>{endpoint.url}</Table.Td>
                  <Table.Td>{endpoint.subnet?.label}</Table.Td>
                  <Table.Td>
                    {endpoint.enabled ? (
                      <Badge radius={0} color="orange">
                        Enabled
                      </Badge>
                    ) : (
                      <Badge radius={0} color="black">
                        Disabled
                      </Badge>
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
    </>
  );
}
