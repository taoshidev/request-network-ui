"use client";

import { Fragment, useMemo, useEffect, useState } from "react";
import { Alert, Text, Box, Button, Title } from "@mantine/core";
import TransactionsTable from "@/components/ValidatorPaymentDashboard/TransactionTable";
import { IconAlertCircle } from "@tabler/icons-react";
import { formatter } from "@/utils/number-formatter";
import { StatCard } from "@/components/ValidatorPaymentDashboard/StatCard";
import { UserType } from "@/db/types/user";
import { ValidatorType } from "@/db/types/validator";
import { ContractType } from "@/db/types/contract";
import { ValidatorKeyType } from "@/components/StatTable";
import { SubscriptionType } from "@/db/types/subscription";
import ConsumerTable from "@/components/ValidatorPaymentDashboard/ConsumerTable";
import RevenueOverTime from "@/components/ValidatorPaymentDashboard/RevenueOverTime";
import RequestOverTime from "@/components/ValidatorPaymentDashboard/RequestOverTime";
import PaymentHistory from "@/components/ValidatorPaymentDashboard/PaymentHistory";
import ConsumerMakeup from "@/components/ValidatorPaymentDashboard/ConsumerMakeup";
import dayjs from "dayjs";

const aggregateData = (data, format = "MM/DD/YY") => {
  const aggregatedData = {};

  data.forEach(({ time, amount, success }) => {
    const date = dayjs(time).format(format);
    const value = amount || success;

    if (aggregatedData[date]) {
      aggregatedData[date] += value;
    } else {
      aggregatedData[date] = value;
    }
  });

  return Object.keys(aggregatedData)
    .sort((a, b) => dayjs(a, format).unix() - dayjs(b, format).unix())
    .map((date) => ({
      x: date,
      y: aggregatedData[date],
    }));
};

const fillMissingDates = (data, days = 30) => {
  const filledData = {};
  const lastDays = Array.from({ length: days }, (item, i) =>
    dayjs().subtract(i, "day").format("MM/DD/YY")
  ).reverse();

  lastDays.forEach((date) => {
    filledData[date] = 0;
  });

  data.forEach(({ x, y }) => {
    filledData[x] = y;
  });

  return Object.keys(filledData).map((date) => ({
    x: date,
    y: filledData[date],
  }));
};

const fillMissingDatesForPaymentHistory = (data, days = 60) => {
  const filledData = {};
  const lastDays = Array.from({ length: days }, (item, i) =>
    dayjs().subtract(i, "day").format("YYYY-MM-DD")
  ).reverse();

  lastDays.forEach((date) => {
    filledData[date] = 0;
  });

  data.forEach(({ x, y }) => {
    filledData[x] = y;
  });

  return Object.keys(filledData).map((date) => ({
    day: date,
    value: filledData[date],
  }));
};

const generateConsumerMakeupData = (stats) => {
  const endpoints = stats?.validator?.endpoints || [];

  return endpoints.map((endpoint) => ({
    id: endpoint.url,
    label: endpoint.url,
    value: endpoint.subscriptions?.length || 0,
  }));
};

