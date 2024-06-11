"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Title, Group, Table, Button, Badge } from "@mantine/core";
import { isEmpty } from "lodash";
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
  const [keyModalOpened, setKeyModalOpened] = useState(false);

  const [keys, setKeys] = useState<KeyType>({ apiKey: "", apiSecret: "" });

  const handleEdit = (validator: any) => {
    router.push(`/validators/${validator?.id}`);
  };

  function addValidator() {
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
          <Button onClick={addValidator}>Add New Validator</Button>
        </Group>
        {validators && !isEmpty(validators) && (
          <Table highlightOnHover striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: "15%" }}>Validator</Table.Th>
                <Table.Th style={{ width: "25%" }}>Server Url</Table.Th>
                <Table.Th>Subnet</Table.Th>
                <Table.Th>Verification Status</Table.Th>
                <Table.Th></Table.Th>
                <Table.Th></Table.Th>
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
                    <Box className="leading-7">
                      {(validator.endpoints || [])
                      .filter((endpoint, index, array) => array.indexOf(endpoint) === index)
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
                        <Badge>Validator Verified</Badge>
                      ) : (
                        <Badge color="black">Validator Unverified</Badge>
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
                      onClick={() => handleEdit(validator)}
                    >
                      {validator.verified ? "Edit" : "Verify"}
                    </Button>
                  </Table.Td>
                  <Table.Td>
                    <Button
                      size="sm"
                      variant="light"
                      onClick={() =>
                        router.push(
                          `/validators/${validator?.id}/payment-dashboard`
                        )
                      }
                    >
                      insights
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
