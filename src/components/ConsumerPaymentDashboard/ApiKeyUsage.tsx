import { ResponsiveLine } from "@nivo/line";
import { Card, Select, Box, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import { aggregateDataByWeek, aggregateDataByDay } from "../../utils/date";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

export default function ApiKeyUsage({ data }) {
  const [timeframe, setTimeframe] = useState("daily");
  const [transformedData, setTransformedData] = useState<any>([]);

  useEffect(() => {
    if (timeframe === "weekly") {
      setTransformedData(
        data.map((item) => ({
          ...item,
          data: aggregateDataByWeek(item.data) || [],
        }))
      );
    } else {
      setTransformedData(
        data.map((item) => ({
          ...item,
          data: aggregateDataByDay(item.data) || [],
        }))
      );
    }
  }, [timeframe, data]);

  return (
    <Card className="shadow-sm border-gray-200" withBorder>
      <Box className="flex justify-between items-center mb-5">
        <Text className="text-base font-bold">Api Key Usage</Text>
        <Select
          value={timeframe}
          onChange={(value) => setTimeframe(value as string)}
          data={[
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
          ]}
        />
      </Box>
      <Box className="h-80">
        <ResponsiveLine
          animate
          enablePoints={false}
          enableGridX={false}
          enableGridY={false}
          defs={[
            {
              id: "gradientA",
              type: "linearGradient",
              colors: [
                { offset: 0, color: "inherit" },
                { offset: 100, color: "inherit", opacity: 0 },
              ],
            },
          ]}
          enableArea
          enableSlices="x"
          enableTouchCrosshair
          fill={[{ match: "*", id: "gradientA" }]}
          curve="monotoneX"
          data={transformedData}
          margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: "auto", max: "auto", stacked: true, reverse: false }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -30,
            legend: "Time",
            legendOffset: 45,
            legendPosition: "middle",
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Requests",
            legendOffset: -40,
            legendPosition: "middle",
          }}
        />
      </Box>
    </Card>
  );
}
