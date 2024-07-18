"use client";

import { useMemo, useEffect, useState } from "react";
import { Alert, Text, Box, Button, Title, Select } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { StatCard } from "@/components/StatCard";
import { SubscriptionType } from "@/db/types/subscription";
import ServiceTable from "@/components/ConsumerPaymentDashboard/ServiceTable";
import ApiKeyUsage from "@/components/ConsumerPaymentDashboard/ApiKeyUsage";
import {
  fillMissingDates,
  calculatePercentageChange,
} from "@/utils/validators";

import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import clsx from "clsx";
import PaymentStatusCalendar from "./PaymentStatusCalendar";
import { TransactionType } from "@/interfaces/transaction-type";
import useSWR from "swr";
import {
  deleteUserNotification,
  getUserNotifications,
} from "@/actions/notifications";
import { NOTIFICATION_ICON, NotificationTypes } from "@/hooks/use-notification";
import removeMd from "remove-markdown";
import { captureException } from "@sentry/nextjs";

const colors = [
  "hsl(220, 70%, 50%)",
  "hsl(120, 70%, 50%)",
  "hsl(0, 70%, 50%)",
  "hsl(60, 70%, 50%)",
  "hsl(180, 70%, 50%)",
];

const transformApiKeyUsageData = (subscriptions: any[], colors: string[]) => {
  return (subscriptions || []).map((subscription, index) => ({
    id: subscription?.appName + " - " + subscription?.keyId,
    color: colors[index % colors.length],
    data: fillMissingDates(
      subscription.monthlyKeys.map((key: any) => ({
        x: dayjs(key.time).format("MM/DD/YYYY"),
        y: key.success,
      }))
    ),
  }));
};

