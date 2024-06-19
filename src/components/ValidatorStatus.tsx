"use client";

import { EndpointType } from "@/db/types/endpoint";
import { UserType } from "@/db/types/user";
import { ValidatorType } from "@/db/types/validator";
import { Badge, Box, Card, Group, Table, Text } from "@mantine/core";
import UptimeFormatter from "./UptimeFormatter";
import { IconAlertTriangle, IconCircleCheck } from "@tabler/icons-react";
import clsx from "clsx";

export default function ValidatorStatus({
  user,
  validators,
}: {
  user: UserType;
  validators: (ValidatorType & {
    health: { uptime: number; message: string };
  })[];
}) {
  return (
    <Box>
      <Group className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-stretch">
        {validators?.map((validator) => (
          <Card key={validator.id} shadow="sm" padding="lg" withBorder>
            <Box className="-m-5">
              <Table className="w-100">
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Th
                      colSpan={2}
                      className={clsx(
                        validator.health?.message?.toLowerCase() === "ok"
                          ? "text-white bg-green-800"
                          : "text-black bg-gray-300"
                      )}
                    >
                      {validator.health?.message?.toLowerCase() === "ok" ? (
                        <IconCircleCheck className="inline-block" />
                      ) : (
                        <IconAlertTriangle className="inline-block" />
                      )}{" "}
                      {validator.name}{" "}
                      {validator.health?.message?.toLowerCase() === "ok" ? (
                        <Badge className="float-end bg-green-600">Online</Badge>
                      ) : (
                        <Badge className="float-end bg-red-700">Offline</Badge>
                      )}
                    </Table.Th>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Subnets</Table.Th>
                    <Table.Td className="text-right">
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
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Base Url</Table.Th>
                    <Table.Td className="text-right">{validator?.baseApiUrl}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Hotkey</Table.Th>
                    <Table.Td className="relative text-right">
                      <Box className="max-w-[200px] text-ellipsis overflow-hidden float-right">
                        {validator?.hotkey}
                      </Box>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Bittensor Net Uid</Table.Th>
                    <Table.Td className="text-right">{validator?.bittensorNetUid || "-"}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Bittensor Uid</Table.Th>
                    <Table.Td className="text-right">{validator?.bittensorUid || "-"}</Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Verified</Table.Th>
                    <Table.Td className="text-right">{validator?.verified ? "Yes" : "No"}</Table.Td>
                  </Table.Tr>

                  <Table.Tr>
                    <Table.Th colSpan={2}>
                      <UptimeFormatter seconds={validator.health?.uptime} />
                    </Table.Th>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
            </Box>
          </Card>
        ))}
      </Group>
    </Box>
  );
}
