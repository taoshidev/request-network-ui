import { TextEditor } from "@/components/TextEditor";
import { ValidatorType } from "@/db/types/validator";
import { Title, Box, Table, Text } from "@mantine/core";
import { isEmpty as _isEmpty } from "lodash";
import React from "react";
import { DateTime } from 'luxon';

export default function ReviewValidatorEndpoint({ form, contracts, errors }) {

  return (
    <>
      <Title order={2} className="text-center mt-7">
        Review Validator Details
      </Title>
      <Box className="flex justify-center w-full mb-16">
        <Box className="w-full overflow-y-auto">
          <Table miw={600} verticalSpacing="xs">
            <Table.Tbody>
              <Table.Tr>
                <Table.Th colSpan={1} w={200}>
                  Validator Name
                </Table.Th>
                <Table.Td colSpan={3}>{form.values.name}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th colSpan={1}>Description</Table.Th>
                <Table.Td colSpan={3}>
                  <TextEditor<ValidatorType>
                    type="BubbleEditor"
                    editable={false}
                    html={form.values.description as string}
                  />
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th colSpan={1}>Wallet Address</Table.Th>
                <Table.Td colSpan={1}>{form.values.walletAddress}</Table.Td>
                <Table.Th colSpan={1}>Hot Key</Table.Th>
                <Table.Td colSpan={1}>{form.values.hotkey}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Base Api Url</Table.Th>
                <Table.Td>{form.values.baseApiUrl}</Table.Td>
                <Table.Th>Path</Table.Th>
                <Table.Td>{form.values.url}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Contract</Table.Th>
                <Table.Td>
                  {
                    contracts?.find(
                      (contract) => contract.id === form.values.contractId
                    )?.title
                  }
                </Table.Td>
              </Table.Tr>
              {contracts
                ?.find((contract) => contract.id === form.values.contractId)
                ?.services.map((service, index) => (
                  <React.Fragment key={index}>
                    <Table.Tr>
                      <Table.Th
                        className="bg-slate-400 text-white text-lg py-1"
                        colSpan={4}
                      >
                        {service.name}
                      </Table.Th>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th>Refill Rate</Table.Th>
                      <Table.Td>{service.refillRate}</Table.Td>
                      <Table.Th>Refill Interval</Table.Th>
                      <Table.Td>{service.refillInterval}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th>Remaining</Table.Th>
                      <Table.Td>{service.remaining}</Table.Td>
                      <Table.Th>Active</Table.Th>
                      <Table.Td>{service.active ? "Yes" : "No"}</Table.Td>
                    </Table.Tr>
                    <Table.Tr>
                      <Table.Th>Currency Type</Table.Th>
                      <Table.Td>{service.currencyType}</Table.Td>
                      <Table.Th>Expires</Table.Th>
                      <Table.Td>
                        {DateTime.fromJSDate(service.expires).toFormat("f")}
                      </Table.Td>
                    </Table.Tr>
                  </React.Fragment>
                ))}
            </Table.Tbody>
          </Table>
        </Box>
      </Box>
      {Object.keys(errors).map((key) => (
        <Text className="text-center text-red-600" key={key}>
          <b>{key}</b>: {errors[key]}
        </Text>
      ))}
    </>
  );
}
