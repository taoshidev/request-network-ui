"use client";

import { EndpointType } from "@/db/types/endpoint";
import { UserType } from "@/db/types/user";
import { ValidatorType } from "@/db/types/validator";
import { Badge, Box, Card, Group, Table, Text } from "@mantine/core";
import UptimeFormatter from "./UptimeFormatter";
import { IconAlertTriangle, IconCircleCheck } from "@tabler/icons-react";
import clsx from "clsx";
import useSWR from "swr";
import { getValidatorStatusPage } from "@/actions/validators";
import { cloneDeep as _cloneDeep } from "lodash";

export default function ValidatorStatus({
  user,
  initialValidators,
}: {
  user: UserType;
  initialValidators: (ValidatorType & {
    health: { uptime: number; message: string };
  })[];
}) {
  const requestRate = 10; // send request every 10 seconds
  let count = 0;
  let { data: validators } = useSWR(
    "/validator-status",
    async () => {
      if (count < requestRate) {
        count++;
        return _cloneDeep(
          validators.map((validator) => {
            if (validator.health.uptime) {
              validator.health.uptime += 1;
            }
            return validator;
          })
        );
      }
      count = 0;
      return await getValidatorStatusPage(user);
    },
    {
      fallbackData: initialValidators,
      refreshInterval: 1000,
    }
  );

  return (
    <Box>
      <Group className="flex items-stretch grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 justify-items-stretch">
        {validators?.map((validator) => (
          <Card key={validator.id} shadow="sm" padding="lg" withBorder>
            <Box className="-m-5 pb-[5.1rem]">
              <Table className="w-100 table-align-top">
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
                        <Badge className="float-end bg-green-600 zoom in">
                          Online
                        </Badge>
                      ) : (
                        <Badge className="float-end bg-red-700 zoom in">
                          Offline
                        </Badge>
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
                    <Table.Td className="text-right">
                      {validator?.baseApiUrl}
                    </Table.Td>
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
                    <Table.Th>
                      Bittensor
                      <br />
                      Net Uid
                    </Table.Th>
                    <Table.Td className="text-right">
                      {validator?.bittensorNetUid || "-"}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Bittensor Uid</Table.Th>
                    <Table.Td className="text-right">
                      {validator?.bittensorUid || "-"}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Verified</Table.Th>
                    <Table.Td className="text-right">
                      {validator?.verified ? "Yes" : "No"}
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td colSpan={2}>
                      <Box className="flex justify-center">
                        {validator?.stripeEnabled &&
                          (validator.endpoints?.length || 0) !== 0 && (
                            <Badge className="ml-1" color="darkblue">
                              Stripe
                            </Badge>
                          )}
                        {validator.endpoints?.some((endpoint) =>
                          endpoint?.contract?.services?.some(
                            (service) => +service.price === 0
                          )
                        ) && (
                          <Badge className="ml-1 text-black" color="#ccc">
                            FREE
                          </Badge>
                        )}
                        {validator.endpoints?.some((endpoint) =>
                          endpoint?.contract?.services?.some(
                            (service) =>
                              +service.price !== 0 &&
                              service.currencyType === "USDC"
                          )
                        ) && (
                          <Badge className="ml-1" color="#c49f55">
                            USDC
                          </Badge>
                        )}{" "}
                        {validator.endpoints?.some((endpoint) =>
                          endpoint?.contract?.services?.some(
                            (service) =>
                              +service.price !== 0 &&
                              service.currencyType === "USDT"
                          )
                        ) && (
                          <Badge className="ml-1" color="green">
                            USDT
                          </Badge>
                        )}
                        {(validator.endpoints?.length || 0) === 0 && (
                          <Badge className="ml-1 text-black " color="#ccc">
                            No Active Endpoints
                          </Badge>
                        )}
                      </Box>
                    </Table.Td>
                  </Table.Tr>
                </Table.Tbody>
              </Table>
              <Box className="absolute w-full bottom-0 left-0 pb-2">
                <Text className="px-3 text-sm font-bold text-center border border-top">
                  Uptime
                </Text>
                <UptimeFormatter seconds={validator.health?.uptime} />
              </Box>
            </Box>
          </Card>
        ))}
      </Group>
    </Box>
  );
}
