import { useMemo } from "react";
import {
  format,
  getDaysInMonth,
  startOfMonth,
  isToday,
  addDays,
  getDay,
} from "date-fns";
import { Box, Text, Card } from "@mantine/core";
import clsx from "clsx";
import { TransactionType } from "@/interfaces/transaction-type";

interface PaymentStatusCalendarProps {
  transactions: TransactionType[];
}

const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function PaymentStatusCalendar({
  transactions,
}: PaymentStatusCalendarProps) {
  const today = new Date();
  const startOfMonthDate = startOfMonth(today);
  const midMonthDate = addDays(startOfMonthDate, 14);
  const endOfMonthDate = addDays(startOfMonthDate, getDaysInMonth(today) - 1);

  const start =
    today.getDate() < 15 ? startOfMonthDate.getTime() : midMonthDate.getTime();
  const end =
    today.getDate() < 15 ? midMonthDate.getTime() : endOfMonthDate.getTime();

  const daysWithPayments = useMemo(() => {
    return transactions.reduce(
      (acc: { [key: string]: boolean }, transaction) => {
        const date = format(new Date(transaction.createdAt), "yyyy-MM-dd");
        acc[date] = true;
        return acc;
      },
      {}
    );
  }, [transactions]);

  const days: JSX.Element[] = [];
  const startDay = today.getDate() < 15 ? 1 : 15;
  const daysInRange = today.getDate() < 15 ? 15 : getDaysInMonth(today);

  for (let i = startDay; i <= daysInRange; i++) {
    const date = new Date(startOfMonthDate);
    date.setDate(i);
    const dateString = format(date, "yyyy-MM-dd");
    const isPaymentDay = daysWithPayments[dateString];
    const isTodayDate = isToday(date);
    const dayOfWeek = daysOfWeek[getDay(date)];

    days.push(
      <Box>
        <Box
          key={i}
          className={clsx(
            "flex flex-col items-center justify-center m-2 p-[0.95rem]",
            {
              "bg-orange-500 text-white": isPaymentDay,
              "border-2 border-red-500": isTodayDate,
              "bg-gray-200": !isPaymentDay && !isTodayDate,
            }
          )}
          style={{ minWidth: "40px" }}
        >
          <Text className="text-sm">{i}</Text>
        </Box>
        <Box className="flex flex-col items-center justify-center">
          {!isPaymentDay && !isTodayDate && (
            <Text className="text-xs">{dayOfWeek}</Text>
          )}
          {isPaymentDay && <Text className="text-xs">paid</Text>}
          {isTodayDate && <Text className="text-xs">today</Text>}
        </Box>
      </Box>
    );
  }

  const columns = days.length;

  return (
    <Card className="shadow-sm border-gray-200" withBorder>
      <Text className="text-base mb-5 text-zinc-800 font-normal">
        Payment Status{" "}
        <span className="float-right text-sm font-normal text-neutral-400">
          {`(Last ${columns} Days)`}
        </span>
      </Text>
      <Box
        className="grid"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {days}
      </Box>
    </Card>
  );
}
