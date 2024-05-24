"use client";

import { Fragment, useMemo, useEffect, useState } from "react";
import { Alert, Text, Box, Button, Title, Select } from "@mantine/core";
import TransactionsTable from "@/components/ValidatorPaymentDashboard/TransactionTable";
import { IconAlertCircle } from "@tabler/icons-react";
import { formatter } from "@/utils/number-formatter";
import { StatCard } from "@/components/ValidatorPaymentDashboard/StatCard";
import { ValidatorType } from "@/db/types/validator";
import { ValidatorKeyType } from "@/components/StatTable";
import { SubscriptionType } from "@/db/types/subscription";
import { EndpointType } from "@/db/types/endpoint";
import ConsumerTable from "@/components/ValidatorPaymentDashboard/ConsumerTable";
import RevenueOverTime from "@/components/ValidatorPaymentDashboard/RevenueOverTime";
import RequestOverTime from "@/components/ValidatorPaymentDashboard/RequestOverTime";
import PaymentHistory from "@/components/ValidatorPaymentDashboard/PaymentHistory";
import ConsumerMakeup from "@/components/ValidatorPaymentDashboard/ConsumerMakeup";
import {
  aggregateData,
  fillMissingDates,
  fillMissingDatesForPaymentHistory,
  calculatePercentageChange,
} from "@/utils/validators";

import dayjs from "dayjs";

const generateConsumerMakeupData = (endpoints: EndpointType[] = []) => {
  return endpoints.map((endpoint) => ({
    id: endpoint?.url,
    label: endpoint?.url,
    value: endpoint?.subscriptions?.length || 0,
  }));
};

