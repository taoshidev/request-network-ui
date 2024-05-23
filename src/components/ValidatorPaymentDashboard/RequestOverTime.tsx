import { ResponsiveLine } from "@nivo/line";
import { Card, Select, Box, Text } from "@mantine/core";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isoWeek from "dayjs/plugin/isoWeek";
import { aggregateDataByWeek, aggregateDataByDay } from "../../utils/date";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

export default function RequestOverTime({ data }) {
  const [timeframe, setTimeframe] = useState("daily");
  const [transformedData, setTransformedData] = useState<any>([]);

  useEffect(() => {
    if (timeframe === "weekly") {
      setTransformedData([
        {
          ...data?.[0],
          data: aggregateDataByWeek(data?.[0]?.data) || [],
        },
      ]);
    } else {
      setTransformedData([
        {
          ...data?.[0],
          data: aggregateDataByDay(data?.[0]?.data) || [],
        },
      ]);
    }
  }, [timeframe, data]);

  return (
    <Card className="shadow-sm border-gray-200" withBorder>
      <Box className="flex justify-between items-center mb-5">
        <Text className="text-base font-bold">Requests Over Time</Text>
        <Select
          value={timeframe}
          onChange={(value) => setTimeframe(value as string)}
          data={[
            { value: "daily", label: "Daily" },
            { value: "weekly", label: "Weekly" },
          ]}
        />
      </Box>
      <Box className="h-40">
        <ResponsiveLine
          animate
          enablePoints={false}
          enableGridX={false}
          enableGridY={false}
          defs={[
            {
              colors: [
                {
                  color: "inherit",
                  offset: 0,
                },
                {
                  color: "inherit",
                  offset: 100,
                  opacity: 0,
                },
              ],
              id: "gradientA",
              type: "linearGradient",
            },
          ]}
          enableArea
          enableSlices="x"
          enableTouchCrosshair
          fill={[
            {
              id: "gradientA",
              match: "*",
            },
          ]}
          curve="monotoneX"
          data={transformedData}
          margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: true,
            reverse: false,
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            // orient: "bottom",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -30,
            legend: "Time",
            legendOffset: 45,
            legendPosition: "middle",
          }}
          axisLeft={{
            // orient: "left",
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Request",
            legendOffset: -40,
            legendPosition: "middle",
          }}
        />
      </Box>
    </Card>
  );
}
