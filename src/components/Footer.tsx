import React from "react";
import { Box, Text, Group, Stack } from "@mantine/core";

export default function Footer() {
  return (
    <Box className="bg-white px-2 pt-5 pb-8 max-w-6xl m-auto">
      <Box className="container mx-auto flex justify-between">
        <Text className="text-orange-500 text-3xl font-bold font-adlam-display">taoshi</Text>
        <Group className="space-x-16" justify="start" align="start">
          <Stack gap={0} justify="start">
            <Text className="font-bold mb-2">Product</Text>
            <Text>PTN</Text>
            <Text>Models</Text>
            <Text>Dashboard</Text>
            <Text>FAQ</Text>
          </Stack>
          <Stack gap={0} justify="start">
            <Text className="font-bold mb-2">Company</Text>
            <Text>Our Team</Text>
            <Text>Contact Us</Text>
          </Stack>
        </Group>
      </Box>
    </Box>
  );
}
