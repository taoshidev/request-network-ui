import { Text, Group, Card, Badge } from "@mantine/core";
import clsx from "clsx";

export const StatCard = ({
  title,
  value,
  percentage,
  comparison,
  isPositive = true,
  bgColor = "bg-white",
}: {
  title: string;
  value: string;
  percentage: string;
  comparison: string;
  isPositive?: boolean;
  bgColor?: string;
}) => {
  return (
    <Card
      className={clsx(
        "flex flex-col justify-between p-4 shadow-sm border border-gray-200 min-w-[265px] h-[170px]",
        bgColor && bgColor
      )}
    >
      <Text
        className={clsx(
          "text-base font-medium mb-2",
          title === "Health" ? "text-zinc-100" : "text-zinc-800"
        )}
      >
        {title}
      </Text>
      <Text className="font-bold text-[32px]">{value}</Text>
      <Group className="text-sm mt-2 grid grid-cols-[auto_1fr]">
        <Badge
          className="text-sm shadow-sm"
          variant="gradient"
          gradient={{
            from: isPositive ? "#EFF8F4" : "#FDF0EA",
            to: isPositive ? "#EFF8F4" : "#FDF0EA",
            deg: 90,
          }}
        >
          <Text
            className={clsx(
              "font-bold text-sm",
              isPositive ? "text-green-900" : "text-orange-500"
            )}
          >
            {percentage}
          </Text>
        </Badge>
        <Text
          className={clsx(
            "text-xs font-normal",
            title === "Health" ? "text-zinc-100" : "text-neutral-400"
          )}
        >
          {comparison}
        </Text>
      </Group>
    </Card>
  );
};
