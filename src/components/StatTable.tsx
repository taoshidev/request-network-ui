"use client";

import { Fragment } from "react";
import dayjs from "dayjs";
import { Title, Box, Table } from "@mantine/core";
import { KeyType } from "@/db/types/key";
import { ValidatorType } from "@/db/types/validator";

export type ValidatorKeyType = { validator: ValidatorType & { keys: KeyType } };

export function StatTable({
  data,
  caption = "",
}: {
  data: { validator: ValidatorKeyType | ValidatorKeyType[] };
  caption?: string;
}) {
  return (
    <Box my="xl">
      {(caption.length === 0 || (Array.isArray(data) && data?.length > 0)) && (
        <Fragment>
          {data && (
            <Title size="sm" order={2}>
              {caption ? caption : "Usage Statistics"}
            </Title>
          )}
          <Table
            className="mt-3 mb-6"
            highlightOnHover
            striped={Array.isArray(data)}
            verticalSpacing="md"
          >
            <Table.Thead>
              <Table.Tr>
                {caption && <Table.Th>Key Name</Table.Th>}
                <Table.Th>Created</Table.Th>
                <Table.Th>Expires</Table.Th>
                <Table.Th>Remaining</Table.Th>
                <Table.Th>Refill Frequency</Table.Th>
                <Table.Th>Refill Amount</Table.Th>
                <Table.Th>Rate Limit Type</Table.Th>
                <Table.Th>Rate Limit</Table.Th>
                <Table.Th>Refill Rate</Table.Th>
                <Table.Th>Refill Interval</Table.Th>
                {!caption && <Table.Th>Status</Table.Th>}
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {(Array.isArray(data) && data.length > 0 ? data : [data]).map(
                (key, i) => (
                  <Table.Tr key={`${key?.id}-${i}`}>
                    {caption && <Table.Td>{key?.name}</Table.Td>}
                    <Table.Td>
                      {dayjs(key?.createdAt).format("MMM DD, YYYY")}
                    </Table.Td>
                    <Table.Td>
                      {dayjs(key?.expires).format("MMM DD, YYYY")}
                    </Table.Td>
                    <Table.Td>{key?.remaining}</Table.Td>
                    <Table.Td>{key?.refill?.interval || "-"}</Table.Td>
                    <Table.Td>{key?.refill?.amount || "-"}</Table.Td>
                    <Table.Td>{key?.ratelimit?.type || "-"}</Table.Td>
                    <Table.Td>{key?.ratelimit?.limit || "-"}</Table.Td>
                    <Table.Td>{key?.ratelimit?.refillRate || "-"}</Table.Td>
                    <Table.Td>{key?.ratelimit?.refillInterval || "-"}</Table.Td>
                    {!caption && (
                      <Table.Td>
                        {key?.enabled ? "Enabled" : "Disabled"}
                      </Table.Td>
                    )}
                  </Table.Tr>
                )
              )}
            </Table.Tbody>
          </Table>
        </Fragment>
      )}
    </Box>
  );
}
