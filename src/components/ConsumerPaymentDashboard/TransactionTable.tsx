import { Card, Table, Text, Button } from "@mantine/core";
import { useMemo } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { TransactionType } from "@/interfaces/transaction-type";
import { formatter } from "@/utils/number-formatter";

dayjs.extend(relativeTime);

export default function TransactionsTable({
  transactions = [],
}: {
  transactions: TransactionType[];
}) {
  const latestTransactions = useMemo(() => {
    return transactions.slice(0, 25);
  }, [transactions]);

  return (
    <Card className="h-full shadow-sm border-gray-200 mt-7" withBorder>
      <Text className="text-base font-bold mb-5">
        Latest {transactions?.length >= 25 ? "25" : transactions?.length} from a
        total of <span className="text-orange-500">{transactions?.length}</span>{" "}
        transactions
      </Text>
      <Table highlightOnHover verticalSpacing="sm" borderColor="#DEE2E6">
        <Table.Thead>
          {/* <Table.Tr>
            <Table.Th>Hash</Table.Th>
            <Table.Th>Time</Table.Th>
            <Table.Th>From</Table.Th>
            <Table.Th>Amount</Table.Th>
          </Table.Tr> */}
        </Table.Thead>
        <Table.Tbody>
          {latestTransactions.map((tx: TransactionType, index) => (
            <Table.Tr key={index} className="text-sm">
              <Table.Td className="truncate max-w-xs">
                Hash:{" "}
                <span className="text-orange-500 capitalize">
                  {tx?.transactionHash}
                </span>
              </Table.Td>
              <Table.Td className="truncate max-w-xs">
                {dayjs(tx?.createdAt).fromNow()}
              </Table.Td>
              <Table.Td className="truncate max-w-xs">
                From:{" "}
                <span className="text-orange-500 capitalize">
                  {tx?.fromAddress}
                </span>
              </Table.Td>
              <Table.Td className="truncate max-w-xs">
                {formatter.format(tx?.amount)} {tx?.tokenAddress}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      <Button className="mt-5" variant="white" color="orange" fullWidth>
        View All Transactions
      </Button>
    </Card>
  );
}