export function ConsumerPaymentDashboard({
  currentSubscriptions,
  previousSubscriptions,
  stats,
}: {
  currentSubscriptions: SubscriptionType[];
  previousSubscriptions: SubscriptionType[];
  stats: any;
}) {
  const [loading, setLoading] = useState(true);
  const [requestData, setRequestData] = useState<
    { id: string; color: string; data: { x: string; y: number }[] }[]
  >([]);
  const [subscriptions, setSubscriptions] =
    useState<SubscriptionType[]>(currentSubscriptions);
  const [selectedSubscription, setSelectedSubscription] = useState<
    string | null
  >(null);
  const [health, setHealth] = useState<string>("");
  const [paymentsDue, setPaymentsDue] = useState<number>(0);
  const [transactions, setTransactions] = useState<TransactionType[]>([]);
  const [zoomIn, setZoomIn] = useState(true);
  const {
    data: userNotification,
    isLoading: notificationIsLoading,
    mutate: refreshNotification,
  } = useSWR(
    "/user-latest-notification",
    async () => {
      try {
        const notifications = await getUserNotifications({ limit: 1 });
        const notification = notifications?.[0];

        if (userNotification?.id && notification?.id !== userNotification?.id) {
          setZoomIn(false);
          setTimeout(() => {
            setZoomIn(true);
          }, 500);
        } else {
          setZoomIn(true);
        }

        return notification;
      } catch (e) {
        return userNotification;
      }
    },
    { refreshInterval: 10000 }
  );

  const router = useRouter();

  const monthlyRequests = useMemo(() => {
    let subs: any = stats.subscriptions;
    if (selectedSubscription)
      subs = subs.filter((s) => {
        return s?.id === selectedSubscription;
      });
    const monthlyUsage =
      subs?.map((s) => s.monthlyKeys).flatMap((s) => s.map((s: any) => s)) ||
      [];
    const num = monthlyUsage.reduce((total, { success }) => total + success, 0);
    return num;
  }, [stats, selectedSubscription]);

  const previousMonthlyRequests = useMemo(() => {
    let subs: any = stats.subscriptions;
    if (selectedSubscription)
      subs = subs.filter((s) => s?.id === selectedSubscription);
    const monthlyUsage =
      subs
        ?.map((s) => s.prevMonthlyKeys)
        .flatMap((s) => s.map((s: any) => s)) || [];
    const num = monthlyUsage.reduce((total, { success }) => total + success, 0);
    return num;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats]);

  const requestPercentageChange = useMemo(
    () => calculatePercentageChange(monthlyRequests, previousMonthlyRequests),
    [monthlyRequests, previousMonthlyRequests]
  );

  const amountDue = useMemo(() => {
    setPaymentsDue(0);
    if (!stats?.subscriptions) return 0;

    let subscriptions = stats?.subscriptions;

    if (selectedSubscription) {
      subscriptions = subscriptions?.filter(
        (s) => s.id === selectedSubscription
      );
    }

    const proxyService = subscriptions.flatMap(
      (s: any) => s.proxyService || []
    );

    if (!Array.isArray(proxyService) || proxyService.length === 0) {
      return 0;
    }

    let currencies: string[] = [];
    let statuses: string[] = [];
    const currentTransactionsId = transactions.map((t: any) => t.serviceId);

    let amount: string | number = proxyService.reduce(
      (total: number, it: any) => {
        const paymentType = it?.meta?.service?.paymentType;
        const currencyType = it?.currencyType;
        const createdAt = it?.createdAt;
        const isCurrent = currentTransactionsId.includes(it?.id);
        let outstandingBalance = 0;
        if (!isCurrent) {
          outstandingBalance = parseFloat(
            (currencyType === "CRYPTO" ? it?.outstandingBalance : it?.price) ||
              "0"
          );

          if (paymentType === "SUBSCRIPTION")
            setPaymentsDue(
              subscriptions?.length === 1
                ? 1
                : subscriptions?.length - currentTransactionsId?.length
            );
        }

        currencies.push(it?.currencyType! as string);
        statuses.push(it?.serviceStatusType! as string);

        if (isNaN(outstandingBalance)) {
          return total;
        }

        const today = dayjs();
        const createdDay = dayjs(createdAt);
        const daysDiff = today.diff(createdDay, "day");

        if (daysDiff < 15 || isCurrent) return total;

        if (currencyType === "CRYPTO" || paymentType === "SUBSCRIPTION")
          return total + outstandingBalance;
        return total;
      },
      0
    );

    if (statuses.includes("cancelled")) {
      setHealth("0%");
    } else if (statuses.includes("delinquent")) {
      setHealth("25%");
    } else if (statuses.includes("in grace period")) {
      setHealth("50%");
    } else {
      setHealth("100%");
    }

    const currencyArr = Array.from(new Set(currencies));
    if (currencyArr?.length === 1 && currencyArr[0] === "FIAT") {
      amount = "$" + amount.toFixed(2).toString();
    } else {
      amount =
        "~ " + amount.toFixed(2) + " " + currencyArr.join(", ").toString();
    }
    return amount;
  }, [stats, selectedSubscription, transactions]);

  const subscriptionPercentageChange = useMemo(
    () =>
      calculatePercentageChange(
        subscriptions?.length,
        previousSubscriptions?.length
      ),
    [subscriptions, previousSubscriptions]
  );

  useEffect(() => {
    setLoading(true);
    if (stats && currentSubscriptions) {
      setLoading(false);
    }
  }, [stats, currentSubscriptions]);

  useEffect(() => {
    let subs: any = stats?.subscriptions;
    const transactions = subs?.flatMap((s) => s.transactions || []) || [];
    const uniqueTransactions = Array.from(
      new Map(transactions.map((tx) => [tx.id, tx])).values()
    );
    setTransactions(uniqueTransactions as TransactionType[]);
    if (selectedSubscription)
      subs = subs.filter((s) => s.id === selectedSubscription);
    const usageData = transformApiKeyUsageData(subs, colors);
    setRequestData(usageData);
  }, [stats, selectedSubscription]);

  useEffect(() => {
    const filteredSubscriptions = currentSubscriptions.filter((s) =>
      selectedSubscription ? s?.id === selectedSubscription : true
    );
    setSubscriptions(filteredSubscriptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubscription]);

  const handleConsumerChange = (value: string | null) => {
    setLoading(true);
    setSelectedSubscription(value);
    setTimeout(() => {
      router.refresh();
      setLoading(false);
    }, 0);
  };

  function deleteNotification(id: string) {
    setZoomIn(false);
    setTimeout(() => {
      deleteUserNotification(id);
      refreshNotification();
    }, 500);
  }

  return (
    <Box className={clsx(loading ? "blur-sm" : "blur-none")}>
      <Box className="flex justify-between items-center mb-7">
        <Title className="text-2xl">Network Overview</Title>
        <Select
          placeholder="All Services"
          data={[
            { value: "", label: "All Services" },
            ...currentSubscriptions.map((sub) => ({
              value: sub?.id as string,
              label: sub?.appName as string,
            })),
          ]}
          value={selectedSubscription}
          onChange={handleConsumerChange}
        />
      </Box>

      {userNotification && (
        <Alert
          className={
            "shadow-sm border-gray-200 zoom " + (zoomIn ? "in" : "out")
          }
          color="orange"
          icon={
            NOTIFICATION_ICON[
              NotificationTypes[userNotification.notification.type]
            ]
          }
        >
          <Text className="mb-7 text-zinc-800 text-base font-medium">
            {userNotification.notification.subject}
          </Text>
          <Text className="mb-7 text-zinc-800 text-base font-normal">
            {removeMd(userNotification.notification.content)}
          </Text>
          <Button
            onClick={deleteNotification.bind(
              null,
              userNotification.id as string
            )}
          >
            OK, I got it
          </Button>
        </Alert>
      )}

      <Box className="mt-[40px]">
        <PaymentStatusCalendar transactions={transactions} />
      </Box>

      <Box className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 justify-stretch bg-gray-100 -m-3 mt-[20px]">
        <Box className="p-3">
          <StatCard
            title="Payments Due"
            value={paymentsDue?.toString() || "0"}
            percentage={`${subscriptionPercentageChange}%`}
            comparison="Compared to last month"
            isPositive
          />
        </Box>
        <Box className="p-3">
          <StatCard
            title="Total amount due"
            value={(amountDue! as string) || "0"}
            percentage="-"
            comparison="Compared to last month"
            isPositive={false}
          />
        </Box>
        <Box className="p-3">
          <StatCard
            title="Total Requests"
            value={monthlyRequests || 0}
            percentage={`${requestPercentageChange}%`}
            comparison="Compared to last month"
            isPositive
          />
        </Box>
        <Box className="p-3">
          <StatCard
            title="Health"
            value={health}
            percentage="-"
            comparison="Compared to last month"
            isPositive={false}
            bgColor="bg-orange-500 text-white"
          />
        </Box>
      </Box>
      <Box className="grid grid-cols-[1fr] gap-5 gap-y-7 mt-7">
        {requestData?.length > 0 ? (
          <Box className="">
            <ApiKeyUsage data={requestData} />
          </Box>
        ) : (
          <Alert
            className="shadow-sm border-gray-200"
            color="orange"
            icon={<IconAlertCircle />}
          >
            <Text className="mb-7 text-zinc-800 text-base font-medium">
              There&apos;s not enough data to generate usage data data.
            </Text>
            <Text className="mb-7 text-zinc-800 text-base font-normal">
              Once there are enough data, graph will be aggregated and available
              here.
            </Text>
          </Alert>
        )}
      </Box>
      <ServiceTable subscriptions={subscriptions} />
    </Box>
  );
}