export function ValidatorPaymentDashboard({
  validator,
  stats,
  currentTransactions,
  previousTransactions,
  currentSubscriptions,
  previousSubscriptions,
}: {
  validator: ValidatorType;
  stats: ValidatorKeyType[];
  currentTransactions: any[];
  previousTransactions: any[];
  currentSubscriptions: SubscriptionType[];
  previousSubscriptions: SubscriptionType[];
}) {
  const [transactions, setTransactions] = useState(currentTransactions);
  const [revenueData, setRevenueData] = useState<
    { id: string; color: string; data: { x: string; y: number }[] }[]
  >([]);
  const [requestData, setRequestData] = useState<
    { id: string; color: string; data: { x: string; y: number }[] }[]
  >([]);
  const [paymentHistoryData, setPaymentHistoryData] = useState<
    { day: string; value: number }[]
  >([]);
  const [consumerMakeupData, setConsumerMakeupData] = useState<
    { id: string; label: string; value: number }[]
  >([]);
  const [subscriptions, setSubscriptions] =
    useState<SubscriptionType[]>(currentSubscriptions);
  const [selectedSubscription, setSelectedSubscription] = useState<
    string | null
  >(null);

  const monthlyRequests = useMemo(() => {
    const monthlyUsage =
      stats?.flatMap((s) => {
        let keys: any = s?.validator?.keys;
        if (!Array.isArray(keys)) return [];
        if (selectedSubscription)
          keys = keys.filter(
            (k) => k?.meta?.subscription?.serviceId === selectedSubscription
          );

        return keys.flatMap((k) => k.monthlyUsage);
      }) || [];
    return monthlyUsage.reduce((total, { success }) => total + success, 0);
  }, [stats, selectedSubscription]);

  const previousMonthlyRequests = useMemo(() => {
    const prevMonthlyUsage =
      stats?.flatMap((s) => {
        const keys = s?.validator?.keys;
        if (!Array.isArray(keys)) return 0;
        return keys.flatMap((k) => k.prevMonthlyUsage);
      }) || [];
    return prevMonthlyUsage.reduce((total, { success }) => total + success, 0);
  }, [stats]);

  const requestPercentageChange = useMemo(
    () => calculatePercentageChange(monthlyRequests, previousMonthlyRequests),
    [monthlyRequests, previousMonthlyRequests]
  );

  const totalIncome = useMemo(() => {
    const amount = transactions?.flatMap((t) => t.amount || 0);
    return amount.reduce((total, amt) => total + amt, 0);
  }, [transactions]);

  const previousTotalIncome = useMemo(() => {
    const amount = previousTransactions?.flatMap((t) => t.amount || 0);
    return amount.reduce((total, amt) => total + amt, 0);
  }, [previousTransactions]);

  const incomePercentageChange = useMemo(
    () => calculatePercentageChange(totalIncome, previousTotalIncome),
    [totalIncome, previousTotalIncome]
  );

  const currentConsumers = useMemo(() => {
    if (selectedSubscription)
      return (
        currentSubscriptions?.filter((s) => s.id === selectedSubscription)
          ?.length || 0
      );
    return currentSubscriptions?.length || 0;
  }, [currentSubscriptions, selectedSubscription]);

  const previousConsumers = previousSubscriptions?.length || 0;

  const consumerPercentageChange = useMemo(
    () => calculatePercentageChange(currentConsumers, previousConsumers),
    [currentConsumers, previousConsumers]
  );

  useEffect(() => {
    let tx = currentTransactions || [];
    if (selectedSubscription)
      tx = tx.filter((t) => t.consumerServiceId === selectedSubscription);
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
  }, [currentTransactions, selectedSubscription]);

  useEffect(() => {
    const usageData = stats
      ?.flatMap((s) => {
        let keys: any = s?.validator?.keys;
        if (!Array.isArray(keys)) return 0;
        if (selectedSubscription)
          keys = keys.filter(
            (k) => k.meta.subscription.serviceId === selectedSubscription
          );
        return keys.flatMap((k) => k.monthlyUsage);
      })
      .sort((a, b) => dayjs(a.time).unix() - dayjs(b.time).unix());

    const aggregatedRequestData = fillMissingDates(aggregateData(usageData));

    setRequestData([
      {
        id: "requests",
        color: "hsl(220, 70%, 50%)",
        data: aggregatedRequestData,
      },
    ]);

    let endpoints = stats?.[0]?.validator?.endpoints;

    if (selectedSubscription) {
      endpoints = endpoints?.filter((e) =>
        e?.subscriptions?.some((s) => s.id === selectedSubscription)
      );
    }

    const consumerMakeup = generateConsumerMakeupData(endpoints);
    setConsumerMakeupData(consumerMakeup);
  }, [stats, selectedSubscription]);

  useEffect(() => {
    const subscriptions =
      validator?.endpoints?.flatMap((e) => e.subscriptions) || [];
    setSubscriptions(subscriptions);
  }, [validator]);

  const handleConsumerChange = (value: string | null) => {
    setSelectedSubscription(value);
    const filteredTransactions = currentTransactions.filter((t) =>
      value ? t.consumerServiceId === value : true
    );
    const filteredSubscriptions = currentSubscriptions.filter((s) =>
      value ? s.id === value : true
    );
    setTransactions(filteredTransactions);
    setSubscriptions(filteredSubscriptions);
  };

  return (
    <Fragment>
      <Box className="flex justify-between items-center mb-7">
        <Title className="text-2xl">Network Overview</Title>
        <Select
          placeholder="Select a customer"
          data={[
            { value: "", label: "All Customers" },
            ...currentSubscriptions.map((sub) => ({
              value: sub?.id as string,
              label: sub?.appName as string,
            })),
          ]}
          value={selectedSubscription}
          onChange={handleConsumerChange}
        />
      </Box>
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
          percentage={`${incomePercentageChange}%`}
          comparison="Compared to last month"
          isPositive
        />
        <StatCard
          title="Total Requests"
          value={monthlyRequests}
          percentage={`${requestPercentageChange}%`}
          comparison="Compared to last month"
          isPositive
        />
        <StatCard
          title="Customers"
          value={currentConsumers.toString()}
          percentage={`${consumerPercentageChange}%`}
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
        <PaymentHistory data={paymentHistoryData} />
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
