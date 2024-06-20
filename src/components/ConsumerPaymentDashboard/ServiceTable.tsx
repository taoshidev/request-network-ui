import { Card, Table, Text, Button } from "@mantine/core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { SubscriptionType } from "@/db/types/subscription";
import { formatter } from "@/utils/number-formatter";
import CurrencyFormatter from "../Formatters/CurrencyFormatter";

dayjs.extend(relativeTime);

export default function ConsumerTable({
  subscriptions = [],
}: {
  subscriptions: SubscriptionType[];
}) {
  return (
    <Card className="h-full shadow-sm border-gray-200 mt-7" withBorder>
      <Text className="text-base font-bold mb-5">All Services</Text>
      <Table.ScrollContainer minWidth={700}>
        <Table highlightOnHover verticalSpacing="sm" borderColor="#DEE2E6">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Renewal Date</Table.Th>
              <Table.Th>Validator</Table.Th>
              <Table.Th>Subnet</Table.Th>
              <Table.Th>Service</Table.Th>
              <Table.Th>Subscription Cost</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {subscriptions.map((sub: SubscriptionType, index) => (
              <Table.Tr key={index} className="text-sm">
                <Table.Td className="truncate text-orange-500 capitalize max-w-xs">
                  {sub?.appName}
                </Table.Td>
                <Table.Td className="truncate max-w-xs">
                  {dayjs(sub?.service?.expire).format("MMM DD, YYYY")}
                </Table.Td>
                <Table.Td className="truncate max-w-xs">
                  {sub?.validator?.name}
                </Table.Td>
                <Table.Td className="truncate max-w-xs">
                  {sub?.endpoint?.subnet?.netUid}
                </Table.Td>
                <Table.Td className="truncate max-w-xs">
                  {sub?.service?.name}
                </Table.Td>
                <Table.Td className="truncate max-w-xs">
                  <CurrencyFormatter
                    price={sub?.service?.price}
                    currencyType={sub?.service?.currencyType}
                  />
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
      <Button className="mt-5" variant="white" color="orange" fullWidth>
        View All Services
      </Button>
    </Card>
  );
}
