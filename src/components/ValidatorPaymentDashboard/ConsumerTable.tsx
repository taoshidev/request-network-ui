import { Card, Table, Text, Button } from "@mantine/core";
import { useMemo } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { SubscriptionType } from "@/db/types/subscription";

dayjs.extend(relativeTime);

export default function ConsumerTable({
  subscriptions = [],
}: {
  subscriptions: SubscriptionType[];
}) {
  const filteredSubscription = useMemo(() => {
    return subscriptions?.filter((s) => s.active);
  }, [subscriptions]);

  return (
    <Card className="h-full shadow-sm border-gray-200 mt-6" withBorder>
      <Text className="text-base font-bold mb-5">Customers</Text>
      <Table highlightOnHover verticalSpacing="sm" borderColor="#DEE2E6">
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Customer</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Subscription Date</Table.Th>
            <Table.Th>Termination Date</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredSubscription.map((sub: SubscriptionType, index) => (
            <Table.Tr key={index} className="text-sm">
              <Table.Td className="truncate max-w-xs text-orange-500 capitalize">
                {sub?.consumerWalletAddress}
              </Table.Td>
              <Table.Td className="truncate max-w-xs">
                {sub?.user?.email}
              </Table.Td>
              <Table.Td className="truncate max-w-xs">
                {dayjs(sub?.createdAt).format("MMM DD, YYYY")}
              </Table.Td>
              <Table.Td className="truncate max-w-xs">-</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Button className="mt-5" variant="white" color="orange" fullWidth>
        View All Customers
      </Button>
    </Card>
  );
}