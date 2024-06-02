import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

export const getStartAndEndTimestamps = () => {
  const end = dayjs().valueOf();
  const start = dayjs().subtract(30, "day").valueOf();
  const prevEnd = start;
  const prevStart = dayjs(start).subtract(1, 'month').unix() * 1000;

  return { start, end, prevStart, prevEnd };
};

export const aggregateDataByWeek = (data) => {
  const aggregatedData = {};

  data?.forEach(({ x, y }) => {
    const date = dayjs(x, "MM/DD/YY");
    const week = date.isoWeek();
    const year = date.year();
    const key = `${year}-W${week}`;

    if (!aggregatedData[key]) {
      aggregatedData[key] = { x: key, y: 0 };
    }
    aggregatedData[key].y += y;
  });

  return Object.keys(aggregatedData)
    .sort(
      (a, b) =>
        dayjs(a.split("-W")[0]).isoWeek(+a.split("-W")[1]).unix() -
        dayjs(b.split("-W")[0]).isoWeek(+b.split("-W")[1]).unix()
    )
    .map((key) => ({
      x: key,
      y: aggregatedData[key].y,
    }));
};

export const aggregateDataByDay = (data) => {
  const aggregatedData = {};
  data?.forEach(({ x, y }) => {
    const date = dayjs(x, "MM/DD/YY").format("MM/DD/YY");
    if (aggregatedData[date]) {
      aggregatedData[date] += y;
    } else {
      aggregatedData[date] = y;
    }
  });
  return Object.keys(aggregatedData).map((date) => ({
    x: date,
    y: aggregatedData[date],
  }));
};

const getStartOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const getEndOfMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

const getStartOfPreviousMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
};

const getEndOfPreviousMonth = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 0);
};