export function ValidatorPaymentDashboard({
  user,
  validator,
  stats,
  contracts,
  proxyServices,
}: {
  user: UserType;
  validator: ValidatorType;
  stats: ValidatorKeyType[];
  contracts: ContractType[];
  proxyServices: any;
}) {
  const [transactions, setTransactions] = useState(
    proxyServices?.transactions || []
  );
  const [revenueData, setRevenueData] = useState<
    { id: string; color: string; data: { x: string; y: number }[] }[]
  >([]);

  const [requestData, setRequestData] = useState<
    { id: string; color: string; data: { x: string; y: number }[] }[]
  >([]);

  const [paymentHistoryData, setPaymentHistoryData] = useState<any[]>([]);
  const [consumerMakeupData, setConsumerMakeupData] = useState<any[]>([]);

  const [subscriptions, setSubscriptions] = useState<SubscriptionType[]>([]);

  const totalSuccessfulRequest = useMemo(() => {
    const successes =
      stats?.flatMap((s) => {
        const keys = s?.validator?.keys;
        if (!Array.isArray(keys)) return 0;
        return keys.map((k) => k.usage.success);
      }) || [];
    return successes.reduce((total, success) => total + success, 0);
  }, [stats]);

  const totalIncome = useMemo(() => {
    const amount = transactions?.flatMap((t) => t.amount || 0);
    return amount.reduce((total, amt) => total + amt, 0);
  }, [transactions]);

  useEffect(() => {
    const tx = proxyServices?.flatMap((ps) => ps.transactions) || [];
    setTransactions(
      tx.sort((a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix())
    );

    const aggregatedRevenueData = fillMissingDates(
      aggregateData(
        tx.map((transaction) => ({
          time: transaction.createdAt,
          amount: transaction.amount,
        })),
        "MM/DD/YY"
      )
    );

    setRevenueData([
      {
        id: "revenue",
        color: "hsl(220, 70%, 50%)",
        data: aggregatedRevenueData,
      },
    ]);

    const paymentHistory = fillMissingDatesForPaymentHistory(
      aggregateData(
        tx.map((transaction) => ({
          time: transaction.createdAt,
          amount: 1,
        })),
        "YYYY-MM-DD"
      ),
      60
    );

    setPaymentHistoryData(paymentHistory);
  }, [proxyServices]);

  useEffect(() => {
    const usageData = stats
      ?.flatMap((s) => {
        const keys = s?.validator?.keys;
        if (!Array.isArray(keys)) return 0;
        return keys.flatMap((k) => k.monthlyUsage);
      })
      .sort((a, b) => dayjs(a.time).unix() - dayjs(b.time).unix());

    const aggregatedRequestData = aggregateData(usageData);

    setRequestData([
      {
        id: "requests",
        color: "hsl(220, 70%, 50%)",
        data: aggregatedRequestData,
      },
    ]);

    const consumerMakeup = generateConsumerMakeupData(stats?.[0]);
    setConsumerMakeupData(consumerMakeup);
  }, [stats]);

  useEffect(() => {
    const vali = validator?.endpoints?.flatMap((e) => e.subscriptions) || [];
    setSubscriptions(vali);
  }, [validator]);

  return (
    <Fragment>
      <Title className="text-2xl mb-7">Network Overview</Title>
      <Box className="grid grid-cols-[70px_134px] gap-2">
        <Text className="mb-10 text-sm">
          Subnet:{" "}
          <span className="text-orange-500">
            {Array.from(new Map(validator?.endpoints?.map((e) => e))).length}
          </span>
        </Text>
        <Text className="mb-10 text-sm">
          Validator: <span className="text-orange-500">{validator?.name}</span>
        </Text>
      </Box>

      <Alert
        className="shadow-sm border-gray-200"
        color="orange"
        icon={<IconAlertCircle />}
      >
        <Text className="mb-7 text-zinc-800 text-base font-medium">
          Enim sunt in sint labore. Sit veniam do amet voluptate officia do
          tempor
        </Text>
        <Text className="mb-7 text-zinc-800 text-base font-normal">
          Qui adipisicing enim sunt ea quis commodo aute consequat ad et qui
          cillum ipsum pariatur ea. Ad elit Lorem anim cupidatat aliqua pariatur
          eu eiusmod. Qui esse ut tempor anim nisi velit Lorem quis laboris in
          amet qui.
        </Text>
        <Button>OK, I got it</Button>
      </Alert>

      <Box className="flex justify-between bg-gray-100 mt-[40px] mb-2">
        <StatCard
          title="Total Income"
          value={formatter.format(totalIncome)}
          percentage="+10.04%"
          comparison="Compared to last month"
          isPositive
        />
        <StatCard
          title="Total Requests"
          value={totalSuccessfulRequest}
          percentage="+10.04%"
          comparison="Compared to last month"
          isPositive
        />
        <StatCard
          title="Consumers"
          value={
            Array.isArray(stats?.[0]?.validator?.keys)
              ? stats?.[0]?.validator?.keys?.length.toString()
              : "0"
          }
          percentage="-0.04%"
          comparison="Compared to last month"
          isPositive={false}
        />
        <StatCard
          title="Health"
          value="95%"
          percentage="-0.01%"
          comparison="Compared to last month"
          isPositive={false}
          bgColor="bg-orange-500 text-white"
        />
      </Box>

      <Box className="grid grid-cols-[3fr_1fr] gap-5 gap-y-7 mt-7">
        {revenueData.length > 0 ? (
          <Box className="">
            <RevenueOverTime data={revenueData} />
          </Box>
        ) : (
          <Alert
            className="shadow-sm border-gray-200"
            color="orange"
            icon={<IconAlertCircle />}
          >
            <Text className="mb-7 text-zinc-800 text-base font-medium">
              There&apos;s not enough data for this validator to generate
              revenue data.
            </Text>
            <Text className="mb-7 text-zinc-800 text-base font-normal">
              Once customers the payment data will be aggregated and available
              here.
            </Text>
          </Alert>
        )}
        {paymentHistoryData?.length > 0 ? (
          <PaymentHistory data={paymentHistoryData} />
        ) : (
          <Alert
            className="shadow-sm border-gray-200"
            color="orange"
            icon={<IconAlertCircle />}
          >
            <Text className="mb-7 text-zinc-800 text-base font-medium">
              There&apos;s not enough payment history to generate data data.
            </Text>
            <Text className="mb-7 text-zinc-800 text-base font-normal">
              Once customers starts making payments, data will be aggregated and
              available here.
            </Text>
          </Alert>
        )}
        {requestData?.length > 0 ? (
          <Box className="">
            <RequestOverTime data={requestData} />
          </Box>
        ) : (
          <Alert
            className="shadow-sm border-gray-200"
            color="orange"
            icon={<IconAlertCircle />}
          >
            <Text className="mb-7 text-zinc-800 text-base font-medium">
              There&apos;s not enough data for this validator to generate usage
              data data.
            </Text>
            <Text className="mb-7 text-zinc-800 text-base font-normal">
              Once customers starts sending requests, data will be aggregated
              and available here.
            </Text>
          </Alert>
        )}
        {consumerMakeupData?.length > 0 ? (
          <ConsumerMakeup data={consumerMakeupData} />
        ) : (
          <Alert
            className="shadow-sm border-gray-200"
            color="orange"
            icon={<IconAlertCircle />}
          >
            <Text className="mb-7 text-zinc-800 text-base font-medium">
              There&apos;s not customer data for this validator data.
            </Text>
            <Text className="mb-7 text-zinc-800 text-base font-normal">
              Once there are enough data, the graph will be generated here.
            </Text>
          </Alert>
        )}
      </Box>
      <Box className="mt-5">
        <TransactionsTable transactions={transactions} />
      </Box>
      <ConsumerTable subscriptions={subscriptions} />
    </Fragment>
  );
}
