import { EndpointType } from "@/db/types/endpoint";
import { ValidatorWithInfo } from "@/db/types/validator";
import { Badge, Box, Card, Table, Text } from "@mantine/core";
import { IconAlertTriangle, IconCircleCheck } from "@tabler/icons-react";
import clsx from "clsx";
import UptimeFormatter from "../Formatters/UptimeFormatter";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";

export default function ValidatorStatus({
  validator,
}: {
  validator: ValidatorWithInfo;
}) {
  const [reqTime, setReqTime] = useState(DateTime.now());
  const [validatorUptime, setValidatorUptime] = useState<number | null>(
    validator.health?.uptime
  );
  const [uptime, setUptime] = useState<number | null>(null);

  useEffect(() => {
    if (validatorUptime) {
      setUptime(
        validatorUptime +
          DateTime.now().diff(reqTime).toObject()?.milliseconds / 1000
      );
    } else {
      setUptime(null);
    }

    const interval = setInterval(() => {
      if (validatorUptime) {
        setUptime(
          validatorUptime +
            DateTime.now().diff(reqTime).toObject()?.milliseconds / 1000
        );
      } else {
        setUptime(null);
      }
    }, 1000);

    return () => clearTimeout(interval);
  }, [validatorUptime, reqTime]);

  useEffect(() => {
    setValidatorUptime(validator.health?.uptime);
    setReqTime(DateTime.now());
  }, [validator.health?.uptime]);

  return (
    <Card
      shadow="sm"
      padding="lg"
      withBorder
      className={clsx(
        "card-table",
        validator.health?.message?.toLowerCase() !== "ok" && "opacity-70"
      )}
    >
      <Box className="-m-2 -mt-5 pb-[5rem]">
        <Box
          className={clsx(
            "p-3 -mx-3",
            validator.health?.message?.toLowerCase() === "ok"
              ? "text-green-800"
              : "text-black"
          )}
        >
          {validator.health?.message?.toLowerCase() === "ok" ? (
            <IconCircleCheck className="inline-block" />
          ) : (
            <IconAlertTriangle className="inline-block" />
          )}{" "}
          {validator.name}{" "}
          {validator.health?.message?.toLowerCase() === "ok" ? (
            <Badge className="float-end bg-green-600 zoom in">Online</Badge>
          ) : (
            <Badge className="float-end bg-red-700 zoom in">Offline</Badge>
          )}
        </Box>
        <Table className="w-100 table-align-top">
          <Table.Tbody>
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
              <Table.Th>Net Uid</Table.Th>
              <Table.Td className="text-right">
                {validator?.bittensorNetUid || "-"}
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
              <Table.Th>Verified</Table.Th>
              <Table.Td className="text-right">
                {validator?.verified ? "Yes" : "No"}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Td colSpan={2}>
                <Box className="flex justify-center">
                  {validator?.stripeEnabled &&
                    validator.endpoints?.some((endpoint) =>
                      endpoint?.contract?.services?.some(
                        (service) => +service.price !== 0
                      )
                    ) && (
                      <Badge className="ml-1" color="darkblue">
                        Stripe
                      </Badge>
                    )}
                  {validator?.payPalEnabled &&
                    validator.endpoints?.some((endpoint) =>
                      endpoint?.contract?.services?.some(
                        (service) => +service.price !== 0
                      )
                    ) && (
                      <Badge className="ml-1" color="blue">
                        PayPal
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
                        +service.price !== 0 && service.currencyType === "USDC"
                    )
                  ) && (
                    <Badge className="ml-1" color="#c49f55">
                      USDC
                    </Badge>
                  )}{" "}
                  {validator.endpoints?.some((endpoint) =>
                    endpoint?.contract?.services?.some(
                      (service) =>
                        +service.price !== 0 && service.currencyType === "USDT"
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
        <Box className="absolute w-full bottom-0 left-0 pb-2 pl-2 pr-2">
          <Text className="px-3 py-1 text-sm font-bold text-center border-b border-t">
            Uptime
          </Text>
          <UptimeFormatter seconds={uptime} />
        </Box>
      </Box>
    </Card>
  );
}
