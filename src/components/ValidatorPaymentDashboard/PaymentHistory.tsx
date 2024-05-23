import { Card, Text } from "@mantine/core";
import { ResponsiveTimeRange } from "@nivo/calendar";
import { subDays, formatISO } from "date-fns";

export default function PaymentHistory({ data }: { data: any[] }) {
  const today = new Date();
  const last60Days = subDays(today, 59);

  return (
    <Card className="shadow-sm border-gray-200" withBorder>
      <Text className="text-base mb-5 text-zinc-800 font-normal">
        Payment History <span className="text-sm font-normal text-neutral-400">(Last 60 Days)</span>
      </Text>
      <ResponsiveTimeRange
        data={data}
        from={formatISO(last60Days, { representation: "date" })}
        to={formatISO(today, { representation: "date" })}
        emptyColor="#eeeeee"
        colors={["#eeeeee", "#66FF66", "#33CC33", "#009900", "#006D00"]}
        margin={{ top: 0, right: 0, bottom: 0, left: -65 }}
        dayBorderWidth={2}
        dayBorderColor="#ffffff"
        weekdayTicks={[]}
      />
    </Card>
  );
}
