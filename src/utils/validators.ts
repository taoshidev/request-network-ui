import { getSubscriptions } from "@/actions/subscriptions";
import { and, eq, gte, lte } from "drizzle-orm";
import { subscriptions } from "@/db/schema";
import dayjs from "dayjs";

export const fetchSubscriptions = async (
  validatorId: string,
  start: string,
  end: string
) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  let subs = await getSubscriptions({
    where: and(
      eq(subscriptions.validatorId, validatorId),
      gte(subscriptions.createdAt, startDate),
      lte(subscriptions.createdAt, endDate)
    ),
    with: {
      validator: true,
      endpoint: {
        with: {
          validator: true,
        },
      },
      user: {
        columns: {
          email: true,
        },
      },
    },
  });

  if (subs?.error) subs = [];
  return subs;
};

export const calculatePercentageChange = (
  current: number,
  previous: number
): string => {
  if (previous === 0 && current > 0) return "100";
  if (previous === 0) return "0";
  const change = ((current - previous) / previous) * 100;
  return change.toFixed(2);
};

export const aggregateData = (data, format = "MM/DD/YY") => {
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

export const fillMissingDates = (data, days = 30) => {
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

export const fillMissingDatesForPaymentHistory = (data, days = 60) => {
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

  return Object.keys(filledData)
    .map((date) => ({
      day: date,
      value: filledData[date],
    }))
    .filter((d) => d.value !== 0);
};
