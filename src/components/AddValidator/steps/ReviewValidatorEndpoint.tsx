import { TextEditor } from "@/components/TextEditor";
import { ValidatorType } from "@/db/types/validator";
import { Title, Box, Table, Text } from "@mantine/core";
import { isEmpty as _isEmpty } from "lodash";
import React from "react";
import CurrencyFormatter from "@/components/Formatters/CurrencyFormatter";
import FixedFormatter from "@/components/Formatters/FixedFormatter";
import { constructEndpointUrl } from "@/utils/endpoint-url";
import dayjs from "dayjs";
import { PAYMENT_TYPE } from "@/interfaces/enum/payment-type-enum";
import TierPurchaseOption from "@/components/SubscriptionPage/TierPurchaseOption";
import { SubscriptionType } from "@/db/types/subscription";

export default function ReviewValidatorEndpoint({ form, contracts, errors }) {
  return (
    <div className="w-full slide">
      <Box className="flex justify-center w-full mb-16">
        <Box className="w-full overflow-y-auto">
          <Table.ScrollContainer minWidth={700}>
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
                  <Table.Td colSpan={3} className="editor-bg-none">
                    <TextEditor<ValidatorType>
                      type="BubbleEditor"
                      editable={false}
                      html={form.values.description as string}
                    />
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th colSpan={1}>ERC-20 Wallet Address</Table.Th>
                  <Table.Td colSpan={1}>
                    {form.values.walletAddress || "Not Applicable"}
                  </Table.Td>
                  <Table.Th colSpan={1}>Hot Key</Table.Th>
                  <Table.Td colSpan={1}>{form.values.hotkey}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th>Base Api Url</Table.Th>
                  <Table.Td>{form.values.baseApiUrl}</Table.Td>
                  <Table.Th>Path</Table.Th>
                  <Table.Td>
                    {constructEndpointUrl(
                      form?.values?.url,
                      form?.values?.percentRealtime
                    )}
                  </Table.Td>
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
                          {+service.price === 0 ? (
                            <span className="float-right">
                              {service.paymentType ===
                              PAYMENT_TYPE.PAY_PER_REQUEST
                                ? "Pay Per Request"
                                : "FREE"}
                            </span>
                          ) : (
                            <span className="float-right">
                              <CurrencyFormatter
                                price={service?.price}
                                currencyType={service?.currencyType}
                              />
                            </span>
                          )}
                        </Table.Th>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Th>Refill Interval</Table.Th>
                        <Table.Td>
                          <FixedFormatter value={service.refillInterval} /> ms
                        </Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Th>Requests</Table.Th>
                        <Table.Td>
                          <FixedFormatter value={service.remaining} />
                        </Table.Td>
                        <Table.Th>Active</Table.Th>
                        <Table.Td>{service.active ? "Yes" : "No"}</Table.Td>
                      </Table.Tr>
                      <Table.Tr>
                        <Table.Th>Currency Type</Table.Th>
                        <Table.Td>{service.currencyType}</Table.Td>
                        <Table.Th>Expires</Table.Th>
                        <Table.Td>
                          {service.expires
                            ? dayjs(service.expires).format("MMM DD, YYYY")
                            : "No Expiry"}
                        </Table.Td>
                      </Table.Tr>
                      {service.paymentType === PAYMENT_TYPE.PAY_PER_REQUEST && (
                        <>
                          <Table.Tr>
                            <Table.Th
                              className="bg-slate-400 text-white text-lg py-1"
                              colSpan={4}
                            >
                              Tiered Pricing Preview{" "}
                              <span className="float-end">
                                *Visible to consumers
                              </span>
                            </Table.Th>
                          </Table.Tr>
                          <Table.Tr>
                            <Table.Td colSpan={4}>
                              <Box className="-mx-[10px]">
                                <TierPurchaseOption
                                  subscription={
                                    {
                                      service,
                                    } as SubscriptionType
                                  }
                                  preview={true}
                                />
                              </Box>
                            </Table.Td>
                          </Table.Tr>
                        </>
                      )}
                    </React.Fragment>
                  ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Box>
      </Box>
      {Object.keys(errors).map((key) => (
        <Text className="text-center text-red-600" key={key}>
          <b>{key}</b>: {errors[key]}
        </Text>
      ))}
    </div>
  );
}
