"use client";

import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { Title, Box, Table, Badge, Button, Group, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { some } from "lodash";
import { isEmpty } from "lodash";
import { Limits } from "@/components/Limits";
import { EndpointSchema, EndpointType } from "@/db/types/endpoint";
import { ValidatorType } from "@/db/types/validator";
import { SubnetType } from "@/db/types/subnet";
import { ContractType } from "@/db/types/contract";
import { useForm, zodResolver } from "@mantine/form";
import { uniq as _uniq } from "lodash";

export function Endpoints({
  endpoints,
  validators,
  subnets,
  contracts,
}: {
  endpoints: EndpointType[];
  validators: ValidatorType[];
  subnets: SubnetType[];
  contracts: ContractType[];
}) {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [btnLoading, setBtnLoading] = useState("");

  const handleEdit = (endpoint: any) => {
    setBtnLoading(`edit-endpoint-${endpoint.id}`);
    router.push(`/endpoints/${endpoint?.id}`);
  };

  const enabled = useMemo(() => {
    const verified = some(validators, { verified: true });
    return verified;
  }, [validators]);

  const form = useForm<Partial<EndpointType>>({
    name: "create-new-endpoint",
    initialValues: {
      url: "",
      subnetId: "",
      validatorId: "",
      contractId: "",
      percentRealtime: "",
      enabled: false,
    },
    validate: zodResolver(EndpointSchema),
  });

  return (
    <>
      <Modal
        centered
        size="lg"
        opened={opened}
        onClose={close}
        title="Create a new Endpoint"
      >
        <Limits
          contracts={contracts}
          onComplete={close}
          validators={validators}
          subnets={subnets}
          form={form}
        />
      </Modal>

      {endpoints && !isEmpty(endpoints) && (
        <Box>
          <Group justify="space-between">
            <Title order={2} className="mb-5">
              Endpoints
            </Title>
            <Button onClick={open} disabled={!enabled}>
              Add New Endpoint
            </Button>
          </Group>

          <Table.ScrollContainer minWidth={700}>
            <Table highlightOnHover striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Path</Table.Th>
                  <Table.Th>Currency</Table.Th>
                  <Table.Th>Validator</Table.Th>
                  <Table.Th>Subnet</Table.Th>
                  <Table.Th>Created</Table.Th>
                  <Table.Th>Enabled</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {(endpoints || []).map((endpoint: any) => (
                  <Table.Tr key={endpoint?.id}>
                    <Table.Td>{endpoint.url + (endpoint?.percentRealtime ? `?tier=${endpoint?.percentRealtime}`: ``)}</Table.Td>
                    <Table.Td>
                      {[
                        ..._uniq(
                          endpoint?.contract?.services?.map(
                            (service) => service.currencyType
                          ) || []
                        ),
                      ].join(", ")}
                    </Table.Td>
                    <Table.Td>
                      {
                        validators.find(
                          (v: any) => v?.id === endpoint?.validatorId
                        )?.name
                      }
                    </Table.Td>
                    <Table.Td>{endpoint.subnet?.label}</Table.Td>
                    <Table.Td>
                      {dayjs(endpoint?.created).format("MMM DD, YYYY")}
                    </Table.Td>
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
                        loading={btnLoading === `edit-endpoint-${endpoint.id}`}
                        onClick={() => handleEdit(endpoint)}
                      >
                        Edit
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Box>
      )}
    </>
  );
}
