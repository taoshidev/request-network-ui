import React from "react";
import { Box, Text, Group, Stack, Anchor } from "@mantine/core";
import Link from "next/link";

export default function Footer() {
  return (
    <Box className="bg-white px-4 pt-5 pb-8 max-w-6xl m-auto">
      <Box className="container mx-auto flex justify-between">
        <Text className="text-orange-500 text-3xl font-bold font-adlam-display">
          taoshi
        </Text>
        <Group className="space-x-16" justify="start" align="start">
          <Stack gap={0} justify="start">
            <Text className="font-bold mb-2">Product</Text>
            <Anchor
              component={Link}
              href="https://www.taoshi.io/ptn"
              target="_blank"
            >
              PTN
            </Anchor>
            <Anchor
              component={Link}
              href="https://huggingface.co/Taoshi"
              target="_blank"
            >
              Models
            </Anchor>
            <Anchor
              component={Link}
              href="https://dashboard.taoshi.io"
              target="_blank"
            >
              Dashboard
            </Anchor>
            <Anchor
              component={Link}
              href="https://www.taoshi.io/faq"
              target="_blank"
            >
              FAQ
            </Anchor>
          </Stack>
          <Stack gap={0} justify="start">
            <Text className="font-bold mb-2">Company</Text>
            <Anchor
              component={Link}
              href="https://www.taoshi.io/#team"
              target="_blank"
            >
              Our Team
            </Anchor>
            <Anchor
              component={Link}
              href="mailto: support@taoshi.io"
              target="_blank"
            >
              Contact Us
            </Anchor>
            <Anchor component={Link} href="/privacy-policy">
              Privacy Policy
            </Anchor>
            <Anchor component={Link} href="/terms-of-service">
              Terms of Service
            </Anchor>
          </Stack>
        </Group>
      </Box>
    </Box>
  );
}
