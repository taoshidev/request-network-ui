"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Title,
  Group,
  Table,
  Button,
  Badge,
  Tooltip,
} from "@mantine/core";
import { isEmpty } from "lodash";
import { KeyModal, keyType } from "@components/KeyModal/KeyModal";
import { UserType } from "@/db/types/user";
import { SubnetType } from "@/db/types/subnet";
import { ValidatorType, ValidatorWithInfo } from "@/db/types/validator";
import { ContractType } from "@/db/types/contract";
import { EndpointType } from "@/db/types/endpoint";
import { IconAlertTriangle, IconCircleCheck } from "@tabler/icons-react";

export type KeyType = { apiKey: string; apiSecret: string };

export function Validators({
  user,
  subnets,
  validators,
  contracts,
}: {
  user: UserType;
  subnets: SubnetType[];
  validators: ValidatorWithInfo[];
  contracts: ContractType[];
}) {
  const router = useRouter();
  const [keyModalOpened, setKeyModalOpened] = useState(false);
  const [btnLoading, setBtnLoading] = useState("");
  const [keys, setKeys] = useState<KeyType>({ apiKey: "", apiSecret: "" });

  const handleEdit = (validator: any) => {
    setBtnLoading(`edit-validator-${validator.id}`);
    router.push(`/validators/${validator?.id}`);
  };

  function addValidator() {
    setBtnLoading("add-validator");
    router.push("/validators/add");
  }
  return (
    <Box>
      <KeyModal
        apiKey={keys.apiKey}
        apiSecret={keys?.apiSecret}
        opened={keyModalOpened}
        onClose={() => setKeyModalOpened(false)}
        onCopy={(key: keyType) => setKeys((prev) => ({ ...prev, [key]: "" }))}
        title="Api Access Key"
      />

      <Box>
        <Group className="justify-between">
          <Title order={2} className="mb-5">
            Validators
          </Title>
          <Button
            onClick={addValidator}
            loading={btnLoading === "add-validator"}
          >
            Add New Validator
          </Button>
        </Group>
        {validators && !isEmpty(validators) && (
          <Table.ScrollContainer minWidth={700}>
            <Table highlightOnHover striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th></Table.Th>
                  <Table.Th>Validator</Table.Th>
                  <Table.Th>Server Url</Table.Th>
                  <Table.Th>Subnet</Table.Th>
                  <Table.Th>Verification Status</Table.Th>
                  <Table.Th></Table.Th>
                  <Table.Th></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {(validators || []).map((validator: ValidatorWithInfo) => (
                  <Table.Tr key={validator?.id}>
                    <Table.Td className="px-1">
                      <Tooltip
                        label={`Validator ${
                          validator.health?.message?.toLowerCase() === "ok"
                            ? "Online"
                            : "Offline"
                        }`}
                      >
                        {validator.health?.message?.toLowerCase() === "ok" ? (
                          <IconCircleCheck className="inline-block text-green-600" />
                        ) : (
                          <IconAlertTriangle className="inline-block text-red-700" />
                        )}
                      </Tooltip>
                    </Table.Td>
                    <Table.Td>{validator?.name}</Table.Td>
                    <Table.Td>{validator?.baseApiUrl}</Table.Td>
                    <Table.Td>
                      <Box className="leading-7">
                        {(validator.endpoints || [])
                          .filter(
                            (
                              endpoint: EndpointType,
                              index: number,
                              array: EndpointType[]
                            ) =>
                              array.findIndex(
                                (firstEndpoint) =>
                                  firstEndpoint?.subnet?.label ===
                                  endpoint?.subnet?.label
                              ) === index
                          )
                          .map((endpoint: any) => (
                            <Badge key={endpoint.id} color="grey">
                              {endpoint?.subnet?.label}
                            </Badge>
                          ))}
                      </Box>
                    </Table.Td>
                    <Table.Td>
                      <Box className="leading-7">
                        {validator.verified ? (
                          <Badge className="mr-2">Hotkey Verified</Badge>
                        ) : (
                          <Badge className="mr-2" color="black">
                            Hotkey Unverified
                          </Badge>
                        )}
                        {validator.stripeEnabled ? (
                          <Badge>Stripe Verified</Badge>
                        ) : (
                          <Badge color="black">Stripe Unverified</Badge>
                        )}
                      </Box>
                    </Table.Td>
                    <Table.Td>
                      <Button
                        size="sm"
                        variant="subtle"
                        loading={
                          btnLoading === `edit-validator-${validator.id}`
                        }
                        onClick={() => handleEdit(validator)}
                      >
                        {validator.verified ? "Edit" : "Verify"}
                      </Button>
                    </Table.Td>
                    <Table.Td>
                      <Button
                        size="sm"
                        variant="light"
                        loading={
                          btnLoading === `validator-insights-${validator.id}`
                        }
                        onClick={() => {
                          setBtnLoading(`validator-insights-${validator.id}`);
                          router.push(
                            `/validators/${validator?.id}/payment-dashboard`
                          );
                        }}
                      >
                        insights
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </Box>
    </Box>
  );
}
