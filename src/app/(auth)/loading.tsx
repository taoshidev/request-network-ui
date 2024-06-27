import { Loader, Box } from "@mantine/core";

export default function Loading() {
  return (
    <Box className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden">
      <Box className="absolute inset-0"></Box>
      <Box className="relative text-center">
        <Loader size="lg" />
      </Box>
    </Box>
  );
}
