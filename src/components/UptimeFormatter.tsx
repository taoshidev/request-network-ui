import { Box, Divider, Group } from "@mantine/core";

export default function UptimeFormatter({ seconds }: { seconds: number }) {
  const days = Math.floor(seconds / (24 * 3600));
  seconds %= 24 * 3600;
  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;
  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);

  return (
    <Group className="grid grid-cols-4 gap-0 justify-stretch">
      <Box className="text-center border-r-2 border-slate-300">
        <Box className="text-xl font-semibold b">{days}</Box>
        day{days !== 1 ? "s" : ""}
      </Box>
      <Box className="text-center border-r-2 border-slate-300">
        <Box className="text-xl font-semibold">{hours}</Box>
        hour{hours !== 1 ? "s" : ""}
      </Box>
      <Box className="text-center border-r-2 border-slate-300">
        <Box className="text-xl font-semibold">{minutes}</Box>
        minute{minutes !== 1 ? "s" : ""}
      </Box>
      <Box className="text-center">
        <Box className="text-xl font-semibold">{seconds}</Box>
        second{seconds !== 1 ? "s" : ""}
      </Box>
    </Group>
  );
}
