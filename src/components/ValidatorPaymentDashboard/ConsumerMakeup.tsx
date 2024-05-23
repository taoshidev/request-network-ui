import { ResponsivePie } from '@nivo/pie';
import { Card, Text, Box } from '@mantine/core';

export default function ConsumerMakeup({ data }) {
  return (
    <Card className="shadow-sm border-gray-200" withBorder>
      <Text className="text-base mb-5 text-zinc-800 font-normal">
        Customer Makeup <span className="text-sm font-normal text-neutral-400">(Last 60 Days)</span>
      </Text>
      <Box className="h-full">
        <ResponsivePie
          data={data}
          animate
          isInteractive
          motionConfig="gentle"
          margin={{ top: 0, right: 60, bottom: 0, left: 65 }}
          innerRadius={0.6}
          startAngle={-67}
          endAngle={360}
          padAngle={0.7}
          cornerRadius={0}
          enableArcLabels
          arcLinkLabelsOffset={0}
          arcLinkLabelsDiagonalLength={12}
          arcLinkLabelsStraightLength={17}
          arcLinkLabelsTextOffset={0}
          colors={{ scheme: 'nivo' }}
          borderWidth={0}
          borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
        />
      </Box>
    </Card>
  );
};
